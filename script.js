document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Sticky Header
    const header = document.getElementById('header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    // Check initial scroll position
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    // 3. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // Toggle icon between menu and x
        const iconData = navMenu.classList.contains('active') ? 'x' : 'menu';
        mobileMenuBtn.innerHTML = `<i data-lucide="${iconData}"></i>`;
        lucide.createIcons();
    });

    // Close mobile menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = `<i data-lucide="menu"></i>`;
                lucide.createIcons();
            }
        });
    });

    // 4. Smooth Scrolling for anchor links (handled natively by CSS scroll-behavior: smooth, but we can enhance it if needed)
    // Here we just ensure offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in-section');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once it's visible
            }
        });
    }, appearOptions);
    
    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });

    // 6. Form Submission Handling
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnIcon = document.getElementById('btnIcon');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation happens natively via HTML5 'required' attribute, 
        // but we can add custom logic here if needed.
        
        // Change button state to loading
        btnText.textContent = 'Enviando...';
        btnIcon.setAttribute('data-lucide', 'loader');
        btnIcon.classList.add('spin-animation');
        lucide.createIcons();
        submitBtn.disabled = true;
        
        // Add a small spin animation dynamically if not in CSS
        if(!document.getElementById('spinStyle')) {
            const style = document.createElement('style');
            style.id = 'spinStyle';
            style.textContent = `
                .spin-animation {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        // Simulate network request
        setTimeout(() => {
            // Restore button
            btnText.textContent = 'Mensaje Enviado';
            btnIcon.setAttribute('data-lucide', 'check');
            btnIcon.classList.remove('spin-animation');
            lucide.createIcons();
            
            // Show success message
            formStatus.textContent = '¡Gracias por contactarnos! Nos comunicaremos contigo a la brevedad.';
            formStatus.className = 'form-status success';
            
            // Reset form fields
            contactForm.reset();
            
            // Revert button text after 3 seconds
            setTimeout(() => {
                btnText.textContent = 'Enviar Mensaje';
                btnIcon.setAttribute('data-lucide', 'send');
                lucide.createIcons();
                submitBtn.disabled = false;
                
                // Optional: hide success message after a while
                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.className = 'form-status';
                }, 5000);
            }, 3000);
            
        }, 1500); // 1.5 seconds simulated delay
    });
});
