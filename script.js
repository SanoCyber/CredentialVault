// script.js for CredentialVault

document.addEventListener('DOMContentLoaded', () => {

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const mobileMenu = document.getElementById('mobileMenu');
            if (this.classList.contains('mobile-nav-link') && mobileMenu) {
                mobileMenu.classList.add('hidden');
            }

            const hrefAttribute = this.getAttribute('href');
            if (hrefAttribute && hrefAttribute !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(hrefAttribute);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            } else if (hrefAttribute === '#') {
                 e.preventDefault();
                 window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    // Header scroll effect
    const header = document.getElementById('mainHeader');
    if (header) {
        window.onscroll = function() {
            if (window.scrollY > 50) {
                header.classList.add('bg-[#0a0f1f]', 'bg-opacity-95', 'shadow-xl', 'backdrop-blur-lg'); // Enhanced shadow and blur
                header.classList.remove('py-4');
                header.classList.add('py-3');
            } else {
                header.classList.remove('bg-[#0a0f1f]', 'bg-opacity-95', 'shadow-xl', 'backdrop-blur-lg');
                header.classList.add('py-4');
                header.classList.remove('py-3');
            }
        };
    }

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobileMenuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Current Year for Footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Sign Up Form Handling with Formspree
    const signupForm = document.getElementById('signupForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const formSubmissionError = document.getElementById('formSubmissionError');
    const successModal = document.getElementById('successModal');
    const closeModalButton = document.getElementById('closeModalButton');
    const modalOverlay = successModal ? successModal.querySelector('.modal-overlay') : null;

    // !!! IMPORTANT: Replace with your actual Formspree endpoint URL !!!
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjkwrdja'; // Replace YOUR_FORM_ID

    if (signupForm && nameInput && emailInput && nameError && emailError && successModal && closeModalButton && formSubmissionError) {
        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            let isValid = true;
            formSubmissionError.classList.add('hidden');
            formSubmissionError.textContent = '';

            // Validate Name
            if (nameInput.value.trim() === '') {
                nameError.textContent = 'Please enter your name.';
                nameError.classList.remove('hidden');
                nameInput.classList.add('border-red-400');
                isValid = false;
            } else {
                nameError.classList.add('hidden');
                nameInput.classList.remove('border-red-400');
            }

            // Validate Email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() === '' || !emailPattern.test(emailInput.value.trim())) {
                emailError.textContent = 'Please enter a valid email address.';
                emailError.classList.remove('hidden');
                emailInput.classList.add('border-red-400');
                isValid = false;
            } else {
                emailError.classList.add('hidden');
                emailInput.classList.remove('border-red-400');
            }

            if (isValid) {
                const formData = new FormData(signupForm);
                const submitButton = signupForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.innerHTML; // Store full HTML content of button
                // Add a simple spinner to the button text
                submitButton.innerHTML = 'Submitting... <span class="animate-spin inline-block ml-2 w-4 h-4 border-2 border-current border-t-transparent rounded-full" role="status" aria-hidden="true"></span>';
                submitButton.disabled = true;

                try {
                    const response = await fetch(FORMSPREE_ENDPOINT, {
                        method: 'POST',
                        body: formData,
                        headers: { 'Accept': 'application/json' }
                    });

                    if (response.ok) {
                        successModal.classList.remove('hidden');
                        const modalContent = successModal.querySelector('.modal-glass');
                        if (modalContent) {
                            setTimeout(() => {
                                modalContent.classList.remove('scale-95', 'opacity-0');
                                modalContent.classList.add('scale-100', 'opacity-100');
                            }, 50);
                        }
                        signupForm.reset();
                    } else {
                        const responseData = await response.json();
                        formSubmissionError.textContent = responseData.errors?.map(err => err.message || err.error).join(', ') || 'Oops! Something went wrong. Please try again.';
                        formSubmissionError.classList.remove('hidden');
                    }
                } catch (error) {
                    console.error('Form submission error:', error);
                    formSubmissionError.textContent = 'Network error. Please check your connection and try again.';
                    formSubmissionError.classList.remove('hidden');
                } finally {
                    submitButton.innerHTML = originalButtonText; // Restore original button HTML
                    submitButton.disabled = false;
                }
            }
        });

        const closeTheModal = () => {
            const modalContent = successModal.querySelector('.modal-glass');
            if (modalContent) {
                modalContent.classList.add('scale-95', 'opacity-0');
                modalContent.classList.remove('scale-100', 'opacity-100');
                setTimeout(() => { successModal.classList.add('hidden'); }, 300);
            }
        };

        closeModalButton.addEventListener('click', closeTheModal);
        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeTheModal);
        }
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !successModal.classList.contains('hidden')) {
                closeTheModal();
            }
        });
    }

    // Intersection Observer for animations on scroll
    // Targets elements with 'opacity-0' class OR 'animated-heading'
    const animatedElements = document.querySelectorAll(
        '.animated-heading, .opacity-0' // Simplified selector
    );
    
    if (typeof IntersectionObserver !== 'undefined') {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;

                    if (target.classList.contains('animated-heading')) {
                        const spans = target.querySelectorAll('span');
                        spans.forEach((span, index) => {
                            const wordAnimDuration = 0.7; 
                            const wordStaggerFactor = 0.15; 
                            // Add any base delay from the parent .animated-heading if it exists
                            const baseDelay = parseFloat(target.style.animationDelay || 0);
                            const calculatedDelay = (index * wordStaggerFactor) + baseDelay;
                            
                            // Ensure initial state is set by JS for robustness, even if CSS has it.
                            span.style.opacity = '0'; 
                            span.style.transform = 'translateY(20px)';
                            span.style.animation = `fadeInUp ${wordAnimDuration}s forwards ${calculatedDelay}s`;
                        });
                    } else if (target.classList.contains('opacity-0')) {
                        // Generic fadeInUp for other elements with opacity-0
                        // The animation-delay should be set inline on the HTML element
                        target.style.animation = `fadeInUp 0.6s forwards ${target.style.animationDelay || '0s'}`;
                        // The .opacity-0 class in CSS handles initial hidden state.
                        // The 'forwards' fill-mode in animation will keep it visible.
                    }
                    observer.unobserve(target); 
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% of the element is visible

        animatedElements.forEach(el => {
            // CSS for .opacity-0 and .animated-heading span should handle initial hidden state.
            // JS just adds the animation property when element is in view.
            observer.observe(el);
        });

    } else {
        // Fallback for browsers that don't support IntersectionObserver
        animatedElements.forEach(el => {
            el.style.opacity = '1'; // Make all animated elements visible
            if (el.classList.contains('animated-heading')) {
                el.querySelectorAll('span').forEach(span => {
                    span.style.transform = 'translateY(0)';
                });
            } else {
                 el.style.transform = 'translateY(0)'; // Reset any transform for other elements
            }
        });
    }
});
