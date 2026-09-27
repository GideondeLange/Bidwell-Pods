/* Shared site behaviour for Bidwell Pods */
(function () {
  var WA_NUMBER = '+27828517667';

  document.addEventListener('DOMContentLoaded', function () {
    var burger = document.getElementById('burgerBtn');
    var panel = document.getElementById('mobilePanel');
    if (burger && panel) {
      burger.addEventListener('click', function () {
        var open = panel.classList.toggle('open');
        burger.setAttribute('aria-expanded', open);
      });
      panel.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { panel.classList.remove('open'); });
      });
    }

    if ('IntersectionObserver' in window) {
      var revealEls = document.querySelectorAll('.reveal');
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in-view'); });
    }

    document.querySelectorAll('.wa-enquire').forEach(function (a) {
      var msg = a.getAttribute('data-wa') || 'your pods';
      a.href = 'https://wa.me/' + WA_NUMBER.replace('+', '') + '?text=' + encodeURIComponent(
        "Hi, I'm interested in the " + msg + ". Please send me more details."
      );
      a.target = '_blank';
      a.rel = 'noopener';
    });

    var qf = document.getElementById('quoteForm');
    if (qf) {
      var qfBtn = qf.querySelector('button[type="submit"]');
      var qfBtnText = qfBtn ? qfBtn.textContent : 'Send Message';
      var qfError = document.getElementById('formError');
      var formCard = document.getElementById('formCard');
      var formSuccess = document.getElementById('formSuccess');
      var resetBtn = document.getElementById('formResetBtn');

      qf.addEventListener('submit', function (e) {
        e.preventDefault();
        if (qfError) { qfError.hidden = true; qfError.textContent = ''; }
        if (qfBtn) { qfBtn.disabled = true; qfBtn.textContent = 'Sending…'; }

        fetch('contact-handler.php', { method: 'POST', body: new FormData(qf) })
          .then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (data) {
              return { ok: res.ok, data: data };
            });
          })
          .then(function (result) {
            if (result.ok && result.data && result.data.success) {
              qf.reset();
              if (formCard) formCard.hidden = true;
              if (formSuccess) formSuccess.hidden = false;
            } else {
              throw new Error((result.data && result.data.message) || 'Something went wrong sending your message. Please try again or email us directly.');
            }
          })
          .catch(function (err) {
            if (qfError) {
              qfError.textContent = err.message || 'Something went wrong sending your message. Please try again or email us directly.';
              qfError.hidden = false;
            }
          })
          .then(function () {
            if (qfBtn) { qfBtn.disabled = false; qfBtn.textContent = qfBtnText; }
          });
      });

      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          if (formSuccess) formSuccess.hidden = true;
          if (formCard) formCard.hidden = false;
        });
      }
    }

    var nf = document.getElementById('newsletterForm');
    if (nf) {
      nf.addEventListener('submit', function (e) {
        e.preventDefault();
        var email = nf.email.value;
        window.location.href = 'mailto:info@bidwellpods.co.za?subject=' + encodeURIComponent('Newsletter sign-up') + '&body=' + encodeURIComponent('Please add ' + email + ' to the Bidwell Pods newsletter.');
      });
    }

    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    var lightbox = document.getElementById('lightbox');
    if (lightbox) {
      var lbImg = document.getElementById('lightboxImg');
      document.querySelectorAll('.g-item').forEach(function (item) {
        item.addEventListener('click', function () {
          lbImg.src = item.querySelector('img').src;
          lbImg.alt = item.querySelector('img').alt;
          lightbox.classList.add('open');
        });
      });
      lightbox.addEventListener('click', function () { lightbox.classList.remove('open'); });
    }
  });
})();

