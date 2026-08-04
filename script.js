/* ═══════════════════════════════════════════════
   MW EDUCATION – SCRIPT.JS
═══════════════════════════════════════════════ */

'use strict';

// ─────────────────────────────────────────────
// 1. NAVBAR SCROLL BEHAVIOUR
// ─────────────────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });


// ─────────────────────────────────────────────
// 2. MOBILE MENU
// ─────────────────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  hamburger.classList.toggle('open', !isOpen);
  mobileMenu.classList.toggle('open', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
});

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  if (mobileMenu.classList.contains('open') &&
      !mobileMenu.contains(e.target) &&
      !hamburger.contains(e.target)) {
    closeMobileMenu();
  }
});


// ─────────────────────────────────────────────
// 3. INTERSECTION OBSERVER – SCROLL ANIMATIONS
// ─────────────────────────────────────────────
const animateEls = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, Number(delay));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

animateEls.forEach(el => observer.observe(el));


// ─────────────────────────────────────────────
// 4. COUNTER ANIMATION (hero stats)
// ─────────────────────────────────────────────
function animateCounter(el, target, duration = 1800) {
  const start = 0;
  const startTime = performance.now();

  const step = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(ease * target);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

// Observe the stats section
const statsSection = document.querySelector('.hero-stats');
const statNumbers  = document.querySelectorAll('.stat-number[data-target]');

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      statNumbers.forEach(el => {
        const target = parseInt(el.dataset.target);
        animateCounter(el, target);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

if (statsSection) statsObserver.observe(statsSection);


// ─────────────────────────────────────────────
// 5. DESTINATION TABS
// ─────────────────────────────────────────────
const destinationData = {
  uk: {
    students: '540+', unis: '120+', visa: '96%',
    universities: ['University of London', 'University of Manchester', 'University of Edinburgh', 'King\'s College London', 'University of Bristol', 'University of Birmingham']
  },
  canada: {
    students: '480+', unis: '90+', visa: '97%',
    universities: ['University of Toronto', 'UBC', 'McGill University', 'University of Waterloo', 'McMaster', 'University of Ottawa']
  },
  australia: {
    students: '310+', unis: '65+', visa: '95%',
    universities: ['University of Melbourne', 'ANU', 'University of Sydney', 'UNSW', 'Monash University', 'University of Queensland']
  },
  usa: {
    students: '620+', unis: '85+', visa: '97%',
    universities: ['Georgia Tech', 'Emory University', 'University of Georgia', 'NYU', 'UCLA', 'USC', 'University of Miami']
  },
  germany: {
    students: '180+', unis: '40+', visa: '94%',
    universities: ['TU Munich', 'Heidelberg University', 'LMU Munich', 'Free University of Berlin', 'RWTH Aachen', 'University of Hamburg']
  },
  malaysia: {
    students: '240+', unis: '35+', visa: '98%',
    universities: ['University of Malaya', 'UPM', 'UTM', 'Sunway University', 'Taylor\'s University', 'INTI International']
  },
  ireland: {
    students: '195+', unis: '22+', visa: '96%',
    universities: ['Trinity College Dublin', 'UCD', 'University of Galway', 'UCC', 'DCU', 'Maynooth University']
  },
  japan: {
    students: '120+', unis: '18+', visa: '93%',
    universities: ['University of Tokyo', 'Kyoto University', 'Waseda University', 'Keio University', 'Osaka University', 'Tohoku University']
  }
};

const tabs    = document.querySelectorAll('.dest-tab');
const numStu  = document.getElementById('dest-num-students');
const numUni  = document.getElementById('dest-num-uni');
const numVisa = document.getElementById('dest-num-visa');
const uniTags = document.getElementById('uni-tags');
const destContent = document.getElementById('destination-content');

function setDestination(country) {
  const data = destinationData[country];
  if (!data) return;

  // Fade out & update
  destContent.style.opacity = '0';
  destContent.style.transform = 'translateY(10px)';

  setTimeout(() => {
    numStu.textContent  = data.students;
    numUni.textContent  = data.unis;
    numVisa.textContent = data.visa;

    uniTags.innerHTML = '';
    data.universities.forEach(uni => {
      const tag = document.createElement('span');
      tag.className = 'uni-tag';
      tag.textContent = uni;
      uniTags.appendChild(tag);
    });

    destContent.style.opacity   = '1';
    destContent.style.transform = 'translateY(0)';
    destContent.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
  }, 180);
}

// Initial transition setup
destContent.style.transition = 'opacity 0.35s ease, transform 0.35s ease';

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    setDestination(tab.dataset.country);
  });
});


