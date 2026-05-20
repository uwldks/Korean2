/* ============================================================
   script.js  v2
   ─────────────────────────────────────────────────────────
   1. 배경 파티클 생성 (표지)
   2. 눈 주변 데이터 점 생성
   3. 스크롤 진행 바
   4. fade-up 등장 애니메이션 (IntersectionObserver)
   5. 네비게이션 점 활성화
   6. 키보드 슬라이드 이동 (↑↓ / PgUp/PgDn)
   ============================================================ */


/* ── 1. 배경 파티클 (표지 섹션) ──────────────────────────
   작은 원이 화면 안에서 랜덤 방향으로 떠다님
   ──────────────────────────────────────────────────────── */
(function createParticles() {
  const container = document.getElementById('particlesBg');
  if (!container) return;

  const COUNT = 30; // 파티클 개수

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'particle';

    // 시작 위치 (무작위)
    const startX = Math.random() * 100; // vw %
    const startY = Math.random() * 100; // vh %

    // 이동 방향 (무작위)
    const tx = (Math.random() - 0.5) * 300; // px
    const ty = (Math.random() - 0.5) * 300;

    // 지속시간 & 딜레이
    const dur   = 7 + Math.random() * 8; // 7~15초
    const delay = Math.random() * 10;    // 0~10초 딜레이

    // 크기
    const size = 2 + Math.random() * 5;

    el.style.cssText = `
      left: ${startX}%;
      top: ${startY}%;
      width: ${size}px;
      height: ${size}px;
      --dur: ${dur}s;
      --delay: ${delay}s;
      --tx: ${tx}px;
      --ty: ${ty}px;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      opacity: ${0.2 + Math.random() * 0.4};
    `;

    container.appendChild(el);
  }
})();


/* ── 2. 눈 주변 데이터 점 (작품 소개 섹션) ──────────────
   감시 눈 SVG 주변에 떠다니는 컬러 점들
   ──────────────────────────────────────────────────────── */
(function createDataDots() {
  const container = document.getElementById('dataDots');
  if (!container) return;

  const COLORS = ['#6B2D2D', '#D8C7A1', '#8B4444', '#3A2E2A', '#A05050'];
  const COUNT  = 12;

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'data-dot-el';

    // 시작 위치 (눈 SVG 하단부 근처에서 무작위 시작)
    const startX = 20 + Math.random() * 60; // %
    const startY = 60 + Math.random() * 30; // %

    // 이동 방향 (눈 방향으로 수렴하도록)
    const dtx = (Math.random() - 0.5) * 80;
    const dty = -(30 + Math.random() * 60);

    const dur   = 1.5 + Math.random() * 2;
    const delay = Math.random() * 3;
    const size  = 4 + Math.random() * 6;

    el.style.cssText = `
      left: ${startX}%;
      top: ${startY}%;
      width: ${size}px;
      height: ${size}px;
      background: ${COLORS[i % COLORS.length]};
      --dur2: ${dur}s;
      --del2: ${delay}s;
      --dtx: ${dtx}px;
      --dty: ${dty}px;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
    `;

    container.appendChild(el);
  }
})();


/* ── 3. 스크롤 진행 바 ───────────────────────────────────
   전체 문서 대비 현재 스크롤 위치를 상단 바 너비에 반영
   ──────────────────────────────────────────────────────── */
const progressBar = document.getElementById('progressBar');

function updateProgress() {
  const scrollTop = window.scrollY;
  const docH      = document.documentElement.scrollHeight - window.innerHeight;
  const pct       = docH > 0 ? (scrollTop / docH) * 100 : 0;
  progressBar.style.width = `${Math.min(pct, 100)}%`;
}

window.addEventListener('scroll', updateProgress, { passive: true });


/* ── 4. 페이드업 스크롤 등장 ─────────────────────────────
   .fade-up 요소가 화면에 진입하면 .visible 클래스 추가
   한 번 등장하면 관찰 중단 (성능 절약)
   ──────────────────────────────────────────────────────── */
const fadeEls = document.querySelectorAll('.fade-up');

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target); // 한 번만 실행
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px',
  }
);

fadeEls.forEach((el) => fadeObserver.observe(el));


/* ── 5. 네비게이션 점 활성화 ─────────────────────────────
   현재 뷰포트에 50% 이상 보이는 섹션에 해당하는 .dot 활성화
   ──────────────────────────────────────────────────────── */
const slides = document.querySelectorAll('.slide');
const dots   = document.querySelectorAll('.dot');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        dots.forEach((dot) => {
          dot.classList.toggle('active', dot.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.5 }
);

slides.forEach((slide) => navObserver.observe(slide));


/* ── 5b. 네비게이션 점 클릭: 부드러운 이동 ──────────────── */
dots.forEach((dot) => {
  dot.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(dot.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ── 6. 키보드 슬라이드 이동 (발표 편의) ────────────────
   ↓ / PageDown  → 다음 섹션
   ↑ / PageUp    → 이전 섹션
   발표 중 마우스 없이 키보드만으로 슬라이드 전환 가능
   ──────────────────────────────────────────────────────── */
const slideIds = Array.from(slides).map((s) => s.id);

function getCurrentSectionIdx() {
  const activeDot = document.querySelector('.dot.active');
  if (!activeDot) return 0;
  const href = activeDot.getAttribute('href').replace('#', '');
  const idx  = slideIds.indexOf(href);
  return idx >= 0 ? idx : 0;
}

document.addEventListener('keydown', (e) => {
  // 입력 필드에서 누른 경우 무시
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

  const cur = getCurrentSectionIdx();

  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    e.preventDefault();
    const next = Math.min(cur + 1, slideIds.length - 1);
    document.getElementById(slideIds[next])
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    e.preventDefault();
    const prev = Math.max(cur - 1, 0);
    document.getElementById(slideIds[prev])
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