/* ---------------- Pod catalogue data (shared source of truth — matches the Bidwell Pods 2026 brochure) ---------------- */
var PODS = [
  {
    id: '3bed', num: '01', category: 'Compact Pods', name: '3 Bedroom', img: 'img/pods/pod-01-3bedroom.jpg', floorplan: 'img/floorplans/pod-01-3bedroom-floorplan.png', size: '100m²', price: 'R1,095,000',
    desc: 'Our largest standard layout — three bedrooms and two bathrooms around an open kitchen and living area, with decking off the back.',
    included: ['Bathroom', 'Kitchen', 'Full electrical'],
    note: 'Custom design and sizes available'
  },
  {
    id: 'pod2', num: '02', category: 'Compact Pods', name: 'Pod 2', img: 'img/pods/pod-02.jpg', floorplan: 'img/floorplans/pod-02-floorplan.png', size: '25m²', price: 'R430,000',
    desc: 'A self-contained one-room stay with a queen bedroom, kitchenette and full bathroom — built for glamping sites and backyard rentals.',
    included: ['Bathroom', 'Kitchen', 'Full electrical'],
    note: 'Custom design and sizes available'
  },
  {
    id: 'pod3', num: '03', category: 'Compact Pods', name: 'Pod 3', img: 'img/pods/pod-03.jpg', floorplan: 'img/floorplans/pod-03-floorplan.png', size: '17m²', price: 'R285,000',
    desc: 'Our most compact self-contained layout — a queen bedroom, kitchenette and shower room in a tight, efficient footprint.',
    included: ['Bathroom', 'Kitchen', 'Full electrical'],
    note: 'Custom design and sizes available'
  },
  {
    id: 'pod4', num: '04', category: 'Compact Pods', name: 'Pod 4', img: 'img/pods/pod-04.jpg', floorplan: 'img/floorplans/pod-04-floorplan.png', size: '24m²', price: 'R352,000',
    desc: 'A slightly larger one-room layout with more room to move — queen bedroom, kitchenette and bathroom in a sharp black-clad shell.',
    included: ['Bathroom', 'Kitchen', 'Full electrical'],
    note: 'Custom design and sizes available'
  },
  {
    id: 'concrete', num: '05', category: 'Specialty Builds', name: 'Concrete Roof Top Pod', img: 'img/pods/pod-06-cement-panel.jpg', floorplan: 'img/floorplans/pod-05-concrete-roof-floorplan.png', size: '36m²', price: 'R504,000',
    desc: 'A flat, concrete-roofed model with a distinct architectural silhouette — bedroom, bathroom and kitchen around a separate lounge area.',
    included: ['Bathroom', 'Kitchen', 'Full electrical'],
    note: 'Custom design and sizes available'
  },
  {
    id: 'cementpanel', num: '06', category: 'Specialty Builds', name: 'Insulated Cement Panel Housing', img: 'img/pods/pod-05-concrete-roof.jpg', floorplan: null, size: 'Custom Size', price: 'From R6,500/m²',
    desc: 'A larger insulated cement-panel structure built for full second-storey living above secure ground-floor parking or storage.',
    included: ['Full electrical'],
    note: 'Kitchenette & bathroom will be an additional cost'
  },
  {
    id: 'entertainment', num: '07', category: 'Backyard Range', name: 'Backyard Entertainment Pod', img: 'img/pods/pod-07-entertainment.jpg', floorplan: null, size: '17m²', price: 'R215,000',
    desc: 'An open-plan backyard bar and braai room with full-width glazed doors that fold the space open onto the deck.',
    included: ['Full electrical'],
    note: 'Kitchenette units available · Custom sizes'
  },
  {
    id: 'office', num: '08', category: 'Backyard Range', name: 'Backyard Office / Storage Pod', img: 'img/pods/pod-08-office-storage.jpg', floorplan: null, size: '4m²', price: 'R45,000',
    desc: 'A weatherproof garden studio with a full-height glass sliding door — fit it out as a home office, studio or overflow storage.',
    included: ['Full electrical'],
    note: 'Custom design and sizes available'
  },
  {
    id: 'guardhouse', num: '09', category: 'Commercial Pods', name: 'Guard House', img: 'img/pods/pod-09-guardhouse.jpg', floorplan: null, size: '4m²', price: 'R52,000',
    desc: 'A compact, fully wired gatehouse with all-round visibility for estates, sites and commercial yards.',
    included: ['Full electrical'],
    note: 'Custom design and sizes available'
  },
  {
    id: 'coffeeshop', num: '10', category: 'Commercial Pods', name: 'Coffee Shop', img: 'img/pods/pod-10-coffeeshop.jpg', floorplan: null, size: '5m²', price: 'R55,000',
    desc: 'A small-footprint serving kiosk with a fold-up counter hatch — ready to fit out as a coffee stand, kiosk or roadside stall.',
    included: ['Full electrical'],
    note: 'Custom design and sizes available'
  }
];

var EXCLUDED = ['Connection to mains', 'COC certificates', 'Plan approval from municipalities', 'Transport', 'Installation'];
