// Neural Network Animation Class
class NeuralNetwork {
    constructor(container) {
        this.container = container;
        this.svg = container.querySelector('#connections-svg');
        this.nodes = [];
        this.connections = [];
        this.animationId = null;
        this.lastActivation = 0;
        this.activationInterval = 3000; // 3 seconds
        
        // Check for reduced motion preference
        this.respectReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        if (this.respectReducedMotion) {
            this.createStaticNetwork();
            return;
        }
        
        this.createNodes();
        this.createConnections();
        this.animate();
        this.setupPeriodicActivation();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }
    
    createNodes() {
        const rect = this.container.getBoundingClientRect();
        const nodeCount = window.innerWidth < 768 ? 15 : 25; // Fewer nodes on mobile
        
        for (let i = 0; i < nodeCount; i++) {
            const size = this.getRandomSize();
            const node = {
                id: i,
                x: Math.random() * rect.width,
                y: Math.random() * rect.height,
                vx: (Math.random() - 0.5) * 0.5, // Slower movement
                vy: (Math.random() - 0.5) * 0.5,
                size: size,
                element: this.createNodeElement(size),
                active: false
            };
            
            this.nodes.push(node);
            this.container.appendChild(node.element);
        }
    }
    
    getRandomSize() {
        const rand = Math.random();
        if (rand < 0.5) return 'small';
        if (rand < 0.8) return 'medium';
        return 'large';
    }
    
    createNodeElement(size) {
        const node = document.createElement('div');
        node.className = `neuron ${size}`;
        return node;
    }
    
