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

  // Dil seçici (TR/EN/AR) açılır menü
  var langDropdown = document.querySelector('.lang-dropdown');
  var langToggle = document.querySelector('.lang-dropdown-toggle');
  if (langDropdown && langToggle) {
    langToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = langDropdown.classList.contains('is-open');
      langDropdown.classList.toggle('is-open', !isOpen);
      langToggle.setAttribute('aria-expanded', String(!isOpen));
    });
    document.addEventListener('click', function (e) {
      if (!langDropdown.contains(e.target)) {
        langDropdown.classList.remove('is-open');
        langToggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        langDropdown.classList.remove('is-open');
        langToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Ürünlerimiz menüsü altındaki kategori açılır menüsü
  var navDropdown = document.querySelector('.nav-dropdown');
  var navDropdownToggle = navDropdown ? navDropdown.querySelector('.nav-dropdown-toggle') : null;
  if (navDropdown && navDropdownToggle) {
    navDropdownToggle.addEventListener('click', function (e) {
      if (window.innerWidth > 960) {
        e.preventDefault();
        var isOpen = navDropdown.classList.contains('is-open');
        navDropdown.classList.toggle('is-open', !isOpen);
      }
    });
    document.addEventListener('click', function (e) {
      if (!navDropdown.contains(e.target)) {
        navDropdown.classList.remove('is-open');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') navDropdown.classList.remove('is-open');
    });
  }

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

  // Video Modal Oynatıcı
  var videoCards = document.querySelectorAll('.video-card');
  var videoModal = document.querySelector('.video-modal');
  if (videoCards.length && videoModal) {
    var modalVideo = videoModal.querySelector('video');
    var modalSource = modalVideo.querySelector('source');

    function openVideoModal(src) {
      modalSource.setAttribute('src', src);
      modalVideo.load();
      videoModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      modalVideo.play();
    }
    function closeVideoModal() {
      modalVideo.pause();
      modalVideo.removeAttribute('src');
      modalSource.setAttribute('src', '');
      videoModal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
    videoCards.forEach(function (card) {
      card.addEventListener('click', function () {
        openVideoModal(card.getAttribute('data-video'));
      });
    });
    var videoCloseBtn = videoModal.querySelector('.lightbox-close');
    if (videoCloseBtn) videoCloseBtn.addEventListener('click', closeVideoModal);
    videoModal.addEventListener('click', function (e) {
      if (e.target === videoModal) closeVideoModal();
    });
    document.addEventListener('keydown', function (e) {
      if (videoModal.classList.contains('is-open') && e.key === 'Escape') closeVideoModal();
    });
  }

  // İletişim formu (statik demo - gerçek gönderim için backend/e-posta servisi bağlanmalı)
  var contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = document.querySelector('#form-note');
      if (note) {
        note.textContent = contactForm.getAttribute('data-success-message') || 'Mesajınız için teşekkür ederiz. En kısa sürede size dönüş yapacağız.';
        note.style.display = 'block';
      }
      contactForm.reset();
    });
  }

  // Ürün kategorileri: kart listesi <-> ürün detayı geçişi
  var productSections = document.querySelectorAll('[data-product-section]');
  productSections.forEach(function (section) {
    var thumbGrid = section.querySelector('.product-grid');
    var detailGrid = section.querySelector('.product-detail-grid');
    var backBtn = section.querySelector('.back-to-list');
    if (!thumbGrid || !detailGrid) return;

    function slugify(text) {
      return text
        .toLowerCase()
        .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
        .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-+|-+$)/g, '');
    }

    function placeholderMarkup() {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><small>Görsel Yakında</small>';
    }

    var cards = Array.prototype.slice.call(detailGrid.querySelectorAll('.product-detail-card'));
    cards.forEach(function (card) {
      var nameEl = card.querySelector('.product-detail-info h3');
      var name = nameEl ? nameEl.textContent.trim() : 'Ürün';
      if (!card.id) card.id = slugify(name);
      card.classList.add('is-hidden');

      var imageUrl = card.getAttribute('data-image');

      // Detay kartına ürün görseli / görsel yeri ekle
      var info = card.querySelector('.product-detail-info');
      if (info && !info.querySelector('.product-detail-image')) {
        var imgWrap = document.createElement('div');
        imgWrap.className = 'product-detail-image';
        if (imageUrl) {
          imgWrap.style.backgroundImage = 'url(' + imageUrl + ')';
        } else {
          imgWrap.innerHTML = placeholderMarkup();
        }
        info.insertBefore(imgWrap, info.firstChild);
      }

      // Kart listesi görünümü için küçük ürün kartı oluştur
      var thumb = document.createElement('a');
      thumb.href = '#' + card.id;
      thumb.className = 'product-card';
      var media = document.createElement('div');
      media.className = 'product-media';
      if (imageUrl) {
        media.style.backgroundImage = 'url(' + imageUrl + ')';
        media.style.backgroundSize = 'cover';
        media.style.backgroundPosition = 'center';
      } else {
        media.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';
      }
      var body = document.createElement('div');
      body.className = 'product-body';
      body.innerHTML = '<h3>' + name + '</h3>';
      thumb.appendChild(media);
      thumb.appendChild(body);
      thumbGrid.appendChild(thumb);

      thumb.addEventListener('click', function (e) {
        e.preventDefault();
        showDetail(card.id);
      });
    });

    function showDetail(id) {
      thumbGrid.classList.add('is-hidden');
      cards.forEach(function (c) { c.classList.toggle('is-hidden', c.id !== id); });
      if (backBtn) backBtn.style.display = 'inline-flex';
      var target = document.getElementById(id);
      if (target) {
        window.history.replaceState(null, '', '#' + id);
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    function showList() {
      thumbGrid.classList.remove('is-hidden');
      cards.forEach(function (c) { c.classList.add('is-hidden'); });
      if (backBtn) backBtn.style.display = 'none';
      thumbGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (backBtn) backBtn.addEventListener('click', showList);

    // Sayfa hash'i bu bölümdeki bir ürüne denk geliyorsa doğrudan detayı göster
    var initialId = window.location.hash.replace('#', '');
    if (initialId && cards.some(function (c) { return c.id === initialId; })) {
      showDetail(initialId);
    }
  });

  // Aktif yıl
  var yearEl = document.querySelector('#current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
