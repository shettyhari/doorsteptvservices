// doorsteptvservice.in — site interactions
(function () {

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress bar + glassy header
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  var header = document.querySelector('.header');
  var ticking = false;
  var onScroll = function () {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
    ticking = false;
  };
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // Reveal variants: split layouts slide in from opposite sides
  document.querySelectorAll('.grid-2, .contact-grid').forEach(function (row) {
    var kids = row.querySelectorAll(':scope > .reveal');
    if (kids.length === 2) {
      kids[0].classList.add('reveal-left');
      kids[1].classList.add('reveal-right');
    }
  });
  document.querySelectorAll('.cta.reveal, .logo-marquee.reveal').forEach(function (el) {
    el.classList.add('reveal-zoom');
  });

  // Stagger items that sit in the same grid
  document.querySelectorAll('.grid-3, .grid-4, .steps, .svc-list').forEach(function (grid) {
    grid.querySelectorAll(':scope > .reveal').forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i * 90, 450) + 'ms';
      el.addEventListener('transitionend', function clear() {
        el.style.transitionDelay = '';
        el.removeEventListener('transitionend', clear);
      });
    });
  });

  // 3D tilt with cursor spotlight (mouse only)
  if (!reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.card, .problem, .testi, .svc-row').forEach(function (el) {
      el.classList.add('tilt');
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        el.classList.add('tilting');
        el.style.setProperty('--ry', ((x - 0.5) * 8).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - y) * 8).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
      });
      el.addEventListener('mouseleave', function () {
        el.classList.remove('tilting');
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });
  }

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('visible'); });
  }

  // Brand logo strip: duplicate the logos so the scroll loops seamlessly
  document.querySelectorAll('.logo-track').forEach(function (track) {
    Array.prototype.slice.call(track.children).forEach(function (li) {
      var copy = li.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.appendChild(copy);
    });
  });

  // Animated counters
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var started = false;
    var run = function () {
      if (started) return; started = true;
      var start = null;
      var step = function (t) {
        if (!start) start = t;
        var p = Math.min((t - start) / 1600, 1);
        el.textContent = Math.floor(p * target).toLocaleString('en-IN') + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en, obs) {
        if (en[0].isIntersecting) { run(); obs.disconnect(); }
      }).observe(el);
    } else { run(); }
  });

  // Footer year
  document.querySelectorAll('.year').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
