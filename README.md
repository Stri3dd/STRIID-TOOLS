<div align="center">

# ⚡ STRII·D TOOLS
### 100% In-Browser, Client-Side Privacy Web Utilities

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Cloudflare Pages](https://img.shields.io/badge/Deployed%20with-Cloudflare%20Pages-F38020?logo=cloudflare)](https://tools.striid.uk)
[![Zero Uploads](https://img.shields.io/badge/Privacy-100%25%20Zero--Upload-10b981)](https://tools.striid.uk)

**Live Web App:** [https://tools.striid.uk](https://tools.striid.uk)

</div>

---

## 🌟 Overview

**Striid Tools** is an open-source, privacy-first alternative to bloated, ad-infested, paywalled conversion websites like *iLovePDF*, *Smallpdf*, and *TinyPNG*. 

Every tool executes **100% locally inside your web browser** using WebAssembly, Web Crypto, and Canvas APIs. Your private documents, PDFs, photos, and passwords **never touch a remote server**.

---

## 🛠️ Tool Suites

### 1. 📄 PDF Suite
- **Merge PDF:** Combine multiple PDF documents with visual drag & drop.
- **Split & Extract:** Visual thumbnail selector with custom page syntax (`1-3, 5, 8`).
- **Rotate & Reorganize:** Rotate sideways pages 90°/180°, delete, and reorder.
- **PDF to Images:** Extract pages into crisp PNG/JPG with 1-click ZIP export.
- **Images to PDF:** Convert JPG, PNG, and WebP into multi-page PDFs.
- **Protect PDF:** Add local AES password encryption.
- **Unlock PDF:** Strip permissions restrictions and decrypt password-locked PDFs.
- **AI Document Summary (Pro):** In-browser key point extractor.

### 2. 🖼️ Image & Media Suite
- **Image Compressor:** Live quality & max-width sliders with real-time file size savings.
- **EXIF & GPS Stripper:** Permanently destroy hidden GPS coordinates and camera metadata.
- **Color Palette Extractor:** Generate dominant HEX & RGB color swatches from any image.

### 3. ✍️ Text & Content Suite
- **AI Text Humanizer (Pro):** Strip robotic AI clichés and introduce authentic human burstiness.
- **Word & Character Counter:** Words, characters, sentences, paragraphs, reading and speaking times.
- **Case Converter:** camelCase, Title Case, UPPERCASE, kebab-case, snake_case, CONSTANT_CASE.

### 4. 🔒 Security & Cryptography Suite
- **Password Generator:** Hardware-grade random entropy password generator.
- **Custom QR Generator:** High-res custom-colored QR codes with 1-click PNG export.

### 5. 🇬🇧 UK Everyday & Fitness Suite
- **UK Take-Home Pay Calculator:** Updated 2026/27 Income Tax, NI, Student Loans, and Pension sacrifice.
- **Race Pace & Stride Calculator:** Pace converter (min/km ↔ min/mile), 5k-to-marathon predictions, and step counts.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Clone the repository
git clone https://github.com/Stri3dd/STRIID-TOOLS.git
cd STRIID-TOOLS

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

---

## 📦 Production Build & Cloudflare Deployment

```bash
# Build static production bundle into dist/
npm run build
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
