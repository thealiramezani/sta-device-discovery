# Medistant - AI-Powered Medical Device Assistant

![Medistant](https://img.shields.io/badge/AI-Powered-blue) ![License](https://img.shields.io/badge/license-Educational-green) ![Cloudflare](https://img.shields.io/badge/Hosted%20on-Cloudflare%20Pages-orange)

Medistant is an AI-powered web application that helps operating room staff quickly identify medical devices, access device manuals, and get instant answers through an intelligent chat assistant. The application features device detection via camera, voice-enabled chat, and comprehensive device documentation.

**Live Demo**: [https://sta-device-discovery.pages.dev](https://sta-device-discovery.pages.dev)

---

## 🌟 Features

### 📸 **Device Detection**
Take a photo of any medical device and Medistant will automatically identify it using AI-powered image recognition. The system compares your photo against a database of device images using TensorFlow.js and MobileNet embeddings.

### 💬 **AI Chat Assistant**
Ask questions about any device and get instant, accurate answers extracted from official device manuals. Powered by OpenAI GPT-4o-mini, the assistant understands context and provides relevant information including:
- Quick start guides
- Common alarm troubleshooting
- Technical specifications
- Safety procedures
- Contact information

### 🎤 **Voice Support**
Hands-free operation for busy clinical environments:
- **Voice Input**: Speak your questions instead of typing
- **Voice Output**: Listen to answers while working
- **Keyboard Shortcut**: <kbd>Ctrl/Cmd</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> to activate voice
- Toggle voice responses on/off with the speaker button

### 🔍 **Smart Search**
Quickly filter through the device catalog with real-time search. Type any device name, manufacturer, or keyword to instantly find what you need.

### ⚡ **Response Caching**
Frequently asked questions are cached locally for instant responses, reducing API calls and improving response times.

### 📱 **Mobile Friendly**
Fully responsive design that works seamlessly on:
- Desktop computers
- Tablets
- Smartphones
- Touch-screen kiosks

### 🎨 **Modern UI/UX**
- Clean, professional interface
- Collapsible device list
- Bottom-panel chat widget
- Smooth animations and transitions
- High contrast for clinical environments

---

## 🏗️ Architecture

### Frontend (This Repository)
```
┌─────────────────────────────────────────┐
│   Cloudflare Pages (CDN Hosting)        │
│   ├── index.html (SPA)                  │
│   ├── Device Catalog                    │
│   ├── TensorFlow.js Detection           │
│   └── Voice Features                    │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│   Cloudflare Workers (API)              │
│   ├── Chat Endpoint                     │
│   ├── OpenAI Integration                │
│   └── Vector Search                     │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│   OpenAI Platform                        │
│   ├── GPT-4o-mini (Chat)                │
│   ├── Assistants API                    │
│   └── Vector Stores (Manuals)           │
└─────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- Vanilla JavaScript (No framework dependencies)
- TensorFlow.js v4.20.0
- MobileNet v2.1.0
- Web Speech API
- HTML5 Canvas API

**Backend:**
- Cloudflare Workers (Serverless)
- OpenAI GPT-4o-mini
- OpenAI Assistants API
- Vector Search & RAG

**Deployment:**
- Cloudflare Pages (Frontend)
- Cloudflare Workers (Backend)
- GitHub Actions (CI/CD)

---

## 📁 Repository Structure
```
sta-device-discovery/
├── index.html                  # Main application (5000+ lines)
│   ├── HTML Structure          # Layout and markup
│   ├── CSS Styles             # Modern, responsive design
│   └── JavaScript Logic       # App logic, chat, detection
│
├── Devices/                   # Device library
│   ├── Casmed/
│   │   ├── Casmed_photo.jpg              # Main device photo
│   │   ├── foresight_elite.pdf           # Device manual (PDF)
│   │   └── Images/                       # Reference photos for detection
│   │       ├── manifest.json             # Image index
│   │       ├── 1.jpg
│   │       └── 2.jpg
│   │
│   ├── Nico2/
│   │   ├── Nico2_photo.png
│   │   ├── Service Manual Nico2.pdf
│   │   └── Images/
│   │       ├── manifest.json
│   │       ├── 1.jpg
│   │       └── 2.jpg
│   │
│   └── Nellcor_N_395/
│       ├── Nellcor-N-395_photo.jpg
│       ├── Service Manual Nellcore N-395.pdf
│       └── Images/
│           ├── manifest.json
│           ├── 1.jpg
│           └── 2.jpg
│
└── README.md                  # This file
```

---

## 🚀 Quick Start

### View Live Demo

Simply visit: **[https://sta-device-discovery.pages.dev](https://sta-device-discovery.pages.dev)**

No installation required! The app runs entirely in your browser.

### Local Development

1. **Clone the repository**:
```bash
   git clone https://github.com/thealiramezani/sta-device-discovery.git
   cd sta-device-discovery
```

2. **Start a local web server**:

   Using Python 3:
```bash
   python -m http.server 8080
```

   Or using Node.js:
```bash
   npx http-server -p 8080
```

   Or using PHP:
```bash
   php -S localhost:8080
```

3. **Open in browser**:
```
   http://localhost:8080
```

4. **Test the features**:
   - Search for a device
   - Click on a device to view details
   - Upload a device photo for detection
   - Chat with the AI assistant
   - Try voice input (click the microphone 🎤)

---

## 🎯 Usage Guide

### Finding a Device

**Method 1: Browse the List**
1. Click "Device List" button in the sidebar
2. Browse or scroll through available devices
3. Click on any device to view details

**Method 2: Search**
1. Type in the search box (e.g., "oximeter")
2. Results filter in real-time
3. Click on the matching device

**Method 3: Camera Detection**
1. On the home page, click "Take Photo" or "Upload Image"
2. Capture or select a photo of the device
3. Wait for AI analysis (2-3 seconds)
4. Review the top matches and confidence scores
5. Click "View Device" on the best match

### Using the Chat Assistant

1. **Open a device page** (any device)
2. **Click the chat button** (💬) in the bottom right
3. **Ask a question**:
   - Type your question in the input box
   - OR click the microphone 🎤 and speak
4. **Get instant answers** from the device manual
5. **Continue the conversation** - the AI remembers context

**Example Questions:**
- "How do I turn on this device?"
- "What does error code 5 mean?"
- "How do I calibrate the sensor?"
- "What are the alarm settings?"
- "How do I clean this device?"

### Voice Features

**Enable Voice Input:**
1. Click the 🎤 microphone button (turns red when recording)
2. Speak your question clearly
3. The text appears automatically
4. Send or edit as needed

**Enable Voice Output:**
1. Click the 🔊 speaker button (turns green when enabled)
2. Ask any question
3. Listen to the AI response
4. Click 🔊 again to disable

**Keyboard Shortcut:**
- Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> (or <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> on Mac)
- Activates voice input instantly

---

## 🔧 Configuration & Customization

### Connecting to Your Own Backend

The application connects to a Cloudflare Workers backend by default. To use your own backend:

1. **Open `index.html`**
2. **Find the API endpoint** (around line 400):
```javascript
   const response = await fetch('https://device-chat-cloudflare.sta-lab.workers.dev/api/chat', {
```

3. **Replace with your URL**:
```javascript
   const response = await fetch('https://your-worker.your-subdomain.workers.dev/api/chat', {
```

4. **Save and deploy**

### Adding New Devices

#### Step 1: Update the DEVICES Object

In `index.html`, find the `DEVICES` object (around line 200) and add your device:
```javascript
const DEVICES = {
  "YOUR-DEVICE-ID": {
    name: "Full Device Name",
    shortName: "Short Description",
    folder: "ManufacturerName",
    img: "Devices/ManufacturerName/device_photo.jpg",
    icon: "🔧",  // Choose an emoji icon
    desc: "Detailed description of what this device does...",
    manualUrl: "Devices/ManufacturerName/manual.pdf",
    contact: {
      biomed: "+1 (555) 123-4567",
      clinical: "+1 (555) 123-4568"
    },
    quickstart: [
      "Step 1: Do this first",
      "Step 2: Then do this",
      "Step 3: Finally, do this"
    ],
    alarms: [
      "Alarm name → Solution",
      "Another alarm → Another solution"
    ],
    troubleshooting: [
      "Problem → Solution",
      "Another problem → Another solution"
    ]
  },
  // ... existing devices
};
```

#### Step 2: Add Device Files

Create the folder structure:
```
Devices/
└── ManufacturerName/
    ├── device_photo.jpg           # Main photo (800x600px recommended)
    ├── manual.pdf                 # Official device manual
    └── Images/                    # Optional: Additional reference photos
        ├── manifest.json          # List of image files
        ├── 1.jpg                  # Reference photo 1
        ├── 2.jpg                  # Reference photo 2
        └── 3.jpg                  # Reference photo 3
```

**manifest.json** example:
```json
{
  "images": ["1.jpg", "2.jpg", "3.jpg"]
}
```

#### Step 3: Update the Backend

Your backend needs to index the new manual. See the [backend repository](https://github.com/thealiramezani/device-chat-backend) for instructions.

#### Step 4: Test

1. Refresh the page
2. Search for your new device
3. Click on it to verify all information displays correctly
4. Test the chat with questions about the device
5. Test photo detection (if you added reference images)

### Customizing the UI

**Change Colors:**

In `index.html`, find the CSS `:root` variables (around line 20):
```css
:root {
  --primary: #2563eb;        /* Main brand color */
  --primary-dark: #1d4ed8;   /* Darker shade */
  --secondary: #10b981;      /* Accent color */
  --bg: #f8fafc;            /* Background */
  --surface: #ffffff;        /* Cards/panels */
  --text: #0f172a;          /* Main text */
  --text-muted: #64748b;    /* Secondary text */
  --border: #e2e8f0;        /* Borders */
}
```

---

## 🚀 Deployment

### Deploy to Cloudflare Pages (Recommended)

Cloudflare Pages provides:
- ✅ Free hosting
- ✅ Global CDN (fast worldwide)
- ✅ Automatic HTTPS
- ✅ Unlimited bandwidth
- ✅ Auto-deployment from Git

#### Option A: Automatic Deployment (GitHub)

1. **Push to GitHub** (if not already done):
```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
```

2. **Go to Cloudflare Dashboard**:
   - Visit [dash.cloudflare.com](https://dash.cloudflare.com)
   - Log in or sign up (free account)

3. **Create a Pages Project**:
   - Click **Workers & Pages** → **Create application** → **Pages**
   - Click **Connect to Git**
   - Authorize Cloudflare to access GitHub
   - Select your repository: `sta-device-discovery`
   - Click **Begin setup**

4. **Configure Settings**:
```
   Project name: medistant
   Production branch: main
   Framework preset: None
   Build command: (leave empty)
   Build output directory: /
   Root directory: (leave empty)
```

5. **Deploy**:
   - Click **Save and Deploy**
   - Wait 1-2 minutes
   - Your site is live! 🎉

6. **Get Your URL**:
   - You'll receive: `https://medistant.pages.dev`
   - Or set up a custom domain

7. **Automatic Updates**:
   - Every git push automatically deploys
   - View deployment history in dashboard
   - Rollback to previous versions anytime

#### Option B: Manual Deployment

1. **Go to Cloudflare Dashboard**:
   - [dash.cloudflare.com](https://dash.cloudflare.com)
   - **Workers & Pages** → **Create application** → **Pages**
   - **Upload assets**

2. **Upload Files**:
   - Drag and drop:
     - `index.html`
     - Entire `Devices/` folder
   - Or click "Select from computer"

3. **Deploy**:
   - Click **Deploy site**
   - Wait 30-60 seconds
   - Done! 🎉

### Deploy to GitHub Pages

Already works! Your repository is already configured:
- **URL**: [https://thealiramezani.github.io/sta-device-discovery](https://thealiramezani.github.io/sta-device-discovery)
- Automatically updates on git push
- Free hosting via GitHub

### Deploy to Netlify

1. **Drag and Drop**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Drag your project folder to the drop zone
   - Done!

2. **From Git**:
   - Connect to GitHub
   - Select repository
   - Click Deploy
   - Get: `https://yoursite.netlify.app`

### Deploy to Vercel
```bash
npm i -g vercel
cd sta-device-discovery
vercel --prod
```

### Custom Domain

**For Cloudflare Pages:**
1. Go to your Pages project
2. **Custom domains** → **Set up a custom domain**
3. Enter your domain (e.g., `medistant.yourhospital.com`)
4. Add the CNAME record to your DNS
5. Done! (Auto HTTPS included)

---

## 🔐 Backend Setup

The backend is deployed as a Cloudflare Worker (serverless). It handles chat requests and integrates with OpenAI.

### Architecture
```
Frontend (Cloudflare Pages)
    ↓ HTTP Request
Backend (Cloudflare Workers)
    ↓ OpenAI API Call
OpenAI Platform
    └── GPT-4o-mini (Chat)
    └── Assistants API (RAG)
    └── Vector Stores (Manuals)
```

### Deploy Your Own Backend

The backend code is in a separate private repository. To deploy your own:

1. **Get the Backend Code**:
```bash
   git clone https://github.com/thealiramezani/device-chat-backend.git
   cd device-chat-backend
```

2. **Install Wrangler** (Cloudflare CLI):
```bash
   npm install -g wrangler
   wrangler login
```
   This opens a browser for authentication.

3. **Get OpenAI API Key**:
   - Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create a new secret key
   - Copy it (starts with `sk-proj-...`)

4. **Add API Key to Cloudflare**:
```bash
   wrangler secret put OPENAI_API_KEY
```
   Paste your key when prompted.

5. **Deploy**:
```bash
   wrangler deploy
```

6. **Get Your Worker URL**:
   - You'll see: `https://device-chat-backend.YOUR-SUBDOMAIN.workers.dev`
   - Copy this URL

7. **Update Frontend**:
   - Edit `index.html`
   - Replace the API URL with yours
   - Redeploy frontend

### Upload Device Manuals to OpenAI

Your backend needs to index the PDFs. Run the upload script:
```bash
cd device-chat-backend
node upload-pdfs.js
```

This will:
- Upload each PDF to OpenAI
- Create a vector store for each device
- Create an AI assistant for each device
- Output assistant IDs (save these!)

Update `server.js` with the new assistant IDs.

For detailed instructions, see the [backend repository](https://github.com/thealiramezani/device-chat-backend).

---

## 🧪 Testing

### Manual Testing Checklist

**Device Discovery:**
- [ ] Search finds devices correctly
- [ ] Device list expands/collapses
- [ ] All device info displays correctly
- [ ] PDFs open in new tab
- [ ] Contact links work

**Camera Detection:**
- [ ] Photo upload works
- [ ] Camera capture works (mobile)
- [ ] AI identifies devices correctly
- [ ] Confidence scores display
- [ ] "View Device" buttons work

**Chat:**
- [ ] Chat opens/closes correctly
- [ ] Questions get responses
- [ ] Responses are relevant
- [ ] Markdown renders (bold, bullets)
- [ ] Long responses don't break layout
- [ ] Chat history persists during session

**Voice:**
- [ ] Voice input activates
- [ ] Speech is transcribed correctly
- [ ] Voice output speaks responses
- [ ] Toggle works correctly
- [ ] Keyboard shortcut works

**Mobile:**
- [ ] Responsive layout works
- [ ] Touch interactions work
- [ ] Chat panel fits screen
- [ ] Close button visible
- [ ] Voice features work
- [ ] Camera access works

**Performance:**
- [ ] Page loads quickly (<2 seconds)
- [ ] Chat responses are fast (<5 seconds)
- [ ] No console errors
- [ ] Images load properly
- [ ] Cached responses are instant

### Browser Compatibility

| Browser | Desktop | Mobile | Voice | Notes |
|---------|---------|--------|-------|-------|
| Chrome | ✅ | ✅ | ✅ | Recommended |
| Edge | ✅ | ✅ | ✅ | Full support |
| Safari | ✅ | ✅ | ✅ | Full support |
| Firefox | ✅ | ✅ | ⚠️ | Voice limited |
| Opera | ✅ | ✅ | ✅ | Full support |

**Notes:**
- Voice features require HTTPS (or localhost)
- Firefox may not support all voice features
- All modern browsers support core features

---

## 📊 Performance

### Metrics

**Page Load:**
- First Contentful Paint: <1s
- Time to Interactive: <2s

**Chat Response:**
- Without cache: 3-5 seconds
- With cache: <100ms (instant)

**Device Detection:**
- Model load: 2-3 seconds (first time only)
- Image analysis: 1-2 seconds

### Optimization Tips

**For Faster Loading:**
1. Use Cloudflare Pages (global CDN)
2. Compress images (use WebP format)
3. Enable browser caching
4. Lazy-load device images

**For Faster Chat:**
1. Use caching (already implemented)
2. Use GPT-4o-mini (faster than GPT-4)
3. Keep questions concise
4. Deploy backend close to users

**For Better Detection:**
1. Use high-quality reference photos
2. Take photos with good lighting
3. Center device in frame
4. Avoid reflections and glare

---

## 🔒 Security & Privacy

### Data Handling

**What We Store:**
- ❌ No user accounts
- ❌ No personal information
- ❌ No Protected Health Information (PHI)
- ❌ No conversation history (except in browser during session)
- ✅ Device reference images (public)
- ✅ Device manuals (public)

**What Gets Sent to OpenAI:**
- ✅ Device questions (anonymous)
- ✅ Device ID (e.g., "CASMED-FORESIGHT-ELITE")
- ✅ Conversation context (temporary)
- ❌ NO patient data
- ❌ NO user identifiers
- ❌ NO PHI

### Security Features

**Frontend:**
- HTTPS enforced (via Cloudflare)
- No external scripts (except TensorFlow CDN)
- No cookies or tracking
- No authentication required

**Backend:**
- API key stored securely in Cloudflare Workers secrets
- CORS restrictions (only your domain)
- Rate limiting (prevents abuse)
- No data logging

### HIPAA Compliance

⚠️ **Important**: This application is **NOT HIPAA-compliant** and should **NOT** be used with Protected Health Information (PHI).

**Safe Use Cases:**
- Device identification
- Manual lookup
- Training and education
- Technical troubleshooting

**Unsafe Use Cases:**
- ❌ Patient-specific questions
- ❌ Entering patient names or IDs
- ❌ Clinical decision-making
- ❌ Diagnosis or treatment

---

## ⚠️ Disclaimer

### Educational Purpose

This application is a **demonstration and educational tool only**. It is **NOT** intended for:
- Clinical decision-making
- Patient diagnosis or treatment
- Medical advice
- Emergency situations
- Production healthcare environments (without proper validation)

### Limitations

**Accuracy:**
- AI responses are based on device manuals
- May not reflect the latest updates
- May occasionally produce incorrect information
- Always verify critical information with official sources

**Liability:**
- No warranty of any kind
- Use at your own risk
- Not responsible for decisions based on AI responses
- Not a substitute for professional training

**Proper Use:**
- ✅ Device identification and reference
- ✅ Quick access to manual information
- ✅ Training and education
- ✅ Non-critical troubleshooting
- ❌ Emergency situations
- ❌ Critical patient care decisions
- ❌ Replacing official training

### Medical Device Regulations

This software:
- Is NOT a medical device
- Does NOT diagnose, treat, or prevent disease
- Does NOT replace device manufacturer instructions
- Should NOT be used for FDA-regulated activities

**Always follow:**
- Official device manuals
- Hospital policies and procedures
- Manufacturer guidelines
- Regulatory requirements

---

## 🐛 Troubleshooting

### Chat Not Working

**Symptoms:** Error messages, no response, timeout

**Solutions:**
1. **Check backend status**:
   - Visit: `https://device-chat-cloudflare.sta-lab.workers.dev/api/health`
   - Should return: `{"status":"ok",...}`

2. **Check browser console** (F12):
   - Look for red error messages
   - Common issues: CORS, 404, 500

3. **Verify API URL**:
   - Open `index.html`
   - Search for: `fetch('https://`
   - Ensure URL is correct

4. **Try a different browser**:
   - Chrome or Edge recommended

5. **Check internet connection**:
   - Requires stable internet for chat

### Voice Not Working

**Symptoms:** Microphone button doesn't work, no speech recognition

**Solutions:**
1. **Use HTTPS**:
   - Voice requires HTTPS (or localhost)
   - `http://` won't work (except localhost)

2. **Check browser permissions**:
   - Allow microphone access
   - Click the lock icon in address bar
   - Enable microphone

3. **Use Chrome or Edge**:
   - Best browser support
   - Safari/Firefox have limitations

4. **Check microphone**:
   - Test in another app
   - Ensure microphone is connected

5. **Keyboard shortcut**: Try <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd>

### Device Detection Not Working

**Symptoms:** "Model failed to load", no detection results

**Solutions:**
1. **Wait for model to load**:
   - First load takes 10-15 seconds
   - Status shows "Loading model..."

2. **Check internet connection**:
   - TensorFlow.js loads from CDN
   - Requires stable connection

3. **Try a different photo**:
   - Good lighting
   - Device centered
   - Clear focus

4. **Clear browser cache**:
   - Ctrl+F5 (Windows)
   - Cmd+Shift+R (Mac)

5. **Use a different browser**

### Images Not Loading

**Symptoms:** Broken image icons, 404 errors

**Solutions:**
1. **Check file paths**:
   - Verify `Devices/` folder structure
   - Case-sensitive on some systems

2. **Check file names**:
   - Must match exactly in `DEVICES` object
   - Check for spaces, special characters

3. **Verify files exist**:
   - Open `Devices/` folder
   - Confirm all images and PDFs are present

4. **Check server**:
   - Local server must be running
   - Refresh the page

### Mobile Issues

**Symptoms:** Layout broken, buttons not clickable, zoom issues

**Solutions:**
1. **Use modern browser**:
   - Chrome, Safari, or Edge mobile

2. **Clear cache**:
   - Settings → Privacy → Clear cache

3. **Check zoom level**:
   - Should be 100%
   - Pinch to zoom if needed

4. **Rotate device**:
   - Try portrait and landscape

5. **Update browser**:
   - Use latest version

### Getting Help

**Check Console:**
1. Press F12 (desktop) or use browser dev tools
2. Look at Console tab
3. Red errors indicate problems
4. Copy error messages for support

**Common Error Messages:**

| Error | Cause | Solution |
|-------|-------|----------|
| `CORS policy` | Backend blocking request | Update CORS settings |
| `404 Not Found` | Wrong API URL | Check API endpoint |
| `500 Internal Server Error` | Backend error | Check backend logs |
| `Network error` | No internet | Check connection |
| `Timeout` | Request too slow | Try again or check backend |

---

## 📚 API Reference

### Backend Endpoints

The Cloudflare Workers backend exposes these endpoints:

#### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Device chat API is running",
  "assistants": ["CASMED-FORESIGHT-ELITE", "NICO2", "Nellcor-N-395"]
}
```

#### Chat
```http
POST /api/chat
Content-Type: application/json

{
  "message": "How do I turn on this device?",
  "deviceId": "CASMED-FORESIGHT-ELITE",
  "threadId": null
}
```

**Response:**
```json
{
  "response": "To turn on the CASMED FORE-SIGHT Elite...",
  "threadId": "thread_abc123"
}
```

**Parameters:**
- `message` (required): User's question
- `deviceId` (required): Device identifier
- `threadId` (optional): Conversation thread ID for context

**Notes:**
- First request creates a new thread
- Include `threadId` in subsequent requests for conversation context
- Response includes citations removed automatically

---

## 🤝 Contributing

This is an educational project. Contributions are welcome!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**:
```bash
   git checkout -b feature/amazing-feature
```

3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**:
```bash
   git commit -m "Add amazing feature"
```

6. **Push to your fork**:
```bash
   git push origin feature/amazing-feature
```

7. **Open a Pull Request**

### Contribution Ideas

**New Features:**
- [ ] Additional device types
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Offline mode
- [ ] Export chat history
- [ ] Print-friendly view

**Improvements:**
- [ ] Better mobile UX
- [ ] Faster detection
- [ ] More reference images
- [ ] Better error messages
- [ ] Accessibility improvements

**Documentation:**
- [ ] Video tutorials
- [ ] More examples
- [ ] Translation guides
- [ ] Deployment guides

### Code Style

- Use consistent indentation (2 spaces)
- Comment complex logic
- Use meaningful variable names
- Test on multiple browsers
- Keep functions small and focused

---

## 📖 FAQ

### General Questions

**Q: Is this free to use?**  
A: Yes, the frontend is completely free. OpenAI API calls cost depending on usage.

**Q: Can I use this in a hospital?**  
A: This is a demo for educational purposes. For production use, you would need proper validation, HIPAA compliance, and regulatory approval.

**Q: Does it store patient data?**  
A: No. It doesn't store any data about patients or users.

**Q: Do I need an account?**  
A: No. No login or account required.

**Q: Does it work offline?**  
A: Detection works offline after the model loads. Chat requires internet.

### Technical Questions

**Q: What AI model does it use?**  
A: OpenAI GPT-4o-mini for chat, MobileNet for image detection.

**Q: Why Cloudflare Workers?**  
A: Fast, serverless, global distribution, and free tier.

**Q: Can I self-host?**  
A: Yes! Deploy to any static host (Netlify, Vercel, etc.) and run your own backend.

**Q: How much does it cost to run?**  
A: Frontend is free (Cloudflare Pages). Backend costs for OpenAI API depending on usage.

**Q: Is the code open source?**  
A: The frontend is public. The backend is private but available upon reasonable request.

### Usage Questions

**Q: What devices are supported?**  
A: Currently 3 demo devices. You can easily add more by following the "Adding New Devices" section.

**Q: Can I add my own devices?**  
A: Yes! See the Configuration section above.

**Q: Why isn't voice working?**  
A: Voice requires HTTPS and browser permissions. Works best in Chrome/Edge.

**Q: Why is chat slow sometimes?**  
A: First-time questions hit the API. Repeated questions use cache (instant).

**Q: Can I customize the design?**  
A: Yes! All CSS is in `index.html`. Change colors, fonts, layout as needed.

---

## 📞 Support

### Get Help

**Documentation:**
- Read this README thoroughly

- Check the [Troubleshooting](#-troubleshooting) section
- Review [FAQ](#-faq) for common questions

**Issues:**
- Open a GitHub Issue for bugs or feature requests
- Include browser version, steps to reproduce, and error messages
- Check existing issues before creating new ones


### Reporting Bugs

When reporting bugs, please include:

1. **Description**: What happened vs. what you expected
2. **Steps to Reproduce**:
   - Step 1: Go to...
   - Step 2: Click on...
   - Step 3: See error
3. **Environment**:
   - Browser: Chrome 120.0.6099.199
   - OS: Windows 11
   - Device: Desktop/Mobile
4. **Screenshots**: If applicable
5. **Console Errors**: Press F12 → Console tab → Copy errors

**Example:**
- Check the [Troubleshooting](#-troubleshooting) section
- Review [FAQ](#-faq) for common questions

**Issues:**
- Open a GitHub Issue for bugs or feature requests
- Include browser version, steps to reproduce, and error messages
- Check existing issues before creating new ones

### Reporting Bugs

When reporting bugs, please include:

1. **Description**: What happened vs. what you expected
2. **Steps to Reproduce**:
   - Step 1: Go to...
   - Step 2: Click on...
   - Step 3: See error
3. **Environment**:
   - Browser: Chrome 120.0.6099.199
   - OS: Windows 11
   - Device: Desktop/Mobile
4. **Screenshots**: If applicable
5. **Console Errors**: Press F12 → Console tab → Copy errors

**Example:**
```
Title: Chat not responding after device switch

Description: When I switch from Device A to Device B and try to chat, 
nothing happens. No response or error message.

Steps to Reproduce:
1. Open CASMED device page
2. Ask a question in chat (works fine)
3. Click Home button
4. Open NICO2 device page
5. Try to ask a question
6. Chat input doesn't respond

Environment:
- Browser: Chrome 120.0.6099.199
- OS: macOS 14.2
- Device: MacBook Pro 16"

Console Errors:
TypeError: Cannot read property 'id' of null at sendMessage (index.html:945)

```

---

## 🗺️ Roadmap

### Version 1.0 (Current)
- ✅ Device catalog with 3 devices
- ✅ Camera-based detection
- ✅ AI chat assistant
- ✅ Voice input/output
- ✅ Search functionality
- ✅ Response caching
- ✅ Mobile responsive
- ✅ Cloudflare deployment

---

## 🎓 Educational Use

### For Students

**Computer Science Students:**
- Study the code structure (HTML/CSS/JS in one file)
- Learn about AI integration (OpenAI API)
- Understand RESTful APIs
- Practice with modern JavaScript (async/await, fetch)
- Explore machine learning (TensorFlow.js)
- Study responsive design

**Medical/Nursing Students:**
- Learn device identification
- Practice troubleshooting common issues
- Familiarize with device manuals
- Understand alarm meanings
- Study device operation procedures

**Healthcare IT Students:**
- Understand clinical application architecture
- Learn about cloud deployment
- Study security and privacy considerations
- Explore AI in healthcare
- Practice user interface design

### For Educators

**Classroom Use:**
- Demonstrate AI applications in healthcare
- Teach web development concepts
- Show serverless architecture
- Discuss HIPAA and privacy
- Explore human-computer interaction

**Lab Exercises:**
1. **Exercise 1**: Add a new device to the catalog
2. **Exercise 2**: Modify the UI colors and branding
3. **Exercise 3**: Create additional troubleshooting steps
4. **Exercise 4**: Improve the search algorithm
5. **Exercise 5**: Add analytics tracking

**Projects:**
- Fork and customize for your institution
- Add devices specific to your lab
- Integrate with your learning management system
- Create multilingual versions
- Develop mobile app versions

### Research Opportunities

**Potential Research Areas:**
- AI effectiveness in device support
- User experience in clinical environments
- Voice interface usability in healthcare
- Computer vision accuracy for device identification
- Impact on training time reduction
- Cost-benefit analysis vs. traditional methods

---

## 🏆 Acknowledgments

### Built With

**Frontend Technologies:**
- [TensorFlow.js](https://www.tensorflow.org/js) - Machine learning in the browser
- [MobileNet](https://github.com/tensorflow/tfjs-models/tree/master/mobilenet) - Image classification model
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) - Voice recognition and synthesis

**Backend Technologies:**
- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless compute platform
- [OpenAI GPT-4](https://openai.com/gpt-4) - Language model for chat
- [OpenAI Assistants API](https://platform.openai.com/docs/assistants/overview) - Document retrieval and Q&A

**Deployment:**
- [Cloudflare Pages](https://pages.cloudflare.com/) - Static site hosting with global CDN
- [GitHub](https://github.com) - Version control and collaboration
- [GitHub Pages](https://pages.github.com/) - Alternative hosting

### Inspiration

This project was inspired by:
- The need for quick access to device information in clinical settings
- The challenge of remembering procedures for dozens of devices
- The potential of AI to improve healthcare workflows
- The vision of hands-free, voice-enabled clinical tools

---

## 📜 License

### Educational License

This project is released for **educational and demonstration purposes**.

**Permissions:**
- ✅ Use for learning and education
- ✅ Fork and modify for personal projects
- ✅ Use in academic courses and research
- ✅ Share with attribution

**Restrictions:**
- ❌ Commercial use without permission
- ❌ Redistribution without attribution
- ❌ Production healthcare use without proper validation
- ❌ Claiming as your own work

**Attribution Required:**
When using this project, please include:
```
Medistant - AI-Powered Medical Device Assistant
Original work by Ali Ramezani
https://github.com/thealiramezani/sta-device-discovery
```

**Disclaimer:**
This software is provided "as is" without warranty of any kind, express or implied. In no event shall the authors be liable for any claim, damages, or other liability arising from the use of the software.

For commercial use or production deployment in healthcare settings, please contact me.

---

## 👨‍💻 About the Developer

### Ali Ramezani

**PhD Candidate in biomedical Engineering** specializing in medical devices design.

**Contact:**
- 🌐 GitHub: [@thealiramezani](https://github.com/thealiramezani)

---

## 🔗 Links & Resources

### Live Demos
- **Primary URL**: [https://sta-device-discovery.pages.dev](https://sta-device-discovery.pages.dev)
- **Alternative URL**: [https://thealiramezani.github.io/sta-device-discovery](https://thealiramezani.github.io/sta-device-discovery)
- **Backend API**: `https://device-chat-cloudflare.sta-lab.workers.dev`

### Repositories
- **Frontend**: [github.com/thealiramezani/sta-device-discovery](https://github.com/thealiramezani/sta-device-discovery) (Public)
- **Backend**: [github.com/thealiramezani/device-chat-backend](https://github.com/thealiramezani/device-chat-backend) (Private)

### Documentation
- OpenAI API: [platform.openai.com/docs](https://platform.openai.com/docs)
- Cloudflare Workers: [developers.cloudflare.com/workers](https://developers.cloudflare.com/workers)
- TensorFlow.js: [tensorflow.org/js](https://www.tensorflow.org/js)
- Web Speech API: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

### Community
- Star this repository if you find it useful ⭐
- Fork it to create your own version 🍴
- Open issues for bugs or suggestions 🐛
- Submit pull requests for improvements 🚀

### Related Projects
- [OpenAI Assistants](https://platform.openai.com/docs/assistants) - RAG-based Q&A
- [TensorFlow.js Models](https://github.com/tensorflow/tfjs-models) - Pre-trained models
- [Cloudflare Workers Examples](https://developers.cloudflare.com/workers/examples) - Serverless patterns

---

## 📊 Stats & Metrics

### Project Statistics

- **Lines of Code**: ~5,000+
- **Languages**: JavaScript (75%), HTML (15%), CSS (10%)
- **Devices Supported**: 3 (expandable)
- **Dependencies**: 2 (TensorFlow.js, MobileNet)
- **Deployment Time**: <5 minutes
- **Page Load Time**: <2 seconds
- **Chat Response Time**: 3-5 seconds (first time), <100ms (cached)

### Usage Metrics (if deployed publicly)

Track these metrics for your deployment:
- Daily active users
- Number of chat interactions
- Most asked questions
- Device detection accuracy
- Average response time
- Browser/device breakdown

**Tools for Analytics:**
- Google Analytics
- Cloudflare Analytics (built-in)
- Custom event tracking

---

## 🎯 Use Cases

### Clinical Settings

**Operating Room:**
- Quick reference during procedures
- Alarm troubleshooting
- Emergency device setup
- Training new staff

**Biomedical Engineering:**
- Device maintenance
- Technical troubleshooting
- Documentation lookup
- Equipment inventory

**Nursing Stations:**
- Device operation review
- Patient monitoring setup
- Quick problem resolution
- Staff education

**Emergency Department:**
- Rapid device identification
- Immediate troubleshooting
- Cross-trained staff support
- After-hours reference

### Educational Settings

**Medical Schools:**
- Device familiarization
- Clinical skills training
- Simulation lab preparation
- Assessment tools

**Nursing Programs:**
- Equipment training
- Hands-on practice
- OSCE preparation
- Competency verification

**Continuing Education:**
- Staff onboarding
- Competency refresh
- New device introduction
- Certification training

### Administrative Use

**Hospital Management:**
- Equipment standardization
- Training program support
- Cost-benefit analysis
- Workflow optimization

**Quality Assurance:**
- Procedure compliance
- Error reduction
- Training effectiveness
- Documentation verification

---

## 🌍 Internationalization (i18n)

### Current Language Support
- **English** (US) - Primary language

### Adding New Languages

The app is designed to be easily translatable. To add a new language:

1. **Create a translation object** in `index.html`:
```javascript
   const translations = {
     en: {
       welcome: "Welcome to Medistant",
       search: "Search devices...",
       chat: "Ask about this device"
     },
     es: {
       welcome: "Bienvenido a Medistant",
       search: "Buscar dispositivos...",
       chat: "Preguntar sobre este dispositivo"
     }
   };
```

2. **Update all text strings** to use translation keys:
```javascript
   document.querySelector('h2').textContent = translations[currentLang].welcome;
```

3. **Add language selector** to the UI

4. **Test thoroughly** with native speakers

### Planned Languages
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German
- 🇨🇳 Chinese (Simplified)
- 🇯🇵 Japanese

*Volunteers welcome to help with translations!*

---

## ♿ Accessibility

### WCAG Compliance

This application aims to meet WCAG 2.1 Level AA standards:

**Keyboard Navigation:**
- ✅ All interactive elements accessible via keyboard
- ✅ Logical tab order
- ✅ Visible focus indicators
- ✅ Keyboard shortcuts documented

**Screen Reader Support:**
- ✅ Semantic HTML elements
- ✅ ARIA labels where needed
- ✅ Alternative text for images
- ✅ Status announcements

**Visual Design:**
- ✅ High contrast ratios (4.5:1 minimum)
- ✅ Resizable text (up to 200%)
- ✅ No information conveyed by color alone
- ✅ Large touch targets (44x44px minimum)

**Voice Features:**
- ✅ Alternative input method for users with mobility issues
- ✅ Text-to-speech for users with visual impairments

### Testing with Assistive Technology

Tested with:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

### Reporting Accessibility Issues

If you encounter accessibility barriers, please send a message with:
- Description of the issue
- Your assistive technology setup
- Steps to reproduce

---

## 🔄 Changelog

### Version 1.0.0 (Current)
*Released: November 2025*

**Features:**
- Initial release
- Device catalog with 3 devices (CASMED, NICO2, Nellcor)
- AI chat assistant powered by GPT-4o-mini
- Camera-based device detection using TensorFlow.js
- Voice input and output support
- Smart search functionality
- Response caching for instant answers
- Mobile-responsive design
- Cloudflare Pages deployment
- About page with developer info

**Technical:**
- Single-page application architecture
- Cloudflare Workers backend
- OpenAI Assistants API integration
- Vector search for document retrieval
- Zero build process (pure HTML/CSS/JS)

### Pre-release Versions

**v0.3.0** - Beta Testing
- Added voice features
- Improved mobile UI
- Bug fixes

**v0.2.0** - Alpha Testing
- Implemented chat functionality
- Added device detection
- Initial UI design

**v0.1.0** - Prototype
- Basic device catalog
- Static content only

---

## 🎁 Bonus Features

### Hidden Features

**Keyboard Shortcuts:**
- <kbd>Ctrl/Cmd</kbd> + <kbd>Shift</kbd> + <kbd>V</kbd> - Activate voice input
- <kbd>Esc</kbd> - Close chat widget
- <kbd>/</kbd> - Focus search box

**Developer Console Commands:**
```javascript
// Clear chat cache
clearChatCache()

// Show current device info
console.log(window.currentDeviceId)

// Show all devices
console.log(DEVICES)

// Force model reload
initDetector()
```

## 📬 Stay Updated

### Get Notified

**Watch this repository** on GitHub for:
- New releases
- Feature updates
- Bug fixes
- Security patches

**Follow the developer:**
- GitHub: [@thealiramezani](https://github.com/thealiramezani)

---

## 💝 Support This Project

### How You Can Help

**Give a Star ⭐**
If you find this project useful, star it on GitHub! It helps others discover it.

**Share It 📢**
- Share with colleagues
- Post on social media
- Present at conferences
- Write blog posts

**Contribute 🤝**
- Add new devices
- Fix bugs
- Improve documentation
- Translate to other languages

**Provide Feedback 💬**
- Report bugs
- Suggest features
- Share your use case
- Review the code

**Sponsor ☕**
If you'd like to support development:
- Contact me

---

## 🏁 Conclusion

Medistant demonstrates how AI can streamline workflows in healthcare settings. By combining device identification, intelligent chat, and voice capabilities, it provides a modern solution to a common clinical challenge.

**Key Takeaways:**
- 🚀 Fast deployment with Cloudflare Pages
- 💡 Easy to customize and extend
- 🎯 Practical application of AI in healthcare
- 📱 Works on any device
- 🔒 Privacy-focused design
- 📚 Educational and open for learning

---

**Made with ❤️ for improving healthcare workflows**

*Last updated: November 2025*

---

## 📋 Quick Reference Card

### Essential Links
| Resource | URL |
|----------|-----|
| Live Demo | [sta-device-discovery.pages.dev](https://sta-device-discovery.pages.dev) |
| GitHub | [github.com/thealiramezani/sta-device-discovery](https://github.com/thealiramezani/sta-device-discovery) |
| Backend API | `device-chat-cloudflare.sta-lab.workers.dev` |

### Quick Commands
```bash
# Local development
python -m http.server 8080

# Deploy to Cloudflare (backend)
wrangler deploy

# Clear cache (browser console)
clearChatCache()
```

### Keyboard Shortcuts
| Action | Shortcut |
|--------|----------|
| Voice Input | <kbd>Ctrl/Cmd</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd> |
| Close Chat | <kbd>Esc</kbd> |
| Focus Search | <kbd>/</kbd> |

---

**🎉 Thank you for using Medistant!**

*If you found this project helpful, please consider giving it a star ⭐ on GitHub.*
