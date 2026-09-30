
// Sticky header + back-to-top
const header = document.getElementById('siteHeader');
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) { header.classList.add('scrolled'); backTop.classList.add('show'); }
  else { header.classList.remove('scrolled'); backTop.classList.remove('show'); }
});

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Animated counters
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    const dur = 1800; const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterIO.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterIO.observe(el));

// Close mobile menu on link click
document.querySelectorAll('.navbar-collapse a').forEach(link => {
  link.addEventListener('click', () => {
    const collapse = document.querySelector('.navbar-collapse.show');
    if (collapse && window.innerWidth < 992) bootstrap.Collapse.getOrCreateInstance(collapse).hide();
  });
});


















