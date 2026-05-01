/* ============================
   Hero typing effect
   ============================ */
const typedTextEl = document.getElementById('typed-text');
const typedStrings = [
  'backend-first systems.',
  'scalable REST APIs.',
  'real-time applications.',
  'clean, recruiter-friendly UI.'
];
let typedIndex = 0;
let charIndex = 0;
let isDeleting = false;

function updateTypedText() {
  if (!typedTextEl) return;
  const currentString = typedStrings[typedIndex];
  const updatedText = isDeleting
    ? currentString.substring(0, charIndex - 1)
    : currentString.substring(0, charIndex + 1);

  typedTextEl.textContent = updatedText;

  if (!isDeleting && updatedText === currentString) {
    setTimeout(() => { isDeleting = true; updateTypedText(); }, 1600);
    return;
  }

  if (isDeleting && updatedText === '') {
    isDeleting = false;
    typedIndex = (typedIndex + 1) % typedStrings.length;
    setTimeout(updateTypedText, 500);
    return;
  }

  charIndex = isDeleting ? charIndex - 1 : charIndex + 1;
  const speed = isDeleting ? 45 : 90;
  setTimeout(updateTypedText, speed);
}

/* ============================
   Navbar interactions
   ============================ */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const hamburger = document.getElementById('hamburger');
const navLinksList = document.getElementById('nav-links');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.querySelector('.theme-icon');

function setTheme(theme) {
  document.body.classList.toggle('light-mode', theme === 'light');
  localStorage.setItem('theme', theme);
  if (themeIcon) {
    themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
  }
}

function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const defaultTheme = savedTheme || 'dark';
  setTheme(defaultTheme);
}

window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }

  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
});

if (hamburger && navLinksList) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinksList.classList.toggle('open');
  });
}

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (hamburger && navLinksList) {
      hamburger.classList.remove('open');
      navLinksList.classList.remove('open');
    }
  });
});

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    setTheme(isLight ? 'dark' : 'light');
  });
}

/* ============================
   Intersection Observer
   ============================ */
const fadeEls = document.querySelectorAll('.fade-up');
const skillItems = document.querySelectorAll('.skill-item, .skill-group');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

fadeEls.forEach(el => observer.observe(el));

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

skillItems.forEach(item => skillObserver.observe(item));

/* ============================
   Contact Form
   ============================ */
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      if (formStatus) {
        formStatus.textContent = '⚠️ Please fill in all fields.';
        formStatus.style.color = '#ff6b6b';
      }
      return;
    }

    const endpoint = form.dataset.endpoint;
    if (!endpoint || endpoint.includes('yourFormId')) {
      if (formStatus) {
        formStatus.textContent = '✅ Message ready to send once your backend endpoint is configured.';
        formStatus.style.color = 'var(--accent)';
      }
      form.reset();
      return;
    }

    if (formStatus) {
      formStatus.textContent = '⏳ Sending...';
      formStatus.style.color = 'var(--text-muted)';
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        if (formStatus) {
          formStatus.textContent = `✅ Thanks ${name}! Message received. I\'ll get back to you soon.`;
          formStatus.style.color = 'var(--accent)';
        }
        form.reset();
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = '⚠️ Something went wrong. Please try again later.';
        formStatus.style.color = '#ff6b6b';
      }
    }
  });
}

/* ============================
   Smooth scroll
   ============================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (event) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================
   Startup
   ============================ */
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-loaded');
  initializeTheme();
  updateTypedText();
  const heroFades = document.querySelectorAll('#home .fade-up');
  heroFades.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 180 + i * 120);
  });
});
