import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import OpenAI from 'openai'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

// --------------------------
// App + CORS
// --------------------------
const app = express()

const ALLOWED_ORIGINS = [
  'https://thealiramezani.github.io',
  'https://thealiramezani.github.io/sta-device-discovery',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8080'
]

// good cache hygiene for proxies/CDNs
app.use((_, res, next) => { res.setHeader('Vary', 'Origin'); next(); })

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || ALLOWED_ORIGINS.some(o => origin.startsWith(o))) return cb(null, true)
    return cb(new Error('Not allowed by CORS'), false)
  },
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: false,
  maxAge: 86400
}))

app.use(express.json({ limit: '2mb' }))

// --------------------------
// Paths / config
// --------------------------
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = process.cwd()
const INDEX_DIR = path.join(ROOT, 'rag_index')
const CONFIG_PATH = path.join(ROOT, 'devices.config.json')
if (!fs.existsSync(INDEX_DIR)) fs.mkdirSync(INDEX_DIR, { recursive: true })

// PDF.js fonts (silence warnings)
const fontsPath = path.join(__dirname, 'node_modules', 'pdfjs-dist', 'standard_fonts')
const standardFontDataUrl = pathToFileURL(fontsPath + path.sep).href

// Models
const CHAT_MODEL = process.env.MODEL || 'gpt-4o-mini'
const EMBED_PROVIDER = process.env.EMBED_PROVIDER || 'xenova' // 'xenova' or 'openai'
const OPENAI_EMBED_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small'

// OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// --------------------------
// Helpers
// --------------------------
function chunkText(txt, size = 1200, overlap = 200) {
  const chunks = []
  if (!txt || !txt.length) return chunks
  const safeOverlap = Math.max(0, Math.min(overlap, size - 1))
  let i = 0
  while (i < txt.length) {
    const end = Math.min(i + size, txt.length)
    chunks.push(txt.slice(i, end))
    if (end >= txt.length) break
    let nextStart = end - safeOverlap
    if (nextStart <= i) nextStart = end
    i = nextStart
  }
  return chunks
}

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) { dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i] }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8)
}

function idxFile(deviceId) { return path.join(INDEX_DIR, `${deviceId}.json`) }
function loadIndex(deviceId) {
  const p = idxFile(deviceId)
  if (!fs.existsSync(p)) return null
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}
function saveIndex(deviceId, rows) {
  fs.writeFileSync(idxFile(deviceId), JSON.stringify(rows), 'utf8')
}

async function pdfToText(absPath) {
  const data = new Uint8Array(fs.readFileSync(absPath))
  const loadingTask = getDocument({ data, standardFontDataUrl })
  const pdf = await loadingTask.promise
  let text = ''
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p)
    const content = await page.getTextContent()
    text += content.items.map(i => ('str' in i ? i.str : '')).join(' ') + '\n'
  }
  await pdf.cleanup()
  return text.replace(/\s+$/g, '')
}

// --------------------------
// Embeddings (local or OpenAI)
// --------------------------
let localEmbedder = null
async function ensureLocalEmbedder() {
  if (localEmbedder) return localEmbedder
  const { pipeline } = await import('@xenova/transformers')
  localEmbedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  return localEmbedder
}
async function embedTextsLocal(texts) {
  const pipe = await ensureLocalEmbedder()
  const out = []
  for (const t of texts) {
    const emb = await pipe(t, { pooling: 'mean', normalize: true })
    out.push(Array.from(emb.data))
  }
  return out
}

const EMBED_BATCH = Number(process.env.EMBED_BATCH || 32)
const EMBED_SLEEP_MS = Number(process.env.EMBED_SLEEP_MS || 300)
const sleep = ms => new Promise(r => setTimeout(r, ms))
async function embedTextsOpenAI(texts) {
  const out = []
  for (let i = 0; i < texts.length; i += EMBED_BATCH) {
    const batch = texts.slice(i, i + EMBED_BATCH)
    let attempt = 0
    while (true) {
      try {
        const res = await openai.embeddings.create({ model: OPENAI_EMBED_MODEL, input: batch })
        for (const d of res.data) out.push(d.embedding)
        break
      } catch (err) {
        const status = err?.status || err?.code
        if ((status === 429 || (status >= 500 && status < 600)) && attempt < 5) {
          const wait = Math.min(EMBED_SLEEP_MS * (2 ** attempt), 8000)
          console.warn(`embed retry ${attempt+1} after ${wait}ms (${status})`)
          await sleep(wait); attempt++; continue
        }
        throw err
      }
    }
    await sleep(EMBED_SLEEP_MS)
  }
  return out
}
async function embedTexts(texts) {
  if (EMBED_PROVIDER === 'xenova') return embedTextsLocal(texts)
  return embedTextsOpenAI(texts)
}

