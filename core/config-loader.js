/**
 * VICTOR INVITATION ENGINE V1
 * core/config-loader.js — Invitation Data Loader
 * Created by Victor Rizki Valentiano
 */

window.VictorConfigLoader = (() => {

  // Demo fallback — used when Supabase is not yet configured
  const DEMO_DATA = {
    id: 'demo-001',
    slug: 'demo',
    theme: 'luxury',
    bride_name: 'Amara Putri',
    groom_name: 'Reza Mahendra',
    bride_full: 'Amara Putri Dewi, S.Pd.',
    groom_full: 'Reza Mahendra Putra, S.T.',
    bride_parents: 'Putri dari Bapak H. Suharto & Ibu Hj. Sri Rahayu',
    groom_parents: 'Putra dari Bapak Ir. Mahendra & Ibu Dr. Indah Sari',
    bride_photo: 'assets/images/bride-demo.jpg',
    groom_photo: 'assets/images/groom-demo.jpg',
    couple_photo: 'assets/images/couple-demo.jpg',
    event_date: '2025-09-27T10:00:00',
    event_date_end: '2025-09-27T14:00:00',
    akad_date: '2025-09-27T08:00:00',
    akad_date_end: '2025-09-27T10:00:00',
    location: 'The Royal Ballroom, Jakarta Selatan',
    location_akad: 'Masjid Al-Ikhlas, Jakarta Selatan',
    maps_url: 'https://maps.google.com/?q=Jakarta+Selatan',
    music_url: 'assets/audio/default-music.mp3',
    gallery: [],
    story: [
      { year: '2019', title: 'Pertemuan Pertama', content: 'Kami bertemu di sebuah acara seminar kampus yang tak terduga.' },
      { year: '2021', title: 'Menjalin Hubungan', content: 'Dengan keberanian, ia menyatakan perasaannya di tepi pantai Bali.' },
      { year: '2023', title: 'Lamaran', content: 'Di bawah sinar bulan purnama, ia melamar dengan cincin warisan keluarga.' },
    ],
    gift_bank: [
      { bank: 'Bank BCA', account: '1234567890', name: 'Amara Putri Dewi' },
      { bank: 'Bank Mandiri', account: '0987654321', name: 'Reza Mahendra Putra' },
    ],
    gift_address: 'Jl. Melati No. 12, Jakarta Selatan 12345',
    created_at: new Date().toISOString(),
  };

  let _data = null;

  async function load() {
    const cfg = window.VictorConfig || {};
    const slug = VictorUtils.getSlug();

    // Skip Supabase if credentials are placeholders
    const isConfigured = cfg.SUPABASE_URL && !cfg.SUPABASE_URL.includes('YOUR_PROJECT');

    if (isConfigured) {
      try {
        const invitation = await VictorSupabase.getInvitationBySlug(slug);
        if (invitation) {
          _data = { ...DEMO_DATA, ...invitation };
          console.info('[VictorEngine] Invitation loaded from Supabase:', slug);
          return _data;
        }
      } catch (e) {
        console.warn('[VictorEngine] Supabase load failed, using demo data.', e.message);
      }
    } else {
      console.info('[VictorEngine] Using demo data (Supabase not configured).');
    }

    _data = { ...DEMO_DATA, slug };
    return _data;
  }

  function get() {
    return _data;
  }

  function getTheme() {
    return (_data && _data.theme) || window.VictorConfig?.DEFAULT_THEME || 'luxury';
  }

  return { load, get, getTheme };

})();
