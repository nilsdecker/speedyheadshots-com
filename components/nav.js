/* components/nav.js
   Injects the site nav and wires up mobile menu + scroll behaviour.
   Usage: <div id="site-nav"></div> + <script src="/components/nav.js"></script>
*/

(function () {
  const nav = document.getElementById('site-nav');
  if (!nav) return;

  nav.innerHTML = `
    <div class="container">
      <div class="nav-inner">
        <a href="/" class="nav-logo" aria-label="SpeedyHeadshots — Home">
          <svg width="320" height="55" viewBox="0 0 700 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <text font-family="Helvetica Neue,Helvetica,Arial,sans-serif" font-weight="200" font-size="44"
              fill="#292929" x="350" y="70" text-anchor="middle" letter-spacing="7">Speedy Headshots</text>
            <path d="M 112,83.5 C 200,80.5 320,79.5 588,84.5 L 588,85 C 320,81.5 200,83 112,87 Z" fill="#F56B3F"/>
          </svg>
        </a>

        <nav class="nav-links" aria-label="Primary">
          <a href="/corporate/">Corporate</a>
          <a href="/linkedin/">LinkedIn</a>
          <a href="/actor/">Actor</a>
          <a href="/model/">Model</a>
          <a href="/pricing/">Pricing</a>
          <a href="/contact/">Contact</a>
        </nav>

        <a href="/pricing/" class="nav-cta">Book a Session</a>

        <button class="nav-hamburger" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <!-- Mobile menu (shown/hidden via JS) -->
    <nav class="nav-mobile" id="nav-mobile" aria-label="Mobile">
      <a href="/corporate/">Corporate</a>
      <a href="/linkedin/">LinkedIn</a>
      <a href="/actor/">Actor</a>
      <a href="/model/">Model</a>
      <a href="/pricing/">Pricing</a>
      <a href="/contact/">Contact</a>
      <a href="/pricing/" class="btn btn-fill">Book a Session</a>
    </nav>
  `;

  /* ── Active link ── */
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  nav.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (path === href || (href !== '' && path.startsWith(href))) {
      a.classList.add('active');
    }
  });

  /* ── Scroll shadow ── */
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  /* ── Mobile toggle ── */
  const hamburger = nav.querySelector('.nav-hamburger');
  const mobileNav = document.getElementById('nav-mobile');
  hamburger.addEventListener('click', () => {
    const open = mobileNav.style.display === 'flex';
    mobileNav.style.display = open ? 'none' : 'flex';
    hamburger.setAttribute('aria-expanded', String(!open));
    const spans = hamburger.querySelectorAll('span');
    if (!open) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity  = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
})();