async function buildIndexForDevice(deviceId) {
  const mapping = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
  const rel = mapping[deviceId]
  if (!rel) throw new Error(`Device ${deviceId} not in devices.config.json`)
  const pdfPath = path.resolve(ROOT, rel)
  if (!fs.existsSync(pdfPath)) throw new Error(`PDF not found at ${pdfPath}`)

  const raw = await pdfToText(pdfPath)
  const chunks = chunkText(raw)
  const embs = await embedTexts(chunks)
  const rows = chunks.map((text, i) => ({ id: `${deviceId}-${i}`, deviceId, text, embedding: embs[i] }))
  saveIndex(deviceId, rows)
  return rows.length
}

async function ensureIndex(deviceId) {
  const existing = loadIndex(deviceId)
  if (existing) return existing
  await buildIndexForDevice(deviceId)
  return loadIndex(deviceId)
}

// no-store middleware for status/debug endpoints
const noStore = (_req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  res.set('Pragma', 'no-cache')
  res.set('Expires', '0')
  res.set('Surrogate-Control', 'no-store')
  res.set('CDN-Cache-Control', 'no-store')
  next()
}

// Abortable timeout wrapper
async function withTimeout(run, ms) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), ms)
  try {
    return await run(ctrl.signal)
  } finally {
    clearTimeout(t)
  }
}

// --------------------------
// Routes
// --------------------------
app.post('/ingest', async (_req, res) => {
  try {
    const mapping = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
    const report = {}

    for (const [deviceId, rel] of Object.entries(mapping)) {
      const pdfPath = path.resolve(ROOT, rel)
      if (!fs.existsSync(pdfPath)) { report[deviceId] = 'missing'; continue }
      if (loadIndex(deviceId)) { report[deviceId] = 'ok (cached)'; continue }

      const raw = await pdfToText(pdfPath)
      const chunks = chunkText(raw)
      const embs = await embedTexts(chunks)
      const rows = chunks.map((text, i) => ({ id: `${deviceId}-${i}`, deviceId, text, embedding: embs[i] }))
      saveIndex(deviceId, rows)
      report[deviceId] = `ok (${rows.length} chunks)`
    }

    res.json({ ok: true, report })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: String(err) })
  }
})

app.post('/chat', async (req, res) => {
  try {
    const { device_id, message, history = [] } = req.body || {}
    if (!device_id || !message) return res.status(400).json({ error: 'device_id and message required' })

    // Build index on demand (or switch to strict: require pre-ingest)
    const idx = await ensureIndex(device_id)
    if (!idx?.length) return res.status(500).json({ error: `Index missing for ${device_id}` })

    // Embed the query with the same provider
    const [q] = await embedTexts([message])
    const ranked = idx
      .map(r => ({ score: cosine(q, r.embedding), text: r.text, id: r.id }))
      .sort((a,b)=> b.score - a.score)
      .slice(0, 6)

    const context = ranked.map((r,i)=> `# Doc ${i+1} (score ${r.score.toFixed(3)})\n${r.text}`).join('\n\n')

    const sys = `You are a clinical device assistant. Answer ONLY from the provided manual excerpts. If unsure or the answer is not present, say you do not have that information in the manual. Use clear, step-by-step instructions. Include specific warnings if present. When relevant, cite like [Doc N].`
    const user = `Device: ${device_id}\nUser question: ${message}\n\nManual excerpts:\n${context}`

    const messages = [
      { role: 'system', content: sys },
      ...history,
      { role: 'user', content: user }
    ]

    const completion = await withTimeout(
      (signal) => openai.chat.completions.create({
        model: CHAT_MODEL,
        temperature: 0.2,
        messages,
        signal
      }),
      30000
    )

    res.json({
      answer: completion.choices[0].message.content,
      top_docs: ranked.map(r => ({ id: r.id, score: r.score }))
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: String(err) })
  }
})

