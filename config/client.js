/**
 * VICTOR INVITATION ENGINE V1
 * config/client.js — Global Configuration
 * Created by Victor Rizki Valentiano
 *
 * INSTRUCTIONS:
 * 1. Replace SUPABASE_URL and SUPABASE_ANON_KEY with your project credentials.
 * 2. Set DEFAULT_SLUG to match your invitation's slug in the database.
 * 3. Adjust DEFAULT_THEME if needed.
 */

window.VictorConfig = {

  // ── Supabase Credentials ──────────────────────────────────────
  SUPABASE_URL: 'https://YOUR_PROJECT.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR_ANON_KEY',

  // ── Invitation Defaults ───────────────────────────────────────
  DEFAULT_SLUG: 'demo',
  DEFAULT_THEME: 'luxury',

  // ── Available Themes ──────────────────────────────────────────
  THEMES: ['sakura', 'luxury', 'royal', 'minimal', 'korean', 'dark-elegant'],

  // ── Module Toggle (set false to disable a section) ────────────
  MODULES: {
    opening:   true,
    couple:    true,
    countdown: true,
    story:     true,
    timeline:  true,
    gallery:   true,
    rsvp:      true,
    guestbook: true,
    gift:      true,
    footer:    true,
    music:     true,
  },

  // ── Features ──────────────────────────────────────────────────
  FEATURES: {
    scrollReveal:    true,
    parallax:        true,
    kenBurns:        true,
    floatingPetals:  true,
    particles:       true,
    shareButton:     true,
    analytics:       false, // Set true + add GA_ID when ready
  },

  // ── Analytics (optional) ──────────────────────────────────────
  GA_ID: '',

  // ── Paths ─────────────────────────────────────────────────────
  PATHS: {
    themes:  'themes',
    modules: 'modules',
    assets:  'assets',
  },

  // ── i18n ──────────────────────────────────────────────────────
  LANG: {
    guestPrefix: 'Kepada Yth.',
    guestFallback: 'Dear Guest',
    openButton: 'Buka Undangan',
  },

};
