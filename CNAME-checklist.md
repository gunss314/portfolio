# 🌐 Custom Domain Checklist — Gunasurya S Portfolio

Complete every step in order. Nothing here changes the design or functionality of the site.

---

## 0. Prerequisites

- [ ] A domain purchased (Namecheap, GoDaddy, Hostinger, Cloudflare, etc.)
- [ ] Site deployed to GitHub Pages (repo → Settings → Pages → Deploy from branch `main` / root)

> Tip: GitHub Pages is free; a custom domain costs whatever your registrar charges per year.

---

## 1. Buy / choose the domain

Suggested options for a personal brand:

| Idea | Example |
|---|---|
| Full name | `gunasurya.com` / `gunasurya.in` |
| Name + role | `gunasurya.dev` |
| Initials | `gs-marketer.com` |

---

## 2. Add the custom domain on GitHub

1. Open your repo → **Settings → Pages**
2. Under **Custom domain**, type your domain (e.g. `www.gunasurya.com`) → **Save**
3. Wait for the **DNS check** (⚠️ button) — it stays yellow until DNS propagates (minutes to a few hours)
4. (Optional but recommended) Also set the **apex** domain (`gunasurya.com`) if GitHub asks — GitHub handles the redirect

---

## 3. Create the DNS records at your registrar

**For the `www` subdomain (CNAME — easiest):**

| Type | Host | Value | TTL |
|---|---|---|---|
| CNAME | `www` | `gunss314.github.io` | 1 h |

**For the apex/root domain (A records — all four):**

| Type | Host | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

**If using Cloudflare:** set SSL mode to **Full (strict)**, and disable the orange-cloud proxy
for the two verification steps (you can re-enable after HTTPS is issued).

---

## 4. Commit the CNAME file

GitHub creates `CNAME` (containing your domain) automatically when you save the custom
domain in Settings. If it doesn't appear in the repo root, add it manually:

```
www.gunasurya.com
```

(one line, no `https://`, no trailing slash) — then commit to `main`.

---

## 5. Enforce HTTPS

1. Repo → **Settings → Pages**
2. Wait until **DNS check successful** ✅
3. Tick **☑ Enforce HTTPS**
4. First certificate issue can take up to 24 h — test `https://your-domain.com` afterwards

---

## 6. Update the site's SEO URLs (3 small edits)

Once the final URL is known, update these to the same value:

1. `index.html` → `<link rel="canonical" href="...">`
2. `index.html` → `og:url` (and optionally og:image / twitter:image to absolute URLs)
3. `sitemap.xml` → every `<loc>` entry
4. `robots.txt` → the `Sitemap:` line

> All four must match each other exactly, including `https://` and trailing slash.

---

## 7. Verify after going live

- [ ] `https://your-domain.com` loads the portfolio (padlock visible)
- [ ] `http://` redirects to `https://`
- [ ] `www.` and non-`www` both work (one should redirect to the other)
- [ ] 3D background animates; no console errors (F12 → Console)
- [ ] Certificate cards open the lightbox; PDFs download
- [ ] Share the URL in a LinkedIn draft — the preview card (og:image) appears
- [ ] Submit the sitemap: Google Search Console → Sitemaps → `sitemap.xml`

---

## 8. Optional extras

- [ ] Google Search Console property (verify with a `googleXXXX.html` file)
- [ ] Bing Webmaster Tools
- [ ] Google Analytics 4 (add the gtag snippet before `</head>`)
- [ ] `humans.txt` / favicon for dark mode browser tabs

---

*Keep this file out of the deployed site or delete it after setup — it's just a checklist.*
