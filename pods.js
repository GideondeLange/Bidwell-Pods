/* Renders the pod grid and detail modal on pods.html. Runs synchronously so the
   full catalogue is present as soon as the page parses (no scroll-triggered reveal). */
(function () {
  var grid = document.getElementById('unitsGrid');
  var overlay = document.getElementById('podModal');
  if (!grid || !overlay) return;

  grid.innerHTML = PODS.map(function (p) {
    return (
      '<article class="unit-card" data-pod="' + p.id + '">' +
        '<div class="unit-photo">' +
          (p.floorplan ? '<span class="fp-badge">Floor Plan</span>' : '') +
          '<img src="' + p.img + '" alt="' + p.name + ' exterior" loading="lazy">' +
        '</div>' +
        '<div class="unit-body">' +
          '<h3>' + p.name + '</h3>' +
          '<div class="unit-size">' + p.size + '</div>' +
          '<div class="unit-price"><span class="from">From</span><span class="amt">' + p.price + '</span></div>' +
          '<button class="btn btn-solid btn-block btn-sm" type="button" data-open="' + p.id + '">View Details</button>' +
        '</div>' +
      '</article>'
    );
  }).join('');

  function renderModal(p) {
    var included = p.included.map(function (i) { return '<li>' + i + '</li>'; }).join('');
    var excluded = EXCLUDED.map(function (i) { return '<li>' + i + '</li>'; }).join('');
    var floorplanSection = p.floorplan ?
      '<div class="modal-floorplan">' +
        '<span class="eyebrow">Floor Plan</span>' +
        '<div class="modal-floorplan-img"><img src="' + p.floorplan + '" alt="' + p.name + ' floor plan"></div>' +
      '</div>' : '';
    overlay.querySelector('.modal').innerHTML =
      '<button class="modal-close" type="button" aria-label="Close">&times;</button>' +
      '<div class="modal-grid">' +
        '<div class="modal-info">' +
          '<span class="eyebrow" style="color:#ffffff;">Bidwell Pods</span>' +
          '<h2>' + p.name + '</h2>' +
          '<div class="size">' + p.size + '</div>' +
          '<p class="desc">' + p.desc + '</p>' +
          '<p class="note">' + p.note + '</p>' +
          '<div class="modal-price-row">' +
            '<div><div class="l">From</div><div class="v">' + p.price + '</div></div>' +
          '</div>' +
          '<a class="btn btn-amber btn-block wa-enquire" data-wa="' + p.name + ' (from ' + p.price + ')" href="contact.html">Enquire About This Pod</a>' +
        '</div>' +
        '<div class="modal-photo"><img src="' + p.img + '" alt="' + p.name + '"></div>' +
      '</div>' +
      floorplanSection +
      '<div class="modal-details">' +
        '<div class="modal-col"><span class="modal-col-head">What You Get</span><h4>Included</h4><ul>' + included + '</ul></div>' +
        '<div class="modal-col excluded"><span class="modal-col-head">Please Note</span><h4>All Prices Exclude</h4><ul>' + excluded + '</ul></div>' +
      '</div>';

    overlay.querySelector('.modal-close').addEventListener('click', close);
    var wa = overlay.querySelector('.wa-enquire');
    wa.href = 'https://wa.me/27828517667?text=' + encodeURIComponent("Hi, I'm interested in the " + p.name + " (from " + p.price + "). Please send me more details.");
    wa.target = '_blank';
    wa.rel = 'noopener';
  }

  function open(id) {
    var p = PODS.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    renderModal(p);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-open]');
    if (btn) open(btn.getAttribute('data-open'));
  });
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
  });
})();
