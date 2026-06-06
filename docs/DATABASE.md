# Victor Invitation Engine V1 — Database Schema
**Created by Victor Rizki Valentiano**

## Supabase / PostgreSQL Setup

Run the following SQL in your Supabase SQL Editor (`Database → SQL Editor → New query`).

---

## 1. TABLES

```sql
-- ─────────────────────────────────────────────
-- TABLE: invitations
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invitations (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  theme            TEXT NOT NULL DEFAULT 'luxury',

  -- Couple
  bride_name       TEXT NOT NULL,
  groom_name       TEXT NOT NULL,
  bride_full       TEXT,
  groom_full       TEXT,
  bride_parents    TEXT,
  groom_parents    TEXT,
  bride_photo      TEXT,
  groom_photo      TEXT,
  couple_photo     TEXT,

  -- Events
  event_date       TIMESTAMPTZ NOT NULL,
  event_date_end   TIMESTAMPTZ,
  akad_date        TIMESTAMPTZ,
  akad_date_end    TIMESTAMPTZ,

  -- Location
  location         TEXT,
  location_akad    TEXT,
  maps_url         TEXT,

  -- Media
  music_url        TEXT,

  -- Rich data (JSON columns)
  gallery          JSONB DEFAULT '[]'::jsonb,
  story            JSONB DEFAULT '[]'::jsonb,
  timeline         JSONB DEFAULT '[]'::jsonb,
  gift_bank        JSONB DEFAULT '[]'::jsonb,
  gift_address     TEXT,

  -- Meta
  is_active        BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: rsvp
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rsvp (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id   UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  guest_name      TEXT NOT NULL,
  attendance      TEXT NOT NULL CHECK (attendance IN ('hadir', 'tidak_hadir', 'mungkin')),
  guest_count     INTEGER DEFAULT 1 CHECK (guest_count >= 1 AND guest_count <= 20),
  message         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- TABLE: guestbook
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS guestbook (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id   UUID NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
  guest_name      TEXT NOT NULL,
  message         TEXT NOT NULL,
  is_approved     BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. INDEXES

```sql
CREATE INDEX IF NOT EXISTS idx_invitations_slug       ON invitations(slug);
CREATE INDEX IF NOT EXISTS idx_rsvp_invitation_id     ON rsvp(invitation_id);
CREATE INDEX IF NOT EXISTS idx_guestbook_invitation_id ON guestbook(invitation_id);
CREATE INDEX IF NOT EXISTS idx_guestbook_approved     ON guestbook(invitation_id, is_approved);
```

---

## 3. ROW LEVEL SECURITY (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp        ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook   ENABLE ROW LEVEL SECURITY;

-- Invitations: public read of active invitations
CREATE POLICY "invitations_public_read"
  ON invitations FOR SELECT
  USING (is_active = TRUE);

-- RSVP: public insert, no read (privacy)
CREATE POLICY "rsvp_public_insert"
  ON rsvp FOR INSERT
  WITH CHECK (TRUE);

-- Guestbook: public insert
CREATE POLICY "guestbook_public_insert"
  ON guestbook FOR INSERT
  WITH CHECK (TRUE);

-- Guestbook: read only approved entries
CREATE POLICY "guestbook_public_read"
  ON guestbook FOR SELECT
  USING (is_approved = TRUE);
```

---

## 4. SAMPLE DATA

```sql
-- Insert a demo invitation
INSERT INTO invitations (
  slug, theme,
  bride_name, groom_name, bride_full, groom_full,
  bride_parents, groom_parents,
  event_date, event_date_end, akad_date, akad_date_end,
  location, location_akad, maps_url,
  music_url,
  story, gift_bank, gift_address
) VALUES (
  'demo', 'luxury',
  'Amara Putri', 'Reza Mahendra',
  'Amara Putri Dewi, S.Pd.', 'Reza Mahendra Putra, S.T.',
  'Putri dari Bapak H. Suharto & Ibu Hj. Sri Rahayu',
  'Putra dari Bapak Ir. Mahendra & Ibu Dr. Indah Sari',
  '2025-09-27 10:00:00+07', '2025-09-27 14:00:00+07',
  '2025-09-27 08:00:00+07', '2025-09-27 10:00:00+07',
  'The Royal Ballroom, Jakarta Selatan',
  'Masjid Al-Ikhlas, Jakarta Selatan',
  'https://maps.google.com/?q=Jakarta+Selatan',
  NULL,
  '[
    {"year":"2019","title":"Pertemuan Pertama","content":"Kami bertemu di sebuah acara seminar kampus yang tak terduga."},
    {"year":"2021","title":"Menjalin Hubungan","content":"Dengan keberanian, ia menyatakan perasaannya di tepi pantai Bali."},
    {"year":"2023","title":"Lamaran","content":"Di bawah sinar bulan purnama, ia melamar dengan cincin warisan keluarga."}
  ]',
  '[
    {"bank":"Bank BCA","account":"1234567890","name":"Amara Putri Dewi"},
    {"bank":"Bank Mandiri","account":"0987654321","name":"Reza Mahendra Putra"}
  ]',
  'Jl. Melati No. 12, Jakarta Selatan 12345'
);
```

---

## 5. AUTO-UPDATE TIMESTAMP

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER invitations_updated_at
  BEFORE UPDATE ON invitations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## JSON Column Schemas

### `gallery` (array of objects)
```json
[
  { "url": "https://...", "caption": "Optional caption" }
]
```

### `story` (array of objects)
```json
[
  { "year": "2019", "title": "Pertemuan Pertama", "content": "Kami bertemu..." }
]
```

### `timeline` (array of objects — optional, auto-generated if empty)
```json
[
  { "time": "08:00", "title": "Akad Nikah", "desc": "Masjid Al-Ikhlas" }
]
```

### `gift_bank` (array of objects)
```json
[
  { "bank": "Bank BCA", "account": "1234567890", "name": "Nama Penerima" }
]
```
