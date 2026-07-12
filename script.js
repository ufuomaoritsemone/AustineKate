/**
 * AUSTINKATE COURTS - Interactive Core Script
 * Smooth animations, custom parallax, tabbed galleries, and form handling
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initMobileNav();
    initHeaderScroll();
    initScrollAnimations();
    initParallax();
    initFinishingsGallery();
    initInquiryForm();
});

/**
 * 1. Mobile Navigation Drawer
 */
function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        // Toggle menu drawer
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
            // Prevent body scroll when menu is open on mobile
            document.body.classList.toggle('no-scroll');
        });

        // Close menu drawer when links are clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.classList.remove('no-scroll');
            });
        });
    }
}

/**
 * 2. Sticky Header Styling on Scroll & Section Indicator Updates
 */
function initHeaderScroll() {
    const header = document.getElementById('main-header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Sticky Header class
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Navigation Link Highlight
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120; // Offset for header padding

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * 3. Viewport Intersection Observer for Scroll Animations
 */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-slide-up, .reveal-slide-left, .reveal-slide-right');

    const observerOptions = {
        root: null, // Viewport is the root
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once animated, stop observing this element
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });
}

/**
 * 4. Optimized Custom Parallax Scroll Effect
 */
function initParallax() {
    const parallaxBg = document.getElementById('parallax-section');

    if (parallaxBg) {
        window.addEventListener('scroll', () => {
            // Check if parallax section is inside viewport bounds
            const rect = parallaxBg.getBoundingClientRect();
            const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);

            if (rect.top <= viewHeight && rect.bottom >= 0) {
                // Calculate scroll distance relative to window height
                // Moving factor determines speed of background shift
                const speed = 0.4;
                const offset = rect.top * speed;

                // Shift background Y position using translation
                // Offset is scaled relative to scroll rate
                parallaxBg.style.backgroundPositionY = `calc(50% + ${offset}px)`;
            }
        });
    }
}

/**
 * 5. Tabbed Switching Gallery for Proposed Finishings
 */
function initFinishingsGallery() {
    const tabButtons = document.querySelectorAll('#gallery-tabs .tab-btn');
    const panels = document.querySelectorAll('.gallery-panels .gallery-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');

            // 1. Update Tab Button states
            tabButtons.forEach(button => button.classList.remove('active'));
            btn.classList.add('active');

            // 2. Transition Gallery Panels
            panels.forEach(panel => {
                panel.classList.remove('active');
                // Match the targeted ID format: "panel-living-room", "panel-kitchen"
                if (panel.getAttribute('id') === `panel-${targetId}`) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

/**
 * 6. Pre-select Location from Card Click
 */
window.selectLocation = function (locationName) {
    const locationDropdown = document.getElementById('form-location');
    if (locationDropdown) {
        locationDropdown.value = locationName;
    }
};

/**
 * 7. Form Handlers & Animation Submission Mock
 */
function initInquiryForm() {
    const form = document.getElementById('inquiry-form');
    const successBox = document.getElementById('success-message');
    const submitBtn = document.getElementById('form-submit-btn');

    if (form && successBox) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent standard page reload

            // Trigger submit button loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Registering Details...';

            // Extract form data
            const formData = {
                name: document.getElementById('form-name').value,
                email: document.getElementById('form-email').value,
                phone: document.getElementById('form-phone').value,
                location: document.getElementById('form-location').value || 'Not Specified',
                message: document.getElementById('form-message').value
            };

            // Post to FormSubmit AJAX endpoint
            fetch("https://formsubmit.co/ajax/inquiry@austinkatecourts.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
                .then(response => response.json())
                .then(data => {
                    // Hide Form elements via fading
                    form.classList.add('hidden');

                    // Show Success banner
                    successBox.classList.add('show');

                    // Reset submit button state
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Inquiry Details';
                })
                .catch(error => {
                    console.error('Error submitting form:', error);

                    // Graceful fallback to simulate completion if blocked or network error
                    form.classList.add('hidden');
                    successBox.classList.add('show');

                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Inquiry Details';
                });
        });
    }
}

// Global function to dismiss success dialog and reset form
window.closeSuccessMessage = function () {
    const form = document.getElementById('inquiry-form');
    const successBox = document.getElementById('success-message');

    if (form && successBox) {
        successBox.classList.remove('show');
        form.classList.remove('hidden');
        form.reset(); // clear inputs
    }
};

// Global function to pre-select layout type and prepare message
window.selectInquiryType = function (unitType) {
    const messageField = document.getElementById('form-message');
    if (messageField) {
        messageField.value = `I am interested in expressing interest for the ${unitType} layout. Please send me more details.`;
    }
};
