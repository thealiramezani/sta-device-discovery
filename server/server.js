import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import OpenAI from 'openai'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'

// --------------------------
// Config
// --------------------------
const app = express()
app.use(cors({ origin: '*'})) // tighten to your frontend origin in production
app.use(express.json({ limit: '2mb' }))

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = process.cwd()
const INDEX_DIR = path.join(ROOT, 'rag_index')
const CONFIG_PATH = path.join(ROOT, 'devices.config.json')
if (!fs.existsSync(INDEX_DIR)) fs.mkdirSync(INDEX_DIR, { recursive: true })

// PDF.js font URL (silences warnings)
const fontsPath = path.join(__dirname, 'node_modules', 'pdfjs-dist', 'standard_fonts')
const standardFontDataUrl = pathToFileURL(fontsPath + path.sep).href

// Model + provider
const CHAT_MODEL = process.env.MODEL || 'gpt-4o-mini'
const EMBED_PROVIDER = process.env.EMBED_PROVIDER || 'xenova' // 'xenova' (local) or 'openai'
const OPENAI_EMBED_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small'

// OpenAI client (used for chat; and for embeddings only if EMBED_PROVIDER='openai')
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // baseURL: 'https://api.openai.com/v1'
})

// --------------------------
// Utilities
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
// Local (free) via @xenova/transformers
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
    const emb = await pipe(t, { pooling: 'mean', normalize: true }) // Float32Array
    out.push(Array.from(emb.data))
  }
  return out
}

// OpenAI (with batching/backoff if you later switch to EMBED_PROVIDER=openai)
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
        const res = await openai.embeddings.create({
          model: OPENAI_EMBED_MODEL,
          input: batch
        })
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

      // Skip if already indexed (comment this out to force re-index)
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
    const idx = loadIndex(device_id)
    if (!idx) return res.status(400).json({ error: `No index for device ${device_id}. Run /ingest first.` })

    // embed the query using the same provider so distances are consistent
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

    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      temperature: 0.2,
      messages
    })

    res.json({
      answer: completion.choices[0].message.content,
      top_docs: ranked.map(r => ({ id: r.id, score: r.score }))
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: String(err) })
  }
})

app.get('/health', (_req, res) => res.json({ ok: true }))

const port = Number(process.env.PORT || 8787)
app.listen(port, () => console.log(`RAG server on :${port}`))


app.get('/', (_req, res) => {
  res.type('text/plain').send(
    'STA Device API is running.\n\n' +
    '• GET  /health\n' +
    '• POST /ingest  (run once after deploy)\n' +
    '• POST /chat    { device_id, message }\n'
  );
});


// Ingest job state (simple in-memory tracker)
let ingestJob = {
  running: false,
  startedAt: null,
  finishedAt: null,
  progress: [],   // array of strings you can show in logs/UI
  report: null,   // final { ok, report }
  error: null
};

// Warm up the local embedder (downloads the model once)
app.get('/warmup', async (_req, res) => {
  try {
    await ensureLocalEmbedder();
    return res.json({ ok: true, message: 'Embedder ready' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: String(e) });
  }
});
