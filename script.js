// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    preloader.classList.add('hidden');
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});

// Header Scroll Effect
const header = document.querySelector('.header');
const topBar = document.querySelector('.top-bar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');

hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Hero Slider
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

if (prevBtn && nextBtn) {
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
});

// Auto slide
setInterval(() => showSlide(currentSlide + 1), 5000);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.service-card, .type-card, .process-step, .testimonial-card, .info-card, .about-feature').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add animation class styles
const style = document.createElement('style');
style.textContent = `
    .animate {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Testimonial Slider
const testimonialTrack = document.querySelector('.testimonial-track');
const testPrev = document.querySelector('.test-prev');
const testNext = document.querySelector('.test-next');
let testimonialIndex = 0;

function updateTestimonialSlider() {
    if (!testimonialTrack) return;
    
    const cards = document.querySelectorAll('.testimonial-card');
    if (cards.length === 0) return;
    
    const cardWidth = cards[0].offsetWidth + 30;
    testimonialTrack.style.transform = `translateX(-${testimonialIndex * cardWidth}px)`;
}

if (testPrev && testNext) {
    testNext.addEventListener('click', () => {
        const cards = document.querySelectorAll('.testimonial-card');
        const maxIndex = cards.length - (window.innerWidth > 992 ? 3 : window.innerWidth > 768 ? 2 : 1);
        if (testimonialIndex < maxIndex) {
            testimonialIndex++;
            updateTestimonialSlider();
        }
    });
    
    testPrev.addEventListener('click', () => {
        if (testimonialIndex > 0) {
            testimonialIndex--;
            updateTestimonialSlider();
        }
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Form Submission - sends booking details to WhatsApp
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        const formData = new FormData(contactForm);
        const name = formData.get('name') || '';
        const phone = formData.get('phone') || '';
        const service = formData.get('service') || '';
        const machine = formData.get('machine') || '';
        const brand = formData.get('brand') || '';
        const issue = formData.get('issue') || '';

        const serviceNames = {
            repair: 'General Repair',
            installation: 'Installation',
            uninstall: 'Uninstallation',
            cleaning: 'Deep Cleaning',
            drainage: 'Water Drainage',
            pcb: 'PCB Repair'
        };

        const machineNames = {
            front: 'Front Load',
            top: 'Top Load',
            semi: 'Semi-Automatic',
            fully: 'Fully Automatic'
        };

        const message = [
            'New Service Booking - SM Techno Service',
            '----------------------------------',
            `Name: ${name}`,
            `Phone: ${phone}`,
            `Service: ${serviceNames[service] || service}`,
            `Machine Type: ${machineNames[machine] || machine}`,
            `Brand: ${brand}`,
            `Issue: ${issue}`
        ].join('\n');

        // Add loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening WhatsApp...';
        submitBtn.disabled = true;

        setTimeout(() => {
            const whatsappURL = `https://wa.me/919908473572?text=${encodeURIComponent(message)}`;
            window.open(whatsappURL, '_blank');

            submitBtn.innerHTML = '<i class="fas fa-check"></i> Opening WhatsApp...';
            submitBtn.style.background = '#25d366';

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                contactForm.reset();

                showNotification('Opening WhatsApp with your booking details...', 'success');
            }, 2000);
        }, 600);
    });
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 100px;
        right: 30px;
        padding: 20px 30px;
        background: var(--white);
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        transform: translateX(120%);
        transition: transform 0.3s ease;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        border-left: 4px solid #25d366;
    }
    
    .notification.success i {
        color: #25d366;
    }
    
    .notification.error {
        border-left: 4px solid #ff6b6b;
    }
    
    .notification.error i {
        color: #ff6b6b;
    }
`;
document.head.appendChild(notificationStyles);

// Parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 200;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Service card hover effect
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Image lazy loading
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
});

// Add smooth reveal animation to elements
function revealOnScroll() {
    const elements = document.querySelectorAll('.reveal');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('revealed');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Keyboard navigation for slider
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        showSlide(currentSlide - 1);
    } else if (e.key === 'ArrowRight') {
        showSlide(currentSlide + 1);
    }
});

// Touch swipe for slider
let touchStartX = 0;
let touchEndX = 0;

const heroSlider = document.querySelector('.hero-slider');

if (heroSlider) {
    heroSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    heroSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
}

function handleSwipe() {
    const swipeThreshold = 50;
    
    if (touchStartX - touchEndX > swipeThreshold) {
        showSlide(currentSlide + 1);
    } else if (touchEndX - touchStartX > swipeThreshold) {
        showSlide(currentSlide - 1);
    }
}

// Console easter egg
console.log('%c SM Techno Service ', 'background: #0066ff; color: white; font-size: 20px; padding: 10px;');
console.log('%c Hyderabad\'s #1 Washing Machine Service Center ', 'color: #64748b; font-size: 12px;');
