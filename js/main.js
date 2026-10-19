// doorsteptvservice.in — site interactions
(function () {
  var WHATSAPP = '919989032865';

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
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

  // Booking form -> WhatsApp message
  var form = document.getElementById('bookingForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var msg = 'Hello doorsteptvservice.in, I would like to book a TV service.%0A%0A' +
        '*Name:* ' + encodeURIComponent(d.get('name') || '') + '%0A' +
        '*Phone:* ' + encodeURIComponent(d.get('phone') || '') + '%0A' +
        '*TV Brand:* ' + encodeURIComponent(d.get('brand') || '') + '%0A' +
        '*Service:* ' + encodeURIComponent(d.get('service') || '') + '%0A' +
        '*Address:* ' + encodeURIComponent(d.get('address') || '') + '%0A' +
        '*Problem:* ' + encodeURIComponent(d.get('message') || '');
      window.open('https://wa.me/' + WHATSAPP + '?text=' + msg, '_blank');
    });
  }

  // Footer year
  document.querySelectorAll('.year').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
