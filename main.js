// ============================================================
//  Axis Landing Starter — main.js
//  GSAP entrance/scroll animations + sticky call bar + form UX.
//  Animations respect prefers-reduced-motion (CSS handles the
//  fallback; GSAP checks it too before running).
// ============================================================

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── GSAP ANIMATIONS ──────────────────────────────────────────
if (window.gsap && !reducedMotion) {
  gsap.registerPlugin(ScrollTrigger);

  // Hero: staggered rise on load
  gsap.from('[data-animate="hero"]', {
    y: 28,
    opacity: 0,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power2.out'
  });

  // Cards / sections: fade-up as they scroll into view
  gsap.utils.toArray('[data-animate="fade-up"]').forEach((el, i) => {
    gsap.from(el, {
      y: 32,
      opacity: 0,
      duration: 0.6,
      delay: (i % 3) * 0.08,          // slight stagger within a row
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });
}

// ── MOBILE NAV TOGGLE ────────────────────────────────────────
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.hidden;
    navMenu.hidden = !open;
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navMenu.querySelectorAll('a').forEach((link) =>
    link.addEventListener('click', () => {
      navMenu.hidden = true;
      navToggle.setAttribute('aria-expanded', 'false');
    })
  );
}

// ── STICKY MOBILE CALL BAR (appears after scrolling past hero) ─
const callBar = document.getElementById('call-bar');
const hero = document.querySelector('.hero');
if (callBar && hero) {
  const observer = new IntersectionObserver(
    ([entry]) => callBar.classList.toggle('is-visible', !entry.isIntersecting),
    { threshold: 0 }
  );
  observer.observe(hero);
}

// ── NETLIFY FORM: AJAX submit so the success message shows in-page ─
const form = document.getElementById('lead-form');
const successMsg = document.getElementById('form-success');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot: silently drop bot submissions
    if (form.querySelector('[name="website"]')?.value) {
      form.hidden = true;
      if (successMsg) successMsg.hidden = false;
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      });
      if (!res.ok) throw new Error(`Form POST failed: ${res.status}`);
      form.hidden = true;
      if (successMsg) successMsg.hidden = false;
    } catch (err) {
      console.error(err);
      if (btn) { btn.textContent = 'Request My Free Estimate'; btn.disabled = false; }
      alert('Something went wrong — please call us directly.');
    }
  });
}
