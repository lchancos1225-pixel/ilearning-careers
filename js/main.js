/* ============================================
   株式会社アイ・ラーニング キャリア支援
   メインJavaScript
   ============================================ */

/* --- ハンバーガーメニュー --- */
(function () {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('siteNav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', function () {
    nav.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    const isOpen = nav.classList.contains('open');
    spans[0].style.transform = isOpen ? 'translateY(7px) rotate(45deg)' : '';
    spans[1].style.opacity = isOpen ? '0' : '1';
    spans[2].style.transform = isOpen ? 'translateY(-7px) rotate(-45deg)' : '';
  });

  // メニュー外クリックで閉じる
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
})();

/* --- スクロールアニメーション（Intersection Observer） --- */
(function () {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
})();

/* --- ヒーローフロー切り替え（利用の流れタブ） --- */
function switchFlow(type) {
  const studentFlow = document.getElementById('flow-student');
  const companyFlow = document.getElementById('flow-company');
  const tabs = document.querySelectorAll('.flow-tab');

  if (!studentFlow || !companyFlow) return;

  if (type === 'student') {
    studentFlow.style.display = 'grid';
    companyFlow.style.display = 'none';
    tabs[0].classList.add('active');
    tabs[1].classList.remove('active');
  } else {
    studentFlow.style.display = 'none';
    companyFlow.style.display = 'grid';
    tabs[0].classList.remove('active');
    tabs[1].classList.add('active');
  }
}

/* --- スムーズスクロール（アンカーリンク） --- */
document.querySelectorAll('a[href*="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;

    const hash = href.slice(hashIndex);
    const isCurrentPage =
      href.slice(0, hashIndex) === '' ||
      href.slice(0, hashIndex) === window.location.pathname.split('/').pop();

    if (!isCurrentPage) return;

    const target = document.querySelector(hash);
    if (!target) return;

    e.preventDefault();
    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* --- ヘッダースクロール時の影強調 --- */
(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.12)';
    } else {
      header.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
    }
  }, { passive: true });
})();

/* --- カウントアップアニメーション（stat数字） --- */
(function () {
  function animateCount(el, target, suffix) {
    const duration = 1800;
    const startTime = performance.now();
    const startVal = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = Math.round(startVal + (target - startVal) * eased);
      el.textContent = current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const text = el.textContent.trim();
        const match = text.match(/^([\d,]+)(.*)$/);
        if (!match) return;
        const num = parseInt(match[1].replace(/,/g, ''), 10);
        const suffix = match[2];
        if (!isNaN(num)) animateCount(el, num, suffix);
        statsObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.stat-item .number, .merit-num').forEach(function (el) {
    statsObserver.observe(el);
  });
})();
