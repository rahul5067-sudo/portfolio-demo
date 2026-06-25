/**
 * Rahul Kumar — Full Stack Developer Portfolio
 * script.js
 * Vanilla JS: particles, typing animation, scroll effects,
 *             skill bars, AOS, form validation, mobile nav
 */

/* ═══════════════════════════════════════════════════════
   1. PARTICLE CANVAS
═══════════════════════════════════════════════════════ */
(function initParticles() {
  const canvas  = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx     = canvas.getContext('2d');
  let particles = [];
  let mouse     = { x: null, y: null };
  let animId;

  const CONFIG = {
    count:        70,
    maxRadius:    2.5,
    color:        '99, 102, 241',
    speed:        0.35,
    connectionDist: 130,
    mouseDist:    100,
  };

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.r  = Math.random() * CONFIG.maxRadius + 0.5;
    this.vx = (Math.random() - 0.5) * CONFIG.speed;
    this.vy = (Math.random() - 0.5) * CONFIG.speed;
    this.alpha = Math.random() * 0.5 + 0.2;
  };
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
  };

  function build() {
    particles = Array.from({ length: CONFIG.count }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${CONFIG.color}, ${p.alpha})`;
      ctx.fill();
    });

    // Connect nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < CONFIG.connectionDist) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          const alpha = (1 - dist / CONFIG.connectionDist) * 0.2;
          ctx.strokeStyle = `rgba(${CONFIG.color}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Mouse repel lines
    if (mouse.x !== null) {
      particles.forEach(p => {
        const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (dist < CONFIG.mouseDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          const alpha = (1 - dist / CONFIG.mouseDist) * 0.35;
          ctx.strokeStyle = `rgba(${CONFIG.color}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });
    }

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); build(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  // Pause when tab is hidden for performance
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(animId); }
    else { draw(); }
  });

  resize();
  build();
  draw();
})();


/* ═══════════════════════════════════════════════════════
   2. TYPING ANIMATION
═══════════════════════════════════════════════════════ */
(function initTyping() {
  const el     = document.getElementById('typingText');
  if (!el) return;

  const roles  = ['Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Problem Solver'];
  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let paused   = false;

  function tick() {
    const current = roles[roleIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; }, 1800);
        return;
      }
      setTimeout(tick, 80);
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 45);
    }
  }

  setTimeout(tick, 600);
})();


/* ═══════════════════════════════════════════════════════
   3. SCROLL EFFECTS: Progress Bar, Navbar, Back-to-Top
═══════════════════════════════════════════════════════ */
(function initScroll() {
  const progressBar = document.getElementById('scrollProgress');
  const navbar      = document.getElementById('navbar');
  const backToTop   = document.getElementById('backToTop');

  function onScroll() {
    const scrolled  = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct       = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;

    if (progressBar) progressBar.style.width = pct + '%';
    if (navbar)      navbar.classList.toggle('scrolled', scrolled > 50);
    if (backToTop)   backToTop.classList.toggle('visible', scrolled > 400);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();


/* ═══════════════════════════════════════════════════════
   4. ACTIVE NAV LINK (Intersection Observer)
═══════════════════════════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px' });

  sections.forEach(s => observer.observe(s));
})();


/* ═══════════════════════════════════════════════════════
   5. MOBILE NAV TOGGLE
═══════════════════════════════════════════════════════ */
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  const navLinks  = document.querySelectorAll('.nav-link');

  if (!hamburger || !navMenu) return;

  function close() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach(link => link.addEventListener('click', close));

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) close();
  });
})();


/* ═══════════════════════════════════════════════════════
   6. SKILL BAR ANIMATION (trigger on scroll into view)
═══════════════════════════════════════════════════════ */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.dataset.width || '0';
        // Small delay for stagger effect
        setTimeout(() => { fill.style.width = width + '%'; }, 100);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
})();


/* ═══════════════════════════════════════════════════════
   7. AOS — Animate On Scroll (lightweight custom)
═══════════════════════════════════════════════════════ */
(function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings by 80ms each
        const siblings = [...entry.target.parentElement.querySelectorAll('[data-aos]')];
        const idx      = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
})();


/* ═══════════════════════════════════════════════════════
   8. CONTACT FORM — Validation + Simulated Submit
═══════════════════════════════════════════════════════ */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  if (!form) return;

  const nameInput  = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const msgInput   = document.getElementById('contactMessage');
  const nameErr    = document.getElementById('nameError');
  const emailErr   = document.getElementById('emailError');
  const msgErr     = document.getElementById('messageError');
  const statusEl   = document.getElementById('formStatus');
  const submitBtn  = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const spinner    = document.getElementById('submitSpinner');

  function isValidEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function setError(errEl, input, msg) {
    errEl.textContent = msg;
    input.style.borderColor = '#f87171';
  }

  function clearError(errEl, input) {
    errEl.textContent = '';
    input.style.borderColor = '';
  }

  function validate() {
    let ok = true;
    if (nameInput.value.trim().length < 2) {
      setError(nameErr, nameInput, 'Please enter your name (min. 2 characters).');
      ok = false;
    } else { clearError(nameErr, nameInput); }

    if (!isValidEmail(emailInput.value)) {
      setError(emailErr, emailInput, 'Please enter a valid email address.');
      ok = false;
    } else { clearError(emailErr, emailInput); }

    if (msgInput.value.trim().length < 10) {
      setError(msgErr, msgInput, 'Message must be at least 10 characters.');
      ok = false;
    } else { clearError(msgErr, msgInput); }

    return ok;
  }

  // Inline validation
  [nameInput, emailInput, msgInput].forEach(input => {
    input.addEventListener('blur', validate);
    input.addEventListener('input', validate);
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validate()) return;

    // Loading state
    submitText.classList.add('hidden');
    spinner.classList.remove('hidden');
    submitBtn.disabled = true;
    statusEl.className = 'form-status';
    statusEl.textContent = '';

    // Simulate sending (replace with actual fetch to your backend / EmailJS)
    await new Promise(resolve => setTimeout(resolve, 1800));

    // Success
    submitText.classList.remove('hidden');
    spinner.classList.add('hidden');
    submitBtn.disabled = false;
    statusEl.className = 'form-status success';
    statusEl.textContent = '✓ Message sent! I\'ll get back to you soon.';
    form.reset();
    [nameErr, emailErr, msgErr].forEach(el => el.textContent = '');
    [nameInput, emailInput, msgInput].forEach(el => el.style.borderColor = '');

    // Clear status after 5 s
    setTimeout(() => {
      statusEl.className = 'form-status';
      statusEl.textContent = '';
    }, 5000);
  });
})();


/* ═══════════════════════════════════════════════════════
   9. SMOOTH SECTION NAV (for internal anchor links)
═══════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('navbar')?.offsetHeight || 68;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});