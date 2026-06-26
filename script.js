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

    const form = document.getElementById("contactForm");
    if (!form) return;

    const nameInput = document.getElementById("contactName");
    const emailInput = document.getElementById("contactEmail");
    const msgInput = document.getElementById("contactMessage");

    const nameErr = document.getElementById("nameError");
    const emailErr = document.getElementById("emailError");
    const msgErr = document.getElementById("messageError");

    const statusEl = document.getElementById("formStatus");
    const submitBtn = document.getElementById("submitBtn");
    const submitText = document.getElementById("submitText");
    const spinner = document.getElementById("submitSpinner");

    function validEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validate() {

        let valid = true;

        nameErr.textContent = "";
        emailErr.textContent = "";
        msgErr.textContent = "";

        if (nameInput.value.trim().length < 2) {
            nameErr.textContent = "Please enter your name.";
            valid = false;
        }

        if (!validEmail(emailInput.value.trim())) {
            emailErr.textContent = "Enter a valid email.";
            valid = false;
        }

        if (msgInput.value.trim().length < 10) {
            msgErr.textContent = "Message should be at least 10 characters.";
            valid = false;
        }

        return valid;
    }

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        if (!validate()) return;

        submitBtn.disabled = true;
        submitText.classList.add("hidden");
        spinner.classList.remove("hidden");

        statusEl.className = "form-status";
        statusEl.textContent = "";

        const formData = new FormData(form);

        try {

            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {

                statusEl.className = "form-status success";
                statusEl.innerHTML = "✅ Message sent successfully!";

                form.reset();

            } else {

                statusEl.className = "form-status error";
                statusEl.innerHTML = "❌ " + result.message;
            }

        } catch (error) {

            statusEl.className = "form-status error";
            statusEl.innerHTML = "❌ Something went wrong. Please try again.";

        }

        submitBtn.disabled = false;
        submitText.classList.remove("hidden");
        spinner.classList.add("hidden");

        setTimeout(() => {

            statusEl.textContent = "";
            statusEl.className = "form-status";

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
