// Portfolio Website JavaScript

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollAnimations();
        this.setupBlogFunctionality();
        this.setupContactForm();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupPageSwitching();
    }

    // Navigation functionality
    setupNavigation() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Sticky navbar effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.backgroundColor = 'rgba(var(--color-surface-rgb, 255, 255, 253), 0.95)';
                navbar.style.boxShadow = 'var(--shadow-sm)';
            } else {
                navbar.style.backgroundColor = 'rgba(var(--color-background-rgb, 252, 252, 249), 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });

        // Update active nav link based on scroll position
        this.updateActiveNavLink();
        window.addEventListener('scroll', () => this.updateActiveNavLink());
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.portfolio-nav');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // Smooth scrolling for anchor links
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Mobile menu functionality
    setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Scroll animations using Intersection Observer
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            observer.observe(section);
        });

        // Observe cards and other elements
        const animatedElements = document.querySelectorAll('.card, .fade-in');
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }


    // Blog functionality
    setupBlogFunctionality() {
        this.setupBlogFilters();
        this.setupBlogSearch();
    }

    setupBlogFilters() {
        const filterButtons = document.querySelectorAll('.blog-filters .filter-btn');
        const blogPosts = document.querySelectorAll('.blog-post');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filter blog posts
                this.filterBlogPosts(category, blogPosts);
            });
        });
    }

    filterBlogPosts(category, blogPosts) {
        blogPosts.forEach(post => {
            const postCategory = post.getAttribute('data-category');
            
            if (category === 'all') {
                post.style.display = 'block';
                setTimeout(() => {
                    post.style.opacity = '1';
                    post.style.transform = 'translateY(0)';
                }, 10);
            } else {
                if (postCategory === category) {
                    post.style.display = 'block';
                    setTimeout(() => {
                        post.style.opacity = '1';
                        post.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    post.style.opacity = '0';
                    post.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        post.style.display = 'none';
                    }, 300);
                }
            }
        });
    }

    setupBlogSearch() {
        const searchInput = document.getElementById('blog-search-input');
        const blogPosts = document.querySelectorAll('.blog-post');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                this.searchBlogPosts(searchTerm, blogPosts);
            });
        }
    }

    searchBlogPosts(searchTerm, blogPosts) {
        blogPosts.forEach(post => {
            const title = post.querySelector('h3').textContent.toLowerCase();
            const excerpt = post.querySelector('p').textContent.toLowerCase();
            const category = post.getAttribute('data-category').toLowerCase();
            
            const matchesSearch = title.includes(searchTerm) || 
                                excerpt.includes(searchTerm) || 
                                category.includes(searchTerm);
            
            if (matchesSearch || searchTerm === '') {
                post.style.display = 'block';
                setTimeout(() => {
                    post.style.opacity = '1';
                    post.style.transform = 'translateY(0)';
                }, 10);
            } else {
                post.style.opacity = '0';
                post.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    post.style.display = 'none';
                }, 300);
            }
        });
    }

    // Page switching functionality
    setupPageSwitching() {
        const portfolioNav = document.querySelectorAll('.portfolio-nav');
        const blogNav = document.querySelectorAll('.blog-nav');
        const portfolioPage = document.getElementById('portfolio-page');
        const blogPage = document.getElementById('blog-page');

        // Handle portfolio navigation
        portfolioNav.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#')) {
                    // Internal portfolio navigation
                    this.showPortfolioPage();
                }
            });
        });

        // Handle blog navigation
        blogNav.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showBlogPage();
            });
        });

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (window.location.hash === '#blog') {
                this.showBlogPage();
            } else {
                this.showPortfolioPage();
            }
        });

        // Initialize based on URL hash
        if (window.location.hash === '#blog') {
            this.showBlogPage();
        }
    }

    showPortfolioPage() {
        document.getElementById('portfolio-page').classList.remove('hidden');
        document.getElementById('blog-page').classList.add('hidden');
        
        // Update URL without triggering scroll
        history.pushState({page: 'portfolio'}, 'Portfolio', '#');
        
        // Update nav active states
        document.querySelectorAll('.blog-nav').forEach(link => link.classList.remove('active'));
    }

    showBlogPage() {
        document.getElementById('portfolio-page').classList.add('hidden');
        document.getElementById('blog-page').classList.remove('hidden');
        
        // Update URL
        history.pushState({page: 'blog'}, 'Blog', '#blog');
        
        // Update nav active states
        document.querySelectorAll('.portfolio-nav').forEach(link => link.classList.remove('active'));
        document.querySelectorAll('.blog-nav').forEach(link => link.classList.add('active'));
        
        // Scroll to top of blog page
        window.scrollTo(0, 0);
    }

    // Contact form functionality
    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactFormSubmit(contactForm);
            });
        }
    }

    handleContactFormSubmit(form) {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Validate form data
        if (!this.validateContactForm(data)) {
            return;
        }

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            this.showContactFormSuccess();
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    }

    validateContactForm(data) {
        const errors = [];

        if (!data.name.trim()) {
            errors.push('Name is required');
        }

        if (!data.email.trim()) {
            errors.push('Email is required');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!data.subject.trim()) {
            errors.push('Subject is required');
        }

        if (!data.message.trim()) {
            errors.push('Message is required');
        }

        if (errors.length > 0) {
            this.showContactFormErrors(errors);
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showContactFormErrors(errors) {
        // Remove existing error messages
        const existingErrors = document.querySelectorAll('.form-error');
        existingErrors.forEach(error => error.remove());

        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.style.cssText = `
            background: rgba(var(--color-error-rgb), 0.1);
            color: var(--color-error);
            padding: var(--space-12);
            border-radius: var(--radius-base);
            margin-bottom: var(--space-16);
            border: 1px solid rgba(var(--color-error-rgb), 0.3);
        `;

        const errorList = document.createElement('ul');
        errorList.style.cssText = 'margin: 0; padding-left: var(--space-16);';

        errors.forEach(error => {
            const listItem = document.createElement('li');
            listItem.textContent = error;
            errorList.appendChild(listItem);
        });

        errorDiv.appendChild(errorList);

        // Insert error message at the top of the form
        const contactForm = document.getElementById('contact-form');
        contactForm.insertBefore(errorDiv, contactForm.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    showContactFormSuccess() {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.form-success, .form-error');
        existingMessages.forEach(msg => msg.remove());

        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.style.cssText = `
            background: rgba(var(--color-success-rgb), 0.1);
            color: var(--color-success);
            padding: var(--space-12);
            border-radius: var(--radius-base);
            margin-bottom: var(--space-16);
            border: 1px solid rgba(var(--color-success-rgb), 0.3);
            text-align: center;
        `;
        successDiv.textContent = 'Thank you for your message! I\'ll get back to you soon.';

        // Insert success message
        const contactForm = document.getElementById('contact-form');
        contactForm.insertBefore(successDiv, contactForm.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    // Utility functions
    debounce(func, wait) {
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

}

// Newsletter functionality
function setupNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        const input = newsletterForm.querySelector('input[type="email"]');
        const button = newsletterForm.querySelector('button');
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (input.value && input.validity.valid) {
                const originalText = button.textContent;
                button.textContent = 'Subscribed!';
                button.disabled = true;
                input.value = '';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 2000);
            } else {
                input.focus();
                input.style.borderColor = 'var(--color-error)';
                setTimeout(() => {
                    input.style.borderColor = '';
                }, 2000);
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    app.addTransitionStyles();
    setupNewsletter();
    
    // Add some dynamic behavior for better UX
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }
    }, 100);
});

// Handle resize events
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
    
    // Enter key to submit forms
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'submit') {
        const form = e.target.closest('form');
        if (form) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.click();
            }
        }
    }
});

// Performance optimization: Lazy load heavy content
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add any lazy loading functionality here
            entry.target.classList.add('loaded');
        }
    });
});

// Add loading states and error handling for external links
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.target === '_blank') {
        // Add loading indicator for external links
        const originalText = e.target.textContent;
        e.target.textContent = 'Opening...';
        setTimeout(() => {
            e.target.textContent = originalText;
        }, 1000);
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}