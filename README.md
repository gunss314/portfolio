# Gunasurya S — Premium Portfolio Website

A premium, futuristic personal portfolio with an interactive **Three.js 3D background**,
glassmorphism UI, dark/light themes and full mobile responsiveness.

Built with plain HTML, CSS and JavaScript — no build step, no frameworks.

## 🚀 Quick start

**Option 1 — just open it**

Double-click `index.html`. Everything works locally because Three.js is bundled in
`vendor/` — no internet needed (web fonts gracefully fall back offline).

**Option 2 — local server (recommended)**

```bash
python -m http.server 8877
# then open http://localhost:8877
```

or with VS Code: install *Live Server* → right-click `index.html` → *Open with Live Server*.

## 📁 Structure

```
index.html              → all sections (Home, About, Education, Skills, Projects,
                          Certifications, Video Editing, Contact)
css/style.css           → premium theme, glassmorphism, responsive rules
js/three-bg.js          → 3D animated background (particles, orbs, wireframes)
js/main.js              → nav, theme toggle, typed text, reveal animations,
                          certificate cards + lightbox, video modal, contact form
js/certificates.js      → certificate data registry (EDIT THIS to add certificates)
vendor/three.min.js     → Three.js r128 (bundled, works offline)
assets/img/             → favicon + SVG project/video previews
assets/certificates/    → ➜ PUT YOUR CERTIFICATE FILES HERE
```

## 📜 Certificates

The Certifications section shows Gunasurya's real certificates (verified from the actual
uploaded documents — titles, organizations, dates and credential IDs are only what is
printed on each certificate).

Each entry in `js/certificates.js` supports:

- `file` — full-size image shown in the lightbox
- `thumb` — small fast card thumbnail
- `pdf` — the original untouched PDF (in `assets/certificates/originals/`), used by
  "Open original" and "Download"
- `org`, `date`, `credential` — only what is actually printed on the document

The lightbox supports scroll-to-zoom, drag-to-pan, double-click 1:1, arrow-key navigation
between certificates, and a close (X) button.

To add a new certificate: drop the image in `assets/certificates/`, add an entry in
`js/certificates.js`, done.

## 🎨 Customizing

- **Profile photo** — replace the placeholder in the hero: in `index.html`, swap the
  `<svg class="avatar-placeholder">…</svg>` inside `#avatarImg` for
  `<img src="assets/img/profile.jpg" alt="Gunasurya S">`
- **Colors** — edit the design tokens at the top of `css/style.css` (`--accent`, `--accent-2`, …)
- **Typed words** — edit the `words` array in `js/main.js`
- **Videos** — replace the thumbnail SVGs in `assets/img/` with real thumbnails and drop
  your video URLs/paths into the `data-video` buttons (the modal is wired and ready)

## ♿ Accessibility & performance

- 3D background is `pointer-events: none` and sits behind all content — it can never
  block clicks, links or scrolling
- `prefers-reduced-motion` is fully respected: static 3D frame, no animations
- Particle count / DPR capped on mobile; animation pauses when the tab is hidden
- Keyboard: Escape closes modals and the mobile menu

## 🌐 Deploying (free)

- **GitHub Pages** — push this folder to a repo → Settings → Pages → deploy from branch
- **Netlify / Vercel** — drag-and-drop the folder, done
