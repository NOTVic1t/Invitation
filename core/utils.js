/**
 * VICTOR INVITATION ENGINE V1
 * core/utils.js — Shared Utilities
 * Created by Victor Rizki Valentiano
 */

window.VictorUtils = (() => {

  // ── URL Parameters ────────────────────────────────────────────
  function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }

  function getGuestName() {
    const raw = getQueryParam('to');
    if (!raw) return null;
    return decodeURIComponent(raw).replace(/\+/g, ' ').trim();
  }

  function getSlug() {
    const slugParam = getQueryParam('slug');
    return slugParam || window.VictorConfig?.DEFAULT_SLUG || 'demo';
  }

  // ── DOM Helpers ───────────────────────────────────────────────
  function qs(selector, parent = document) {
    return parent.querySelector(selector);
  }
  function qsa(selector, parent = document) {
    return Array.from(parent.querySelectorAll(selector));
  }

  function createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'class') el.className = v;
      else if (k === 'style') Object.assign(el.style, v);
      else if (k.startsWith('data-')) el.setAttribute(k, v);
      else el[k] = v;
    });
    children.forEach(child => {
      if (typeof child === 'string') el.insertAdjacentHTML('beforeend', child);
      else if (child instanceof Node) el.appendChild(child);
    });
    return el;
  }

  function injectHTML(mountId, html) {
    const mount = document.getElementById(mountId);
    if (mount) mount.innerHTML = html;
  }

  function injectStyle(id, css) {
    let tag = document.getElementById(id);
    if (!tag) {
      tag = document.createElement('style');
      tag.id = id;
      document.head.appendChild(tag);
    }
    tag.textContent = css;
  }

  // ── Date & Time ───────────────────────────────────────────────
  function formatDate(dateStr, locale = 'id-ID', opts = {}) {
    const defaults = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(locale, { ...defaults, ...opts });
  }

  function formatTime(dateStr, locale = 'id-ID') {
    return new Date(dateStr).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  }

  function countdown(targetDate) {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const diff = target - now;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
    return {
      days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours:   Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
      ended:   false,
    };
  }

  // ── String Helpers ────────────────────────────────────────────
  function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function slugify(str) {
    return str.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  // ── Asset URL ─────────────────────────────────────────────────
  function assetURL(path) {
    const base = window.VictorConfig?.PATHS?.assets || 'assets';
    return `${base}/${path}`;
  }

  function themeURL(theme, file) {
    const base = window.VictorConfig?.PATHS?.themes || 'themes';
    return `${base}/${theme}/${file}`;
  }

  function moduleURL(mod, file) {
    const base = window.VictorConfig?.PATHS?.modules || 'modules';
    return `${base}/${mod}/${file}`;
  }

  // ── Fetch Helper ──────────────────────────────────────────────
  async function fetchJSON(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    return res.json();
  }

  async function fetchText(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    return res.text();
  }

  // ── Scroll Reveal (Intersection Observer) ────────────────────
  function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => observer.observe(el));
  }

  // ── Share ─────────────────────────────────────────────────────
  function shareInvitation(title, text, url) {
    if (navigator.share) {
      return navigator.share({ title, text, url });
    }
    return navigator.clipboard.writeText(url).then(() => {
      alert('Link berhasil disalin!');
    });
  }

  // ── Clipboard ─────────────────────────────────────────────────
  function copyToClipboard(text) {
    if (navigator.clipboard) return navigator.clipboard.writeText(text);
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return Promise.resolve();
  }

  // ── Debounce ──────────────────────────────────────────────────
  function debounce(fn, ms = 200) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }

  // ── Emit / Listen ─────────────────────────────────────────────
  const _listeners = {};
  function on(event, fn) {
    if (!_listeners[event]) _listeners[event] = [];
    _listeners[event].push(fn);
  }
  function emit(event, data) {
    (_listeners[event] || []).forEach(fn => fn(data));
  }

  return {
    getQueryParam, getGuestName, getSlug,
    qs, qsa, createElement, injectHTML, injectStyle,
    formatDate, formatTime, countdown,
    sanitize, slugify, pad,
    assetURL, themeURL, moduleURL,
    fetchJSON, fetchText,
    initScrollReveal, shareInvitation, copyToClipboard,
    debounce, on, emit,
  };

})();
