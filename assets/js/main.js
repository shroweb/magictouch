// Magic Touch Galway — site behaviour
document.addEventListener('DOMContentLoaded', function () {

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
  }

  // Close mobile nav when a link inside it is tapped
  document.querySelectorAll('.mobile-panel a').forEach(function (a) {
    a.addEventListener('click', function () {
      document.body.classList.remove('nav-open');
    });
  });

  // Contact form — no backend wired up yet, so confirm locally.
  var form = document.getElementById('quote-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Thanks — we\'ll be in touch';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
      }, 3200);
    });
  }

  // ============================================================
  // Scroll fade-in — add .visible when element enters viewport
  // ============================================================
  var fadeEls = document.querySelectorAll('.fade-up');
  if (fadeEls.length && 'IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeEls.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // Fallback: just show everything
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // ============================================================
  // Stat counter — counts up when stat enters viewport
  // ============================================================
  function animateCount(el, target, suffix, duration) {
    var start = 0;
    var startTime = null;
    // For 2019 start from 2010 for a faster feel
    if (target === 2019) start = 2010;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(start + (target - start) * eased);
      el.textContent = target >= 1000 && target !== 2019
        ? current.toLocaleString() + suffix
        : current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Ensure final value is exact
        el.textContent = target === 1000
          ? '1,000+' : target === 2019
          ? '2019' : target + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  var statEls = document.querySelectorAll('[data-count]');
  if (statEls.length && 'IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var count = parseInt(el.getAttribute('data-count'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          // Skip static values like 24/7
          if (el.getAttribute('data-suffix') === '24/7') {
            statObserver.unobserve(el);
            return;
          }
          animateCount(el, count, suffix, 1600);
          statObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statEls.forEach(function (el) {
      statObserver.observe(el);
    });
  }

});