const startedAt = Date.now()
app.get('/health', (_req, res) => {
  const hasIndexes = fs.existsSync(INDEX_DIR) && fs.readdirSync(INDEX_DIR).length > 0
  res.json({ ok: true, uptimeSec: Math.round((Date.now() - startedAt)/1000), hasIndexes })
})

app.get('/', (_req, res) => {
  res.type('text/plain').send(
    'STA Device API is running.\n\n' +
    '• GET  /health\n' +
    '• POST /ingest  (run once after deploy)\n' +
    '• POST /chat    { device_id, message }\n' +
    '• GET  /ingest-status\n' +
    '• GET  /debug-files\n'
  )
})

// ---- Ingest job (background) ----
let ingestJob = { running:false, startedAt:null, finishedAt:null, progress:[], report:null, error:null }

app.get('/warmup', async (_req, res) => {
  try { await ensureLocalEmbedder(); res.json({ ok:true, message:'Embedder ready' }) }
  catch (e) { console.error(e); res.status(500).json({ ok:false, error:String(e) }) }
})

app.post('/ingest-start', async (_req, res) => {
  if (ingestJob.running) return res.json({ ok:true, running:true, message:'Ingest already running' })
  ingestJob = { running:true, startedAt:new Date(), finishedAt:null, progress:[], report:null, error:null }
  ;(async () => {
    try {
      const mapping = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
      const report = {}
      ingestJob.progress.push('Warming up embedder…'); await ensureLocalEmbedder()
      ingestJob.progress.push('Embedder ready.')
      for (const [deviceId, rel] of Object.entries(mapping)) {
        ingestJob.progress.push(`Processing ${deviceId}…`)
        const pdfPath = path.resolve(ROOT, rel)
        if (!fs.existsSync(pdfPath)) { report[deviceId] = 'missing'; ingestJob.progress.push(`  → missing: ${pdfPath}`); continue }
        if (loadIndex(deviceId)) { report[deviceId] = 'ok (cached)'; ingestJob.progress.push('  → cached'); continue }
        const raw = await pdfToText(pdfPath)
        const chunks = chunkText(raw)
        ingestJob.progress.push(`  → ${chunks.length} chunks, embedding…`)
        const embs = await embedTexts(chunks)
        const rows = chunks.map((text, i) => ({ id: `${deviceId}-${i}`, deviceId, text, embedding: embs[i] }))
        saveIndex(deviceId, rows)
        report[deviceId] = `ok (${rows.length} chunks)`; ingestJob.progress.push('  → done')
      }
      ingestJob.report = { ok:true, report }
    } catch (e) {
      console.error(e); ingestJob.error = String(e)
    } finally {
      ingestJob.running = false; ingestJob.finishedAt = new Date()
    }
  })()
  res.json({ ok:true, started:true })
})

app.get('/ingest-status', noStore, (_req, res) => {
  const { running, startedAt, finishedAt, progress, report, error } = ingestJob
  res.json({ ok:true, running, startedAt, finishedAt, progress, report, error, ts:Date.now() })
})

app.get('/debug-files', noStore, (_req, res) => {
  try {
    const mapping = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))
    const details = {}
    for (const [deviceId, rel] of Object.entries(mapping)) {
      const p = path.resolve(ROOT, rel)
      details[deviceId] = { path: p, exists: fs.existsSync(p) }
    }
    res.json({ ok:true, details, ts:Date.now() })
  } catch (e) {
    res.status(500).json({ ok:false, error:String(e) })
  }
})

// Process-level safety nets
process.on('unhandledRejection', (e) => console.error('UNHANDLED_REJECTION', e))
process.on('uncaughtException', (e) => console.error('UNCAUGHT_EXCEPTION', e))

// Start server
const port = Number(process.env.PORT || 8787)
app.listen(port, () => console.log(`RAG server on :${port}`))