// ─────────────────────────────────────────────
// 6. CONTACT FORM
// ─────────────────────────────────────────────
const form        = document.getElementById('contact-form');
const submitBtn   = document.getElementById('form-submit');
const submitText  = document.getElementById('submit-text');
const submitSpinner = document.getElementById('submit-spinner');
const formSuccess = document.getElementById('form-success');

function showError(id, message) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
}

function clearError(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = '';
  el.classList.remove('show');
}

function validateForm() {
  let valid = true;
  clearError('error-name');
  clearError('error-email');
  clearError('error-destination');

  const name  = form.fullName.value.trim();
  const email = form.email.value.trim();
  const dest  = form.destination.value;

  if (!name) {
    showError('error-name', 'Please enter your full name.');
    valid = false;
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    showError('error-email', 'Please enter your email address.');
    valid = false;
  } else if (!emailRe.test(email)) {
    showError('error-email', 'Please enter a valid email address.');
    valid = false;
  }

  if (!dest) {
    showError('error-destination', 'Please select a destination.');
    valid = false;
  }

  return valid;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  // Loading state
  submitBtn.disabled = true;
  submitText.textContent = 'Sending…';
  submitSpinner.classList.remove('hidden');

  // Simulate async submission (replace with real fetch in production)
  await new Promise(r => setTimeout(r, 1600));

  // Success
  submitBtn.classList.add('hidden');
  formSuccess.classList.remove('hidden');
  form.reset();
});

// Real-time error clearing
['full-name', 'email', 'destination'].forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('input', () => {
      const errorMap = { 'full-name': 'error-name', 'email': 'error-email', 'destination': 'error-destination' };
      clearError(errorMap[id]);
    });
  }
});


// ─────────────────────────────────────────────
// 7. SMOOTH NAV LINK ACTIVE STATE
// ─────────────────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        link.style.color = href === entry.target.id ? 'var(--navy)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));


// ─────────────────────────────────────────────
// 8. PARALLAX HERO BLOBS (subtle)
// ─────────────────────────────────────────────
const blob1 = document.querySelector('.hero-blob-1');
const blob2 = document.querySelector('.hero-blob-2');

window.addEventListener('mousemove', (e) => {
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;

  if (blob1) {
    blob1.style.transform = `translate(${dx * 18}px, ${dy * 12}px)`;
  }
  if (blob2) {
    blob2.style.transform = `translate(${-dx * 14}px, ${-dy * 10}px)`;
  }
}, { passive: true });


// ─────────────────────────────────────────────
// 9. CERTIFICATES & AWARDS CAROUSEL
// ─────────────────────────────────────────────
// Cards live in the HTML. JS only drives the slider.

(function certCarousel() {
  const track    = document.getElementById('certTrack');
  const dotsWrap = document.getElementById('certDots');
  const prevBtn  = document.getElementById('cert-prev');
  const nextBtn  = document.getElementById('cert-next');

  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.cert-card'));
  const dots  = Array.from(dotsWrap ? dotsWrap.querySelectorAll('.cert-dot') : []);
  const total = cards.length;

  if (total === 0) return;

  let current = 0;
  let autoplayTimer = null;

  /* ── Move to slide n ── */
  function goTo(n) {
    // Infinite loop: wrap around
    current = (n + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
    });
  }

  function goNext() { goTo(current + 1); }
  function goPrev() { goTo(current - 1); }

  /* ── Button clicks ── */
  if (nextBtn) nextBtn.addEventListener('click', () => { goNext(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { goPrev(); resetAutoplay(); });

  /* ── Dot clicks ── */
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAutoplay(); });
  });

  /* ── Keyboard navigation ── */
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { goNext(); resetAutoplay(); }
    if (e.key === 'ArrowLeft')  { goPrev(); resetAutoplay(); }
  });

  /* ── Autoplay (pauses on hover / focus) ── */
  function startAutoplay() { autoplayTimer = setInterval(goNext, 4500); }
  function stopAutoplay()  { clearInterval(autoplayTimer); }
  function resetAutoplay() { stopAutoplay(); startAutoplay(); }

  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);
  track.addEventListener('focusin',    stopAutoplay);
  track.addEventListener('focusout',   startAutoplay);

  /* ── Touch / pointer swipe ── */
  let startX = 0;

  track.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    track.setPointerCapture(e.pointerId);
    stopAutoplay();
  });

  track.addEventListener('pointerup', (e) => {
    const delta = e.clientX - startX;
    if (delta < -50)      goNext();
    else if (delta > 50)  goPrev();
    resetAutoplay();
  });

  /* ── Init ── */
  goTo(0);
  startAutoplay();

})();
