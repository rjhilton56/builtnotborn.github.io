// ═══════════════════════════════════════════════════════════
// BUILT NOT BORN — INTERACTIVE ANIMATIONS & CONVERSION
// v3: Sticky bar, exit intent, FAQ accordion, counters
// ═══════════════════════════════════════════════════════════

// === SMOOTH SCROLL FOR ANCHOR LINKS ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// === INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ===
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('stat-item')) {
                animateCounter(entry.target.querySelector('.stat-number'));
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .stat-item').forEach(el => {
    observer.observe(el);
});

// === ANIMATED COUNTER FOR STATS ===
function animateCounter(element) {
    if (!element || element.dataset.animated) return;
    element.dataset.animated = 'true';

    const target = parseInt(element.getAttribute('data-target'));
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// === STICKY CTA BAR ===
const stickyCta = document.getElementById('stickyCta');
const footer = document.querySelector('footer');
let stickyVisible = false;

function updateStickyBar() {
    if (!stickyCta) return;
    const scrollY = window.pageYOffset;
    const heroHeight = window.innerHeight;
    const footerTop = footer ? footer.getBoundingClientRect().top + scrollY : Infinity;
    const shouldShow = scrollY > heroHeight * 0.6 && scrollY + window.innerHeight < footerTop + 60;

    if (shouldShow && !stickyVisible) {
        stickyCta.classList.add('visible');
        stickyCta.setAttribute('aria-hidden', 'false');
        stickyVisible = true;
    } else if (!shouldShow && stickyVisible) {
        stickyCta.classList.remove('visible');
        stickyCta.setAttribute('aria-hidden', 'true');
        stickyVisible = false;
    }
}

// === PARALLAX & SCROLL EFFECTS ===
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;

            // Parallax hero background
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.4}px)`;
            }

            // Fade out scroll indicator
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator) {
                const opacity = Math.max(0, 1 - (scrolled / 300));
                scrollIndicator.style.opacity = opacity;
            }

            updateStickyBar();
            ticking = false;
        });
        ticking = true;
    }
});

// === BOOK IMAGE 3D TILT EFFECT ===
const bookWrapper = document.querySelector('.book-image-wrapper');
if (bookWrapper) {
    bookWrapper.addEventListener('mousemove', (e) => {
        const rect = bookWrapper.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const rotateX = (y - rect.height / 2) / 20;
        const rotateY = (rect.width / 2 - x) / 20;
        bookWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    bookWrapper.addEventListener('mouseleave', () => {
        bookWrapper.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
}

// === BUTTON RIPPLE EFFECT ===
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .cta-button { position: relative; overflow: hidden; }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    @keyframes ripple-animation { to { transform: scale(4); opacity: 0; } }
    .visible { opacity: 1 !important; transform: translateY(0) !important; }
`;
document.head.appendChild(rippleStyle);

document.addEventListener('click', (e) => {
    const btn = e.target.closest('.cta-button');
    if (!btn) return;
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
    ripple.classList.add('ripple');
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
});

// === FAQ ACCORDION ===
document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function () {
        const isOpen = this.getAttribute('aria-expanded') === 'true';
        const answer = this.nextElementSibling;

        // Close all others
        document.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(other => {
            if (other !== this) {
                other.setAttribute('aria-expanded', 'false');
                other.nextElementSibling.classList.remove('open');
            }
        });

        // Toggle this one
        this.setAttribute('aria-expanded', String(!isOpen));
        answer.classList.toggle('open', !isOpen);
    });
});

// === EXIT INTENT POPUP ===
const exitPopup = document.getElementById('exitPopup');
const exitClose = document.getElementById('exitPopupClose');

function showExitPopup() {
    if (!exitPopup) return;
    exitPopup.classList.add('active');
    exitPopup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function hideExitPopup() {
    if (!exitPopup) return;
    exitPopup.classList.remove('active');
    exitPopup.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    sessionStorage.setItem('exitPopupShown', '1');
}

if (exitClose) {
    exitClose.addEventListener('click', hideExitPopup);
}

if (exitPopup) {
    exitPopup.addEventListener('click', (e) => {
        if (e.target === exitPopup) hideExitPopup();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && exitPopup.classList.contains('active')) hideExitPopup();
    });
}

// Trigger exit intent after 3s engagement, only once per session, desktop only
let exitIntentReady = false;
setTimeout(() => { exitIntentReady = true; }, 3000);

document.addEventListener('mouseleave', (e) => {
    if (
        e.clientY <= 0 &&
        exitIntentReady &&
        !sessionStorage.getItem('exitPopupShown') &&
        exitPopup &&
        window.innerWidth > 768
    ) {
        showExitPopup();
    }
});

// === EMAIL FORM ENHANCEMENT ===
const emailForm = document.querySelector('.email-form');
if (emailForm) {
    const emailInput = emailForm.querySelector('input[type="email"]');
    const submitButton = emailForm.querySelector('button');

    emailForm.addEventListener('submit', function () {
        submitButton.innerHTML = '<span>Joining...</span>';
        submitButton.disabled = true;
    });

    emailInput.addEventListener('focus', function () {
        this.parentElement.style.transform = 'scale(1.02)';
    });

    emailInput.addEventListener('blur', function () {
        this.parentElement.style.transform = 'scale(1)';
    });
}

// === REVEAL ANIMATIONS ON LOAD ===
window.addEventListener('load', () => {
    document.querySelectorAll('.fade-in').forEach((el, index) => {
        setTimeout(() => { el.style.opacity = '1'; }, index * 100);
    });
    updateStickyBar();
});

// === ACCESSIBILITY: REDUCE MOTION ===
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .fade-in, .particle').forEach(el => {
        el.style.animation = 'none';
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
}

console.log('🔥 Built Not Born v3 — Direct sales enabled');
