# Victor Invitation Engine V1

> **Commercial Digital Wedding Invitation Platform**
> Created by **Victor Rizki Valentiano**

---

## Overview

Victor Invitation Engine V1 is a production-grade, modular digital invitation platform built for commercial deployment. It provides a complete wedding invitation experience — cinematic opening, countdown, story timeline, gallery, RSVP, guestbook, and gift section — in a lightweight, dependency-free vanilla JavaScript architecture.

Comparable to IndoInvite, Wedew, DatengYa, and Invitanku — but fully self-hosted on GitHub Pages with a Supabase backend.

---

## Features

| Feature | Status |
|---------|--------|
| Multi-theme system (6 themes) | ✅ |
| Dynamic guest name via `?to=` | ✅ |
| Dynamic invitation data (Supabase) | ✅ |
| RSVP with attendance & message | ✅ |
| Guestbook | ✅ |
| Gift / bank transfer section | ✅ |
| Countdown timer | ✅ |
| Love story timeline | ✅ |
| Photo gallery with lightbox | ✅ |
| Event schedule (timeline) | ✅ |
| Google Maps integration | ✅ |
| Background music player | ✅ |
| Cinematic opening screen | ✅ |
| Share invitation (WhatsApp, link) | ✅ |
| SEO meta tags | ✅ |
| OpenGraph / Twitter Card | ✅ |
| PWA / installable | ✅ |
| Analytics ready (GA4) | ✅ |
| Floating petals / particles | ✅ |
| Scroll reveal animations | ✅ |
| Parallax scrolling | ✅ |
| Ken Burns opening effect | ✅ |
| Mobile-first responsive | ✅ |

---

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Backend**: Supabase (PostgreSQL + REST API)
- **Hosting**: GitHub Pages (or any static host)
- **Database**: PostgreSQL via Supabase

---

## Quick Start

1. **Clone / download** this repository
2. **Set up Supabase** — see `docs/DATABASE.md`
3. **Configure** `config/client.js` with your credentials
4. **Upload assets** to `assets/` folder
5. **Deploy** to GitHub Pages — see `docs/DEPLOYMENT.md`
6. **Visit** `https://your-site.com/?slug=demo&to=Guest+Name`

---

## URL Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `slug` | Invitation identifier | `?slug=budi-ani` |
| `to` | Guest name for personalization | `&to=Ahmad+Fauzi` |

---

## Available Themes

| Theme | Style |
|-------|-------|
| `luxury` | Dark warm gold — editorial luxury |
| `sakura` | Dark pink blush — romantic Japanese |
| `royal` | Deep navy gold — classic formal |
| `minimal` | Light ivory — editorial minimal |
| `korean` | Pure dark — Korean luxury editorial |
| `dark-elegant` | Black bronze italic — cinematic |

---

## Folder Structure

```
/
├── index.html              # Entry point
├── manifest.json           # PWA manifest
├── config/
│   └── client.js           # ← Configure Supabase here
├── core/
│   ├── utils.js            # Shared utilities
│   ├── supabase-client.js  # REST client
│   ├── config-loader.js    # Data loader
│   ├── theme-loader.js     # Theme system
│   ├── module-loader.js    # Dynamic module loader
│   ├── engine.js           # Core engine
│   └── orchestrator.js     # Module orchestration
├── themes/
│   ├── luxury/             # theme.json + theme.css
│   ├── sakura/
│   ├── royal/
│   ├── minimal/
│   ├── korean/
│   └── dark-elegant/
├── modules/
│   ├── opening/            # Cinematic opening screen
│   ├── couple/             # Couple profiles + event details
│   ├── countdown/          # Live countdown timer
│   ├── story/              # Love story timeline
│   ├── timeline/           # Event schedule
│   ├── gallery/            # Photo gallery + lightbox
│   ├── rsvp/               # RSVP form
│   ├── guestbook/          # Guestbook messages
│   ├── gift/               # Gift / bank transfer
│   ├── footer/             # Footer + share buttons
│   └── music/              # Background music player
├── assets/
│   ├── images/
│   ├── audio/
│   └── icons/
└── docs/
    ├── README.md
    ├── DATABASE.md         # SQL schema
    └── DEPLOYMENT.md       # Step-by-step deploy guide
```

---

## Architecture Notes

The engine follows a **boot → load → mount** lifecycle:

1. `VictorEngine.boot()` — triggered on DOMContentLoaded
2. `VictorConfigLoader.load()` — fetches invitation data from Supabase (or demo fallback)
3. `VictorThemeLoader.load(theme)` — injects theme CSS + applies CSS variables from `theme.json`
4. `VictorOrchestrator.mount()` — dynamically loads and initializes each module in order
5. Each module is self-contained: its own HTML template, CSS, and JS init function

**Admin dashboard architecture** is prepared: the Supabase schema supports full CRUD for invitations, RSVP, and guestbook. A future dashboard can be built as a separate authenticated page consuming the same `VictorSupabase` client.

---

## License

Commercial product. Created by Victor Rizki Valentiano.
All rights reserved. Not for redistribution without permission.

---

*Victor Invitation Engine V1 — Crafted with precision for the most important day.*
