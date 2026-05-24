/* components/footer.js
   Injects the site footer.
   Usage: <div id="site-footer"></div> + <script src="/components/footer.js"></script>
*/

(function () {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  const year = new Date().getFullYear();

  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">

        <div class="footer-brand">
          <div class="nav-logo">Speedy<span style="color:var(--warm)">Headshots</span></div>
          <p>Toronto's headshot studio. Professional photos for executives, LinkedIn profiles, actors, and models. 24-hour delivery. Studio in Regent Park.</p>
          <p style="margin-top:16px;font-size:13px;color:rgba(255,255,255,.4);">
            170 Sumach St, Toronto ON<br>
            <a href="mailto:hi@speedyheadshots.com" style="color:rgba(255,255,255,.4)">hi@speedyheadshots.com</a><br>
            <a href="tel:13473661342" style="color:rgba(255,255,255,.4)">+1 (347) 366 1342</a>
          </p>
        </div>

        <div class="footer-col">
          <h5>Services</h5>
          <a href="/corporate/">Corporate</a>
          <a href="/linkedin/">LinkedIn</a>
          <a href="/actor/">Actor</a>
          <a href="/model/">Model</a>
          <a href="/pricing/">Pricing</a>
        </div>

        <div class="footer-col">
          <h5>Studio</h5>
          <a href="/contact/">Contact</a>
          <a href="/contact/#location">Our Studio</a>
          <a href="/resources/">Resources & Blog</a>
          <a href="/studio-policy/">Studio Policy</a>
        </div>

        <div class="footer-col">
          <h5>Follow</h5>
          <a href="https://instagram.com/speedyheadshots" target="_blank" rel="noopener">Instagram</a>
          <a href="https://linkedin.com/company/speedyheadshots" target="_blank" rel="noopener">LinkedIn</a>
          <a href="https://facebook.com/speedyheadshots" target="_blank" rel="noopener">Facebook</a>
        </div>

      </div>

      <div class="footer-bottom">
        <span>© ${year} SpeedyHeadshots. All rights reserved.</span>
        <a href="/studio-policy/" style="color:rgba(255,255,255,.35);font-size:12px;">Studio Policy</a>
      </div>
    </div>
  `;
})();
