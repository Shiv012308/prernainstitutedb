/* ============================================
   PRERNA INSTITUTE — SCRIPTS
   script.js
   ============================================ */

/* ─── AOS INIT ─── */
AOS.init({
  duration: 800,
  once: true,
  offset: 80,
  easing: 'ease-out-cubic'
});

/* ─── SCROLL PROGRESS BAR ─── */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  if (progressBar) progressBar.style.width = scrolled + '%';
});

/* ─── NAVBAR SCROLL EFFECT ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
});

/* ─── DARK / LIGHT MODE TOGGLE ─── */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
let currentTheme = localStorage.getItem('prerna-theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('prerna-theme', currentTheme);
    updateThemeIcon(currentTheme);
  });
}

function updateThemeIcon(theme) {
  if (themeIcon) {
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
  }
}

/* ─── HAMBURGER MENU ─── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
}

function closeMobile() {
  if (mobileMenu) mobileMenu.classList.remove('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = '';
  spans[1].style.opacity = '';
  spans[2].style.transform = '';
}
window.closeMobile = closeMobile;

/* ─── SMOOTH SCROLL FOR NAV LINKS ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── ANIMATED COUNTERS ─── */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const duration = 2000;
  const stepTime = 16;
  const steps = duration / stepTime;
  let current = 0;
  const increment = target / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, stepTime);
}

const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));

/* ─── TESTIMONIALS AUTO-SLIDER ─── */
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.tdot');
let currentSlide = 0;
let sliderTimer;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}
window.goToSlide = goToSlide;

function nextSlide() {
  goToSlide((currentSlide + 1) % slides.length);
}

function startSlider() {
  sliderTimer = setInterval(nextSlide, 5000);
}
function stopSlider() {
  clearInterval(sliderTimer);
}

if (slides.length > 0) {
  startSlider();
  const slider = document.getElementById('testimonials-slider');
  if (slider) {
    slider.addEventListener('mouseenter', stopSlider);
    slider.addEventListener('mouseleave', startSlider);
  }
}

/* ─── BACK TO TOP BUTTON ─── */
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (backToTop) {
    if (window.scrollY > 500) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }
});
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ─── CONTACT FORM VALIDATION ─── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('fname');
    const phone = document.getElementById('fphone');
    const course = document.getElementById('fcourse');
    const errName = document.getElementById('err-name');
    const errPhone = document.getElementById('err-phone');
    const errCourse = document.getElementById('err-course');
    const formSuccess = document.getElementById('form-success');
    const btnText = contactForm.querySelector('.btn-text');
    const btnLoader = contactForm.querySelector('.btn-loader');

    let valid = true;

    // Reset errors
    [errName, errPhone, errCourse].forEach(e => { if(e) e.textContent = ''; });
    [name, phone, course].forEach(f => { if(f) f.style.borderColor = ''; });

    if (!name.value.trim() || name.value.trim().length < 2) {
      errName.textContent = 'Please enter your full name.';
      name.style.borderColor = '#ff6b6b';
      valid = false;
    }

    const phoneRegex = /^[6-9]\d{9}$|^\+91[6-9]\d{9}$/;
    const cleanPhone = phone.value.replace(/\s/g, '');
    if (!cleanPhone || !phoneRegex.test(cleanPhone.replace('+91', '').replace(/^0/, ''))) {
      errPhone.textContent = 'Please enter a valid 10-digit mobile number.';
      phone.style.borderColor = '#ff6b6b';
      valid = false;
    }

    if (!course.value) {
      errCourse.textContent = 'Please select a course.';
      course.style.borderColor = '#ff6b6b';
      valid = false;
    }

    if (!valid) return;

    // Simulate form submit
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';

    setTimeout(() => {
      btnText.style.display = 'block';
      btnLoader.style.display = 'none';
      formSuccess.style.display = 'block';
      contactForm.reset();

      setTimeout(() => {
        formSuccess.style.display = 'none';
      }, 5000);
    }, 1400);
  });
}

/* ─── ACTIVE NAV LINK ON SCROLL ─── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active-link');
        }
      });
    }
  });
}, { threshold: 0.3, rootMargin: '-72px 0px 0px 0px' });

sections.forEach(section => sectionObserver.observe(section));

// Add active link style
const style = document.createElement('style');
style.textContent = `.nav-links a.active-link { color: var(--gold) !important; }`;
document.head.appendChild(style);

/* ─── PARALLAX ON HERO ORBS ─── */
const orbs = document.querySelectorAll('.orb');
window.addEventListener('mousemove', (e) => {
  const { clientX, clientY } = e;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const moveX = (clientX - centerX) / centerX;
  const moveY = (clientY - centerY) / centerY;

  orbs.forEach((orb, i) => {
    const strength = (i + 1) * 8;
    orb.style.transform = `translate(${moveX * strength}px, ${moveY * strength}px)`;
  });
});

/* ─── LAZY LOADING IMAGES ─── */
if ('loading' in HTMLImageElement.prototype) {
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.src = img.dataset.src || img.src;
  });
} else {
  // Fallback: IntersectionObserver polyfill
  const lazyImages = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        imageObserver.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => imageObserver.observe(img));
}

/* ─── COURSE CARD MICRO-INTERACTION ─── */
document.querySelectorAll('.course-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    card.style.transform = `translateY(-8px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─── FACULTY CARD MICRO-INTERACTION ─── */
document.querySelectorAll('.faculty-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    card.style.transform = `translateY(-8px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─── PAGE LOAD ANIMATION ─── */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 50);
});
