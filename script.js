/* ═══════════════════════════════════════════════════
   ABEEEZ LADIES STITCHING CENTER — script.js
═══════════════════════════════════════════════════ */
 
// ── BOOKING STORAGE KEY ──
const STORAGE_KEY = 'abeeez_bookings';
 
// ── CUSTOM CURSOR ──
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;
 
  let mx = 0, my = 0, fx = 0, fy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });
  (function animFollower() {
    fx += (mx - fx) * 0.1;
    fy += (my - fy) * 0.1;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animFollower);
  })();
})();
 
// ── NAVBAR ──
(function initNav() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!navbar) return;
 
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }
  navLinks && navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger && hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();
 
// ── SCROLL REVEAL ──
(function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();
 
// ── TESTIMONIALS ──
(function initTestimonials() {
  const track = document.getElementById('testiTrack');
  if (!track) return;
  const reviews = [
    { name: 'Fathima Nazar',   loc: 'Pulpally',  text: 'My nikah blouse was absolutely stunning. The fit was perfect and the embroidery detail exceeded every expectation!', stars: 5 },
    { name: 'Sreeja Menon',    loc: 'Mananthavady', text: 'I got my daughter\'s pattu pavada stitched here — beautiful work, delivered before the deadline. Highly recommended!', stars: 5 },
    { name: 'Asha Krishnan',   loc: 'Kalpetta',  text: 'The Anarkali churidar they stitched for me was gorgeous. Very professional team and excellent finishing quality.', stars: 5 },
    { name: 'Reshma K.',       loc: 'Sultan Bathery', text: 'Brought fabric for a designer blouse and the result was better than any boutique. Very happy with Abeeez!', stars: 4 },
    { name: 'Divya Suresh',    loc: 'Wayanad',   text: 'Friendly staff, fair pricing and the stitching is top class. This is now my go-to center for all my tailoring needs.', stars: 5 },
    { name: 'Anitha Rajan',    loc: 'Vythiri',   text: 'Alteration done on my wedding lehenga was flawless. You can\'t even tell it was altered — that\'s real skill!', stars: 5 },
  ];
  const doubled = [...reviews, ...reviews];
  doubled.forEach(r => {
    const card = document.createElement('div');
    card.className = 'testi-card';
    card.innerHTML = `
      <div class="tc-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</div>
      <p class="tc-text">"${r.text}"</p>
      <div class="tc-author">
        <div class="tc-avatar">${r.name[0]}</div>
        <div><div class="tc-name">${r.name}</div><div class="tc-loc">${r.loc}</div></div>
      </div>`;
    track.appendChild(card);
  });
})();
 
// ── BOOKING FORM ──
(function initBookingForm() {
  const form    = document.getElementById('bookingForm');
  const success = document.getElementById('bookingSuccess');
  if (!form) return;
 
  // Set min date to today
  const dateInput = document.getElementById('prefDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
 
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateForm()) return;
 
    const submitBtn  = form.querySelector('.form-submit-btn');
    const btnText    = form.querySelector('.btn-text');
    const btnLoader  = form.querySelector('.btn-loader');
 
    btnText.style.display   = 'none';
    btnLoader.style.display = 'inline-flex';
    submitBtn.disabled = true;
 
    const booking = {
      id:        'BK' + Date.now(),
      timestamp: new Date().toISOString(),
      name:      document.getElementById('custName').value.trim(),
      phone:     document.getElementById('custPhone').value.trim(),
      email:     document.getElementById('custEmail').value.trim(),
      date:      document.getElementById('prefDate').value,
      service:   document.getElementById('serviceReq').value,
      notes:     document.getElementById('addNotes').value.trim(),
      status:    'Pending'
    };
 
    // ── Save to localStorage (production: replace with backend API call) ──
    /*
    BACKEND INTEGRATION POINT:
    Replace the localStorage block below with an API call, e.g.:
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    });
    The backend should then:
    1. Store in database
    2. Send confirmation email to abhinandsuresh1928@gmail.com
    3. (Optional) Send SMS via Twilio / MSG91
    */
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    existing.push(booking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
 
    // EmailJS integration (configure with your EmailJS keys)
    // emailjs.send('SERVICE_ID', 'TEMPLATE_ID', {
    //   to_email: 'abhinandsuresh1928@gmail.com',
    //   customer_name: booking.name,
    //   customer_phone: booking.phone,
    //   customer_email: booking.email,
    //   preferred_date: booking.date,
    //   service: booking.service,
    //   notes: booking.notes,
    //   booking_id: booking.id
    // });
 
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1400));
 
    form.style.display = 'none';
    success.style.display = 'block';
  });
 
  function validateForm() {
    let valid = true;
    const fields = [
      { id: 'custName',   msg: 'Please enter your full name.' },
      { id: 'custPhone',  msg: 'Please enter a valid phone number.', pattern: /^[+\d\s\-()]{7,15}$/ },
      { id: 'prefDate',   msg: 'Please select a preferred date.' },
      { id: 'serviceReq', msg: 'Please select a service.' },
    ];
    const emailVal = document.getElementById('custEmail').value.trim();
    if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      showError('custEmail', 'Please enter a valid email address.');
      valid = false;
    } else {
      clearError('custEmail');
    }
    fields.forEach(f => {
      const el  = document.getElementById(f.id);
      const val = el.value.trim();
      if (!val || (f.pattern && !f.pattern.test(val))) {
        showError(f.id, f.msg); valid = false;
      } else { clearError(f.id); }
    });
    return valid;
  }
 
  function showError(id, msg) {
    const el   = document.getElementById(id);
    const errEl = document.getElementById('err-' + id);
    if (el) el.closest('.form-group').classList.add('has-error');
    if (errEl) errEl.textContent = msg;
  }
  function clearError(id) {
    const el   = document.getElementById(id);
    const errEl = document.getElementById('err-' + id);
    if (el) el.closest('.form-group').classList.remove('has-error');
    if (errEl) errEl.textContent = '';
  }
})();
 
function resetForm() {
  const form    = document.getElementById('bookingForm');
  const success = document.getElementById('bookingSuccess');
  if (!form || !success) return;
  form.reset();
  form.style.display = 'block';
  success.style.display = 'none';
  const btn = form.querySelector('.form-submit-btn');
  if (btn) btn.disabled = false;
  const btnText   = form.querySelector('.btn-text');
  const btnLoader = form.querySelector('.btn-loader');
  if (btnText)  btnText.style.display   = 'inline-flex';
  if (btnLoader) btnLoader.style.display = 'none';
}
 
// ── SMOOTH ANCHOR LINKS ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});