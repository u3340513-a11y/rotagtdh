document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.site-header');
  var navToggle = document.querySelector('.nav-toggle');
  var navMain = document.querySelector('.nav-main');
  var navOverlay = document.querySelector('.nav-overlay');
  var toTop = document.querySelector('.to-top');

  function onScroll() {
    var scrolled = window.scrollY > 30;
    if (header) header.classList.toggle('is-scrolled', scrolled);
    if (toTop) toTop.classList.toggle('is-visible', window.scrollY > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeNav() {
    if (navToggle) navToggle.classList.remove('is-active');
    if (navMain) navMain.classList.remove('is-open');
    if (navOverlay) navOverlay.classList.remove('is-open');
  }

  if (navToggle && navMain) {
    navToggle.addEventListener('click', function () {
      var isOpen = navMain.classList.toggle('is-open');
      navToggle.classList.toggle('is-active', isOpen);
      if (navOverlay) navOverlay.classList.toggle('is-open', isOpen);
    });
  }
  if (navOverlay) navOverlay.addEventListener('click', closeNav);
  document.querySelectorAll('.nav-main a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Sayaç animasyonu
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    var counterIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        var current = 0;
        var duration = 1400;
        var stepTime = Math.max(Math.floor(duration / target), 12);
        var timer = setInterval(function () {
          current += Math.ceil(target / (duration / stepTime));
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current + suffix;
        }, stepTime);
        counterIo.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterIo.observe(el); });
  }

  // Galeri Lightbox
  var galleryItems = document.querySelectorAll('.gallery-item');
  var lightbox = document.querySelector('.lightbox');
  if (galleryItems.length && lightbox) {
    var lbImg = lightbox.querySelector('img');
    var lbCaption = lightbox.querySelector('figcaption');
    var items = Array.prototype.slice.call(galleryItems);
    var current = 0;

    function openLightbox(index) {
      current = index;
      var el = items[current];
      lbImg.src = el.getAttribute('href');
      lbImg.alt = el.querySelector('img').alt || '';
      lbCaption.textContent = el.getAttribute('data-caption') || '';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    function showRelative(step) {
      current = (current + step + items.length) % items.length;
      openLightbox(current);
    }

    items.forEach(function (el, index) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openLightbox(index);
      });
    });
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-nav.prev');
    var nextBtn = lightbox.querySelector('.lightbox-nav.next');
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', function () { showRelative(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { showRelative(1); });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showRelative(1);
      if (e.key === 'ArrowLeft') showRelative(-1);
    });
  }

  // İletişim formu (statik demo - gerçek gönderim için backend/e-posta servisi bağlanmalı)
  var contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = document.querySelector('#form-note');
      if (note) {
        note.textContent = 'Mesajınız için teşekkür ederiz. En kısa sürede size dönüş yapacağız.';
        note.style.display = 'block';
      }
      contactForm.reset();
    });
  }

  // Aktif yıl
  var yearEl = document.querySelector('#current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
