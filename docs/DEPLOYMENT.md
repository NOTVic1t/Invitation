# Victor Invitation Engine V1 — Deployment Guide
**Created by Victor Rizki Valentiano**

---

## Prerequisites

- GitHub account
- Supabase account (free tier works)
- Text editor (VS Code recommended)

---

## Step 1 — Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose a name, database password, and region
3. Once created, go to **Settings → API**
4. Copy:
   - **Project URL** → `https://xxxx.supabase.co`
   - **anon public** key
5. Go to **SQL Editor → New Query**
6. Paste and run the full SQL from `docs/DATABASE.md`

---

## Step 2 — Configure the Engine

Open `config/client.js` and update:

```js
SUPABASE_URL: 'https://YOUR_PROJECT.supabase.co',  // ← your URL
SUPABASE_ANON_KEY: 'YOUR_ANON_KEY',                 // ← your anon key
DEFAULT_SLUG: 'demo',                                // ← matches slug in DB
DEFAULT_THEME: 'luxury',                             // ← default theme name
```

---

## Step 3 — GitHub Repository

1. Create a new **public** GitHub repository
2. Upload all project files (maintain exact folder structure)
3. Go to **Settings → Pages**
4. Source: **Deploy from a branch**
5. Branch: `main` / Folder: `/ (root)`
6. Click **Save**

Your site will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

---

## Step 4 — Add Invitation Assets

Upload to `assets/`:

| Path | Description |
|------|-------------|
| `assets/images/bride-demo.jpg` | Bride photo (portrait, min 400×500) |
| `assets/images/groom-demo.jpg` | Groom photo (portrait, min 400×500) |
| `assets/images/couple-demo.jpg` | Couple photo (used for OG image) |
| `assets/images/og-default.jpg` | OpenGraph fallback (1200×630) |
| `assets/audio/default-music.mp3` | Background music (MP3, <3MB recommended) |
| `assets/icons/icon-192.png` | PWA icon 192×192 |
| `assets/icons/icon-512.png` | PWA icon 512×512 |

For gallery, upload photos and insert URLs into the `gallery` JSON column in Supabase.

---

## Step 5 — Multiple Invitations

Each invitation is a separate database row with a unique `slug`.

Access invitations via:
```
https://your-site.com/?slug=john-sarah
https://your-site.com/?slug=budi-ani
```

Personalize with guest name:
```
https://your-site.com/?slug=john-sarah&to=Ahmad+Fauzi
```

---

## Step 6 — Theme Selection

Set the `theme` column in the `invitations` table to one of:

| Value | Description |
|-------|-------------|
| `luxury` | Luxury Gold (dark, warm gold) — **default** |
| `sakura` | Sakura Blush (dark, pink accents) |
| `royal` | Royal Navy (deep navy, gold) |
| `minimal` | Minimal Ivory (light, editorial) |
| `korean` | Korean Modern (dark, clean) |
| `dark-elegant` | Dark Elegant (pure black, bronze) |

---

## Supabase Storage (Gallery Photos)

1. Go to **Storage → New Bucket** → name it `gallery`, set to **Public**
2. Upload photos
3. Copy public URL: `https://xxx.supabase.co/storage/v1/object/public/gallery/photo.jpg`
4. Add URLs to the `gallery` JSON column of your invitation

---

## Custom Domain (GitHub Pages)

1. Go to repo **Settings → Pages → Custom domain**
2. Enter your domain (e.g. `undangan.yourdomain.com`)
3. Add a CNAME DNS record pointing to `YOUR_USERNAME.github.io`
4. Enable **Enforce HTTPS**

---

## Performance Checklist

- [ ] Compress photos (use [squoosh.app](https://squoosh.app)) — target <200KB each
- [ ] Use WebP format where possible
- [ ] Keep music file under 3MB
- [ ] Enable Supabase connection pooling for production

---

## Environment Notes

- No build step required — pure static files
- No Node.js or npm needed
- Works on any static host: GitHub Pages, Netlify, Vercel, Cloudflare Pages
- For Netlify/Vercel: deploy the root folder as-is
