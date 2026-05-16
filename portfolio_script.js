// ==========================================
// PREMIUM PORTFOLIO - JAVASCRIPT
// ==========================================

// Initialize on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initFormHandling();
    initSmoothScroll();
    initFloatingButton();
});

// ==========================================
// NAVIGATION
// ==========================================

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hamburger Menu Toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Active link highlighting
    const sections = document.querySelectorAll('section, header');
    
    const updateActiveLink = () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();
}

// ==========================================
// SMOOTH SCROLL
// ==========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Only handle if it's a section link
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.skill-card, .project-card, .service-card, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
}

// ==========================================
// FORM HANDLING
// ==========================================

function initFormHandling() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Validate form
            if (!validateForm(formData)) {
                showNotification('Please fill in all fields correctly.', 'error');
                return;
            }

            // Show loading state
            const button = contactForm.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            button.textContent = 'Sending...';
            button.disabled = true;

            try {
                // Simulate form submission (replace with actual API call)
                await simulateFormSubmission(formData);
                
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                button.textContent = originalText;
                button.disabled = false;
            }
        });

        // Form input focus effects
        const inputs = contactForm.querySelectorAll('.form-input');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.transform = 'scale(1.02)';
            });

            input.addEventListener('blur', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }
}

function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return (
        data.name.trim() !== '' &&
        data.email.trim() !== '' &&
        emailRegex.test(data.email) &&
        data.subject.trim() !== '' &&
        data.message.trim() !== ''
    );
}

function simulateFormSubmission(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form submitted:', data);
            resolve();
        }, 1500);
    });
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'rgba(0, 255, 170, 0.2)' : 'rgba(255, 68, 68, 0.2)'};
        border: 1px solid ${type === 'success' ? 'rgba(0, 255, 170, 0.5)' : 'rgba(255, 68, 68, 0.5)'};
        color: ${type === 'success' ? '#00ffaa' : '#ff4444'};
        border-radius: 0.5rem;
        z-index: 10000;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Add animation styles for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// FLOATING CONTACT BUTTON
// ==========================================

function initFloatingButton() {
    const floatingCTA = document.getElementById('floatingCTA');
    
    if (floatingCTA) {
        // Show/hide based on scroll
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            const footerPosition = document.querySelector('.footer').offsetTop - window.innerHeight;

            if (scrollPosition > 500 && scrollPosition < footerPosition) {
                floatingCTA.style.display = 'flex';
            } else {
                floatingCTA.style.display = 'none';
            }
        });
    }
}

// ==========================================
// PARALLAX EFFECT (Optional Enhancement)
// ==========================================

function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.hero-visual');
    
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                if (element.parentElement.offsetTop > scrollPosition - window.innerHeight) {
                    element.style.transform = `translateY(${scrollPosition * 0.5}px)`;
                }
            });
        });
    }
}

// Initialize parallax when ready
window.addEventListener('load', initParallaxEffect);

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==========================================
// ACCESSIBILITY ENHANCEMENTS
// ==========================================

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');
        
        if (hamburger && hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==========================================
// ANIMATION FRAME FOR SMOOTH ANIMATIONS
// ==========================================

let scrollVelocity = 0;
let lastScrollY = 0;

window.addEventListener('scroll', throttle(() => {
    scrollVelocity = window.pageYOffset - lastScrollY;
    lastScrollY = window.pageYOffset;
}, 50));

// ==========================================
// PROJECT CARD INTERACTIONS
// ==========================================

function initProjectCardInteractions() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease-out';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Initialize project interactions
document.addEventListener('DOMContentLoaded', initProjectCardInteractions);

// ==========================================
// SKILL CARD HOVER EFFECTS
// ==========================================

function initSkillCardInteractions() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
        const icon = card.querySelector('.skill-icon');
        
        card.addEventListener('mouseenter', function() {
            icon.style.animation = 'none';
            setTimeout(() => {
                icon.style.animation = 'spin 0.6s ease-out';
            }, 10);
        });
    });
}

document.addEventListener('DOMContentLoaded', initSkillCardInteractions);

// ==========================================
// STATS COUNTER ANIMATION
// ==========================================

function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    let animated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                stats.forEach(stat => {
                    const finalValue = stat.textContent;
                    const numericValue = parseInt(finalValue);
                    
                    if (!isNaN(numericValue)) {
                        animateValue(stat, 0, numericValue, 1500);
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    document.querySelector('.about-stats')?.forEach(el => statsObserver.observe(el));
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const counter = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end + (element.textContent.includes('+') ? '+' : element.textContent.includes('%') ? '%' : '');
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : element.textContent.includes('%') ? '%' : '');
        }
    }, 16);
}

document.addEventListener('DOMContentLoaded', initStatsAnimation);

// ==========================================
// DYNAMIC YEAR IN FOOTER
// ==========================================

function updateFooterYear() {
    const yearElements = document.querySelectorAll('.footer-bottom p');
    const currentYear = new Date().getFullYear();
    
    yearElements.forEach(el => {
        if (el.textContent.includes('©')) {
            el.textContent = el.textContent.replace(/\d{4}/, currentYear);
        }
    });
}

document.addEventListener('DOMContentLoaded', updateFooterYear);

// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log(
    '%cAlexander Chen - Premium Portfolio',
    'color: #00d4ff; font-size: 16px; font-weight: bold;'
);
console.log(
    '%cCrafting digital experiences with elegance and precision',
    'color: #00ffaa; font-size: 12px;'
);

// ==========================================
// PAGE LOAD OPTIMIZATION
// ==========================================

// Report Core Web Vitals (optional)
function reportWebVitals() {
    if ('web-vital' in window) {
        window.addEventListener('load', () => {
            // Your analytics code here
        });
    }
}

reportWebVitals();

// ==========================================
// SERVICE DESCRIPTION EXPAND (Optional)
// ==========================================

function initServiceCardExpand() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            // Add selection effect
            serviceCards.forEach(c => c.style.opacity = '0.6');
            this.style.opacity = '1';
        });
    });
}

document.addEventListener('DOMContentLoaded', initServiceCardExpand);