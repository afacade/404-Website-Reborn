// ==========================================================================
// 404 [COME FIND ME] — shared scripts
// ==========================================================================

// Lazy-load CSS background images stored in data-bg attributes
function initLazyBackgrounds() {
  var els = document.querySelectorAll('[data-bg]');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    els.forEach(function(el) { el.style.backgroundImage = 'url(' + el.dataset.bg + ')'; });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (!e.isIntersecting) return;
      e.target.style.backgroundImage = 'url(' + e.target.dataset.bg + ')';
      obs.unobserve(e.target);
    });
  }, { rootMargin: '200px 0px' });
  els.forEach(function(el) { obs.observe(el); });
}

// Disable splash video autoplay on slow connections or reduced-motion preference
function optimizeSplashVideo() {
  var video = document.querySelector('.v2-splash__video');
  if (!video) return;
  var conn = navigator.connection;
  var slowData = conn && (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (slowData || reducedMotion) {
    video.removeAttribute('autoplay');
    video.pause();
    video.src = '';
    video.load();
    return;
  }
  // Pause when scrolled out of view to save CPU/battery
  var splashEl = video.closest('.v2-splash');
  if (splashEl && 'IntersectionObserver' in window) {
    var vobs = new IntersectionObserver(function(entries) {
      entries[0].isIntersecting ? video.play().catch(function(){}) : video.pause();
    }, { threshold: 0.1 });
    vobs.observe(splashEl);
  }
}

// Video thumbnail generation — captures a frame from [data-thumb-time] videos
function captureVideoFrame(video, seekTime) {
  return new Promise(function(resolve) {
    var timeout = setTimeout(resolve, 12000);
    function done() {
      clearTimeout(timeout);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
      resolve();
    }
    function onSeeked() {
      try {
        var c = document.createElement('canvas');
        c.width  = video.videoWidth  || 1280;
        c.height = video.videoHeight || 720;
        c.getContext('2d').drawImage(video, 0, 0, c.width, c.height);
        video.setAttribute('poster', c.toDataURL('image/jpeg', 0.8));
      } catch(e) {}
      video.preload = 'none';
      done();
    }
    function onError() { done(); }
    video.addEventListener('seeked', onSeeked, { once: true });
    video.addEventListener('error', onError,  { once: true });
    video.preload = 'metadata';
    if (video.readyState >= 1) {
      video.currentTime = seekTime;
    } else {
      video.addEventListener('loadedmetadata', function() {
        video.currentTime = Math.min(seekTime, video.duration * 0.1 || seekTime);
      }, { once: true });
      video.load();
    }
  });
}

async function initVideoThumbnails() {
  var videos = document.querySelectorAll('video[data-thumb-time]');
  for (var i = 0; i < videos.length; i++) {
    var t = parseFloat(videos[i].dataset.thumbTime) || 1;
    await captureVideoFrame(videos[i], t);
  }
}

// Lightbox for portfolio images
function initLightbox() {
  var overlay = document.getElementById('lightbox');
  if (!overlay) return;
  var img   = document.getElementById('lightbox-img');
  var close = document.getElementById('lightbox-close');

  function open(src, alt) {
    img.src = src;
    img.alt = alt || '';
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeLB() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function() { img.src = ''; }, 300);
  }

  close.addEventListener('click', closeLB);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeLB(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeLB(); });

  document.querySelectorAll('[data-lightbox]').forEach(function(el) {
    el.style.cursor = 'zoom-in';
    el.addEventListener('click', function(e) {
      e.preventDefault();
      var name = el.querySelector('.pf-card__name');
      open(el.dataset.lightbox, name ? name.textContent : '');
    });
  });
}

// Mobile nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // Services accordion
  document.querySelectorAll(".service-item").forEach(item => {
    const header = item.querySelector(".service-item__header");
    if (!header) return;
    header.addEventListener("click", () => {
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".service-item").forEach(i => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
    });
  });

  // Work filter chips
  const chips = document.querySelectorAll(".work-filter__chip");
  const tiles = document.querySelectorAll(".work-tile");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const filter = chip.dataset.filter;
      tiles.forEach(tile => {
        if (filter === "all" || tile.dataset.category === filter) {
          tile.style.display = "";
        } else {
          tile.style.display = "none";
        }
      });
    });
  });

  // Contact form no-op (demo)
  const form = document.querySelector(".cta__form");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const btn = form.querySelector(".cta__btn");
      if (btn) {
        const original = btn.textContent;
        btn.textContent = "Thanks — we'll be in touch";
        btn.disabled = true;
        setTimeout(() => { btn.textContent = original; btn.disabled = false; form.reset(); }, 2500);
      }
    });
  }

  initLazyBackgrounds();
  optimizeSplashVideo();
  initLightbox();
  initVideoThumbnails();
});
