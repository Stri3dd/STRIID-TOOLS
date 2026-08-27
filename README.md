# STRII⚡D.UK — 100% Private, Client-Side In-Browser PDF Suite

A modern, lightning-fast web application built for **`striid.uk`**. All document processing happens **100% locally inside the user's web browser** using WebAssembly and JavaScript (PDF-lib & PDF.js).

---

## ⚡ Core Features Built

1. **🔀 Merge PDF:** Combine multiple PDF documents into one, with drag & drop reordering, page count previews, and instant downloads.
2. **✂️ Split & Extract:** Visual thumbnail preview grid with custom page ranges (e.g. `1-3, 5, 8-10`) or odd/even quick selection.
3. **🔄 Rotate & Reorganize:** Interactive page editor to rotate sideways pages (90°/180°), delete unneeded pages, and reorder pages visually.
4. **🖼️ PDF to Images:** Extract PDF pages into crisp, high-res PNG or JPG files with single downloads or complete ZIP bundle export.
5. **📄 Images to PDF:** Convert JPG, PNG, and WebP pictures into a clean, multi-page PDF with layout controls (Fit, A4 Portrait, A4 Landscape).
6. **🔒 Protect PDF:** Encrypt sensitive documents with client-side password security without uploading to any server.
7. **🤖 AI Document Analysis (Pro):** In-browser text layer extraction and executive bulleted summary generation.
8. **👑 Tasteful Striid Pro Tier:** Transparent pricing with **zero popups, zero countdown timers, and zero paywalls** on standard tools.
9. **🛡️ SEO & Comparison Section:** Live comparison table vs. *iLovePDF* and *SmallPDF* highlighting the zero-upload privacy advantage.

---

## 🚀 How to Run Locally

```bash
cd C:\Users\Leo\striid-pdf
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## ☁️ How to Deploy to Cloudflare Pages for `striid.uk`

### Option 1: Direct 1-Click Deployment (via CLI)

Run:
```bash
npm run deploy
```
*Wrangler will prompt you to log into your Cloudflare account and deploy `dist/` instantly.*

### Option 2: Automatic Git Deployment (Recommended)

1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Striid PDF suite"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. In the [Cloudflare Dashboard](https://dash.cloudflare.com/):
   - Go to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
   - Select your repository.
   - Build settings:
     - **Framework preset:** `Vite`
     - **Build command:** `npm run build`
     - **Build output directory:** `dist`
3. Go to **Custom Domains** in your Cloudflare Pages project and add: **`striid.uk`**.
