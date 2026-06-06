/**
 * VICTOR INVITATION ENGINE V1
 * core/supabase-client.js — Lightweight Supabase REST Client
 * Created by Victor Rizki Valentiano
 *
 * No npm required. Pure fetch-based Supabase REST API wrapper.
 */

window.VictorSupabase = (() => {

  function getConfig() {
    const { SUPABASE_URL, SUPABASE_ANON_KEY } = window.VictorConfig || {};
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('[VictorSupabase] Missing SUPABASE_URL or SUPABASE_ANON_KEY in config/client.js');
    }
    return { url: SUPABASE_URL.replace(/\/$/, ''), key: SUPABASE_ANON_KEY };
  }

  function headers(extra = {}) {
    const { key } = getConfig();
    return {
      'Content-Type': 'application/json',
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Prefer': 'return=representation',
      ...extra,
    };
  }

  // ── SELECT ────────────────────────────────────────────────────
  async function select(table, filters = {}, options = {}) {
    const { url } = getConfig();
    const params = new URLSearchParams();

    // Column selection
    params.set('select', options.select || '*');

    // Filters
    Object.entries(filters).forEach(([col, val]) => {
      params.set(col, `eq.${val}`);
    });

    // Range
    if (options.limit) params.set('limit', options.limit);
    if (options.offset) params.set('offset', options.offset);
    if (options.order) params.set('order', options.order);

    const endpoint = `${url}/rest/v1/${table}?${params.toString()}`;
    const res = await fetch(endpoint, { headers: headers() });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`[Supabase] SELECT ${table} failed: ${err.message || res.status}`);
    }
    return res.json();
  }

  // ── INSERT ────────────────────────────────────────────────────
  async function insert(table, data) {
    const { url } = getConfig();
    const endpoint = `${url}/rest/v1/${table}`;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`[Supabase] INSERT ${table} failed: ${err.message || res.status}`);
    }
    return res.json();
  }

  // ── UPDATE ────────────────────────────────────────────────────
  async function update(table, filters, data) {
    const { url } = getConfig();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([col, val]) => params.set(col, `eq.${val}`));
    const endpoint = `${url}/rest/v1/${table}?${params.toString()}`;
    const res = await fetch(endpoint, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`[Supabase] UPDATE ${table} failed: ${err.message || res.status}`);
    }
    return res.json();
  }

  // ── DELETE ────────────────────────────────────────────────────
  async function remove(table, filters) {
    const { url } = getConfig();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([col, val]) => params.set(col, `eq.${val}`));
    const endpoint = `${url}/rest/v1/${table}?${params.toString()}`;
    const res = await fetch(endpoint, {
      method: 'DELETE',
      headers: headers(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`[Supabase] DELETE ${table} failed: ${err.message || res.status}`);
    }
    return res.status === 204 ? true : res.json();
  }

  // ── High-level helpers ────────────────────────────────────────

  async function getInvitationBySlug(slug) {
    const rows = await select('invitations', { slug });
    return rows[0] || null;
  }

  async function getRSVP(invitationId) {
    return select('rsvp', { invitation_id: invitationId }, { order: 'created_at.desc' });
  }

  async function submitRSVP(payload) {
    return insert('rsvp', payload);
  }

  async function getGuestbook(invitationId) {
    return select('guestbook', { invitation_id: invitationId }, { order: 'created_at.desc' });
  }

  async function submitGuestbook(payload) {
    return insert('guestbook', payload);
  }

  return {
    select, insert, update, remove,
    getInvitationBySlug, getRSVP, submitRSVP, getGuestbook, submitGuestbook,
  };

})();