    createConnections() {
        this.connections = [];
        const maxDistance = window.innerWidth < 768 ? 120 : 150;
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const distance = this.getDistance(this.nodes[i], this.nodes[j]);
                if (distance < maxDistance) {
                    const connection = {
                        from: this.nodes[i],
                        to: this.nodes[j],
                        element: this.createConnectionElement(),
                        active: false
                    };
                    this.connections.push(connection);
                }
            }
        }
    }
    
    createConnectionElement() {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('class', 'connection-line');
        this.svg.appendChild(line);
        return line;
    }
    
    getDistance(node1, node2) {
        const dx = node1.x - node2.x;
        const dy = node1.y - node2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    updateNodes() {
        const rect = this.container.getBoundingClientRect();
        
        this.nodes.forEach(node => {
            // Update position
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x <= 0 || node.x >= rect.width) {
                node.vx *= -1;
                node.x = Math.max(0, Math.min(rect.width, node.x));
            }
            if (node.y <= 0 || node.y >= rect.height) {
                node.vy *= -1;
                node.y = Math.max(0, Math.min(rect.height, node.y));
            }
            
            // Update DOM element position
            node.element.style.left = `${node.x}px`;
            node.element.style.top = `${node.y}px`;
        });
    }
    
    updateConnections() {
        this.connections.forEach(connection => {
            const { from, to, element } = connection;
            
            element.setAttribute('x1', from.x);
            element.setAttribute('y1', from.y);
            element.setAttribute('x2', to.x);
            element.setAttribute('y2', to.y);
            
            // Check if connection should be visible based on distance
            const distance = this.getDistance(from, to);
            const maxDistance = window.innerWidth < 768 ? 120 : 150;
            
            if (distance > maxDistance) {
                element.style.opacity = '0';
            } else {
                const opacity = 1 - (distance / maxDistance);
                element.style.opacity = Math.max(0.1, opacity * 0.3);
            }
        });
    }
    
    activateRandomPathway() {
        // Deactivate previous activations
        this.nodes.forEach(node => {
            node.element.classList.remove('active');
            node.active = false;
        });
        this.connections.forEach(connection => {
            connection.element.classList.remove('active');
            connection.active = false;
        });
        
        // Find a random starting node
        const startNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
        const pathway = this.findPathway(startNode, 3 + Math.floor(Math.random() * 3)); // 3-5 nodes
        
        // Activate pathway with delay
        pathway.forEach((item, index) => {
            setTimeout(() => {
                if (item.type === 'node') {
                    item.node.element.classList.add('active');
                    item.node.active = true;
                } else if (item.type === 'connection') {
                    item.connection.element.classList.add('active');
                    item.connection.active = true;
                }
            }, index * 200); // 200ms delay between activations
        });
    }
    
    findPathway(startNode, maxLength) {
        const pathway = [{ type: 'node', node: startNode }];
        let currentNode = startNode;
        
        for (let i = 1; i < maxLength; i++) {
            const availableConnections = this.connections.filter(conn => 
                (conn.from === currentNode || conn.to === currentNode) &&
                !pathway.some(item => item.connection === conn)
            );
            
            if (availableConnections.length === 0) break;
            
            const randomConnection = availableConnections[Math.floor(Math.random() * availableConnections.length)];
            const nextNode = randomConnection.from === currentNode ? randomConnection.to : randomConnection.from;
            
            pathway.push({ type: 'connection', connection: randomConnection });
            pathway.push({ type: 'node', node: nextNode });
            
            currentNode = nextNode;
        }
        
        return pathway;
    }
    
    setupPeriodicActivation() {
        setInterval(() => {
            if (!this.respectReducedMotion) {
                this.activateRandomPathway();
            }
        }, this.activationInterval);
        
        // Initial activation after 1 second
        setTimeout(() => {
            if (!this.respectReducedMotion) {
                this.activateRandomPathway();
            }
        }, 1000);
    }
    
    animate() {
        if (!this.respectReducedMotion) {
            this.updateNodes();
            this.updateConnections();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    handleResize() {
        // Clear existing connections
        this.svg.innerHTML = '';
        this.connections = [];
        
        // Recreate connections with new dimensions
        this.createConnections();
        
        // Adjust node positions if they're outside new bounds
        const rect = this.container.getBoundingClientRect();
        this.nodes.forEach(node => {
            node.x = Math.min(node.x, rect.width);
            node.y = Math.min(node.y, rect.height);
        });
    }
    
    createStaticNetwork() {
        // Create a simple static version for reduced motion users
        const rect = this.container.getBoundingClientRect();
        const nodeCount = 8;
        
        for (let i = 0; i < nodeCount; i++) {
            const size = this.getRandomSize();
            const node = document.createElement('div');
            node.className = `neuron ${size}`;
            node.style.left = `${(i % 4) * (rect.width / 3) + rect.width / 8}px`;
            node.style.top = `${Math.floor(i / 4) * (rect.height / 2) + rect.height / 4}px`;
            this.container.appendChild(node);
        }
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Clean up nodes
        this.nodes.forEach(node => {
            if (node.element && node.element.parentNode) {
                node.element.parentNode.removeChild(node.element);
            }
        });
        
        // Clean up SVG
        this.svg.innerHTML = '';
    }
}

// Main Application Class
class PortfolioApp {
    constructor() {
        this.neuralNetwork = null;
        this.init();
    }
    
    init() {
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupScrollAnimations();
        this.setupActiveNavLinks();
        this.setupContactForm();
        this.initNeuralNetwork();
    }
    
    setupMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const navMenu = document.getElementById('nav-menu');
        
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = target.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, observerOptions);
        
        // Observe all cards and major sections
        document.querySelectorAll('.card, .hero-content, .section-title').forEach(el => {
            observer.observe(el);
        });
    }
    
    setupActiveNavLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentSection = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${currentSection}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3
        });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // Basic validation
            if (!this.validateEmail(data.email)) {
                this.showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            if (data.message.length < 10) {
                this.showFormMessage('Please enter a message with at least 10 characters.', 'error');
                return;
            }
            
            // Simulate form submission
            this.submitForm(data);
        });
    }
    
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    submitForm(data) {
        const submitButton = document.querySelector('#contact-form button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            console.log('Form submission data:', data);
            this.showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
            
            // Reset form
            document.getElementById('contact-form').reset();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    }
    
    showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message status status--${type}`;
        messageDiv.textContent = message;
        messageDiv.style.marginTop = '16px';
        
        // Insert after form
        const form = document.getElementById('contact-form');
        form.parentNode.insertBefore(messageDiv, form.nextSibling);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
    
    initNeuralNetwork() {
        const neuralContainer = document.getElementById('neural-network');
        if (neuralContainer) {
            this.neuralNetwork = new NeuralNetwork(neuralContainer);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Handle page visibility changes to optimize performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        const neuralNetwork = document.querySelector('.neural-network-bg');
        if (neuralNetwork) {
            neuralNetwork.style.animationPlayState = 'paused';
        }
    } else {
        // Resume animations when page becomes visible
        const neuralNetwork = document.querySelector('.neural-network-bg');
        if (neuralNetwork) {
            neuralNetwork.style.animationPlayState = 'running';
        }
    }
});

// Export for potential future use
window.PortfolioApp = PortfolioApp;
window.NeuralNetwork = NeuralNetwork;