document.body.classList.add('js-ready');

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#menu-principal');
const tabs = [...document.querySelectorAll('.product-tab')];
const panels = [...document.querySelectorAll('.screen-panel')];
const gallery = document.querySelector('.system-gallery');

const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav?.classList.toggle('is-open', !open);
  document.body.classList.toggle('menu-open', !open);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}));

tabs.forEach((tab) => tab.addEventListener('click', () => {
  const target = tab.dataset.panel;
  tabs.forEach((item) => {
    const active = item === tab;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
  });
  panels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.screen === target));
}));

document.querySelectorAll('[data-gallery]').forEach((button) => button.addEventListener('click', () => {
  if (!gallery) return;
  const card = gallery.querySelector('.system-shot');
  const gap = Number.parseFloat(getComputedStyle(gallery).columnGap || '0');
  const distance = (card?.getBoundingClientRect().width || gallery.clientWidth * .8) + gap;
  gallery.scrollBy({ left: button.dataset.gallery === 'next' ? distance : -distance, behavior: 'smooth' });
}));

document.querySelectorAll('details').forEach((detail) => detail.addEventListener('toggle', () => {
  if (!detail.open) return;
  document.querySelectorAll('details').forEach((other) => {
    if (other !== detail) other.open = false;
  });
}));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

document.querySelectorAll('[data-track]').forEach((link) => link.addEventListener('click', () => {
  const event = link.dataset.track;
  if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: 'okton_click', element: event });
}));

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
