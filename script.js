// ═══════════════════════════════════════════════════════════
// BUILT NOT BORN - INTERACTIVE ANIMATIONS
// Scroll-triggered animations, counters, smooth interactions
// ═══════════════════════════════════════════════════════════

// === SMOOTH SCROLL FOR ANCHOR LINKS ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
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
            
            // Trigger counter animation for stats
            if (entry.target.classList.contains('stat-item')) {
                animateCounter(entry.target.querySelector('.stat-number'));
            }
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .stat-item').forEach(el => {
    observer.observe(el);
});

// === ANIMATED COUNTER FOR STATS ===
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// === PARALLAX EFFECT ON SCROLL ===
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            
            // Parallax hero background
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
            
            // Fade out scroll indicator
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator) {
                const opacity = Math.max(0, 1 - (scrolled / 300));
                scrollIndicator.style.opacity = opacity;
            }
            
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
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        bookWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    
    bookWrapper.addEventListener('mouseleave', () => {
        bookWrapper.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
}

// === BUTTON RIPPLE EFFECT ===
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// === ADD RIPPLE EFFECT STYLES ===
const style = document.createElement('style');
style.textContent = `
    .cta-button {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// === EMAIL FORM ENHANCEMENT ===
const emailForm = document.querySelector('.email-form');
if (emailForm) {
    const emailInput = emailForm.querySelector('input[type="email"]');
    const submitButton = emailForm.querySelector('button');
    
    emailForm.addEventListener('submit', function(e) {
        // Add loading state
        submitButton.innerHTML = '<span>Joining...</span>';
        submitButton.disabled = true;
        
        // Form will submit normally to ConvertKit
        // The disabled state and text will reset on page change
    });
    
    // Add focus effects
    emailInput.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.02)';
    });
    
    emailInput.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
    });
}

// === REVEAL ANIMATIONS ON LOAD ===
window.addEventListener('load', () => {
    // Add visible class to elements that should animate immediately
    document.querySelectorAll('.fade-in').forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
        }, index * 100);
    });
});

// === PERFORMANCE: REDUCE MOTION FOR USERS WHO PREFER IT ===
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .fade-in').forEach(el => {
        el.style.animation = 'none';
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
}

console.log('🔥 Built Not Born - Premium site loaded');