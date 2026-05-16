/* ═══════════════════════════════════════════════
   DHAKAIYA BLISS — script.js
   Handles: Navbar, Modals, Order DMs, Animations
═══════════════════════════════════════════════ */

/* ── Helpers ─────────────────────────────────── */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ── Navbar: scroll shrink + mobile toggle ─────── */
const navbar    = $('#navbar');
const navToggle = $('#navToggle');
const navLinks  = $('#navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
  // Animate hamburger → X
  navToggle.classList.toggle('active', open);
});

// Close mobile menu when a link is clicked
navLinks.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav-link')) {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.classList.remove('active');
  }
});

/* ── Smooth scroll helper ──────────────────────── */
function scrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Footer year ───────────────────────────────── */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ═══════════════════════════════════════════════
   ORDER MODAL LOGIC
═══════════════════════════════════════════════ */
const modalOverlay   = $('#modalOverlay');
const modalClose     = $('#modalClose');
const modalProductEl = $('#modalProductName');
const orderIGBtn     = $('#orderIG');
const orderFBBtn     = $('#orderFB');
const copyNotice     = $('#copyNotice');

// Tracks which product is being ordered
let currentProduct = '';
let currentPrice   = '';

/**
 * Opens the order platform selection modal.
 * @param {string} productName  - e.g. "Sigma Drop Shoulder Tee"
 * @param {string} price        - e.g. "৳850"
 */
function openOrderModal(productName, price) {
  currentProduct = productName;
  currentPrice   = price;

  // Update modal content
  modalProductEl.textContent = `${productName} — ${price}`;
  copyNotice.hidden = true;

  // Show modal
  modalOverlay.hidden = false;
  document.body.style.overflow = 'hidden';

  // Focus the first platform button for accessibility
  setTimeout(() => orderIGBtn.focus(), 50);
}

/** Closes the order modal. */
function closeModal() {
  modalOverlay.hidden = true;
  document.body.style.overflow = '';
}

// Close via X button
modalClose.addEventListener('click', closeModal);

// Close by clicking the dark overlay backdrop
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modalOverlay.hidden) closeModal();
});

/* ─── ORDER MESSAGE BUILDER ──────────────────── */
/**
 * Builds the DM message string including product details.
 * @returns {string}
 */
function buildOrderMessage() {
  return `Hi! I'd like to order the "${currentProduct}" (${currentPrice}). Is this available?`;
}

/* ─── CLIPBOARD COPY ─────────────────────────── */
/**
 * Copies text to clipboard using the modern API with a legacy fallback.
 * @param {string} text
 * @returns {Promise<boolean>}
 */
async function copyToClipboard(text) {
  try {
    // Modern Clipboard API (requires HTTPS or localhost)
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Legacy fallback using a temporary textarea element
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    let success = false;
    try {
      success = document.execCommand('copy');
    } catch {
      success = false;
    }
    document.body.removeChild(ta);
    return success;
  }
}

/* ─── OPEN DM LINK WITH FALLBACK ─────────────── */
/**
 * Attempts to open a DM link. On some mobile browsers, Instagram's
 * direct DM links may fail (blocked or redirect to login). In that case,
 * we fall back to the brand's profile page after a short delay.
 *
 * @param {string} dmUrl       - The DM deep-link (e.g., ig.me/m/...)
 * @param {string} fallbackUrl - Profile page if DM link doesn't work
 */
function openDmWithFallback(dmUrl, fallbackUrl) {
  // Attempt to open the DM link in a new tab
  const newTab = window.open(dmUrl, '_blank', 'noopener,noreferrer');

  // If the browser blocked the popup or the tab couldn't open,
  // immediately fall back to the profile page
  if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
    window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    return;
  }

  // On mobile, the DM link may silently fail (tab opens but redirects to
  // Instagram login or home). We set a 2.5s timer to open the fallback
  // profile page in a new tab as a secondary safety net. Users who land
  // on the DM will simply ignore the extra tab; users who got bounced will
  // land on the profile and can manually DM from there.
  setTimeout(() => {
    // Only open fallback if the main tab appears to have navigated away
    // (we cannot reliably detect this cross-origin, so we always open it
    // quietly). The user sees the profile page as a helpful backup.
    // To avoid a jarring double-tab experience on desktop, we skip the
    // fallback there by checking screen width as a rough heuristic.
    if (window.innerWidth < 768) {
      window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
    }
  }, 2500);
}

/* ─── INSTAGRAM ORDER ────────────────────────── */
orderIGBtn.addEventListener('click', async () => {
  const message = buildOrderMessage();

  // Copy message to clipboard first (so user can paste when DM opens)
  const copied = await copyToClipboard(message);

  // Show confirmation notice inside modal
  copyNotice.hidden = false;

  // Instagram DM deep-link: works on the app; falls back to web DM or profile
  // Format: https://ig.me/m/{username}
  // Note: Instagram may not pre-fill the message — the user will paste it.
  const igDmUrl      = 'https://ig.me/m/dhakaiya_bliss';
  const igProfileUrl = 'https://www.instagram.com/dhakaiya_bliss/';

  // Wait a brief moment so the user sees the "copied" confirmation, then open
  setTimeout(() => {
    openDmWithFallback(igDmUrl, igProfileUrl);
    // Close modal after a moment
    setTimeout(closeModal, 800);
  }, 600);
});

/* ─── FACEBOOK ORDER ──────────────────────────── */
orderFBBtn.addEventListener('click', async () => {
  const message = buildOrderMessage();

  // Copy message to clipboard
  const copied = await copyToClipboard(message);

  // Show confirmation notice
  copyNotice.hidden = false;

  // Facebook Messenger deep-link: opens the Messenger app or web chat.
  // Replace PAGE_ID with the brand's actual Facebook Page ID.
  // If unknown, we fall back to the Facebook page URL.
  //
  // Format: https://m.me/{page_username_or_id}
  // The `ref` parameter passes extra context (product name) into Messenger.
  const productRef  = encodeURIComponent(currentProduct.replace(/\s+/g, '_'));
  const fbDmUrl     = `https://m.me/dhakaiyabliss?ref=${productRef}`;
  const fbProfileUrl = 'https://www.facebook.com/dhakaiyabliss';

  setTimeout(() => {
    openDmWithFallback(fbDmUrl, fbProfileUrl);
    setTimeout(closeModal, 800);
  }, 600);
});

/* ═══════════════════════════════════════════════
   INTERSECTION OBSERVER — Scroll Reveal
   Adds .visible to .reveal elements when they
   enter the viewport, triggering CSS transitions.
═══════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after reveal so it only animates once
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

// Elements to reveal on scroll
const revealTargets = [
  '.product-card',
  '.feature-card',
  '.testimonial-card',
  '.about-text',
  '.about-visual',
  '.social-text',
  '.section-header',
];

document.querySelectorAll(revealTargets.join(',')).forEach((el, i) => {
  el.classList.add('reveal');
  // Stagger children in grid layouts
  el.style.transitionDelay = `${(i % 3) * 80}ms`;
  revealObserver.observe(el);
});

/* ═══════════════════════════════════════════════
   NAVBAR: hamburger animation styles (injected)
   Rather than a separate file, these micro-styles
   are injected here to keep the CSS clean.
═══════════════════════════════════════════════ */
(function injectNavToggleStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-toggle.active span:nth-child(1) {
      transform: translateY(6.5px) rotate(45deg);
    }
    .nav-toggle.active span:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }
    .nav-toggle.active span:nth-child(3) {
      transform: translateY(-6.5px) rotate(-45deg);
    }
  `;
  document.head.appendChild(style);
})();