// Create an Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Add 'visible' class when element is in view
        if (entry.isIntersecting) {
            entry.target.querySelector('h1').classList.add('visible');
        }
    });
}, {
    threshold: 0.1 // Trigger when 10% of the element is visible
});

// Observe all sections except the first one (which animates on load)
document.querySelectorAll('.section:not(.first-section)').forEach((section) => {
    observer.observe(section);
});

// Hello in different languages
const helloTexts = [
    { text: "வணக்கம்", lang: "Tamil" },
    { text: "Привет", lang: "Russian" },
    { text: "नमस्ते", lang: "Hindi" },    
    { text: "Bonjour", lang: "French" },
    { text: "Hola", lang: "Spanish" },
    { text: "Ciao", lang: "Italian" },
    { text: "こんにちは", lang: "Japanese" },
    { text: "안녕하세요", lang: "Korean" },
    { text: "你好", lang: "Chinese" },
    { text: "Hallo", lang: "German" },
    { text: "Olá", lang: "Portuguese" },
    { text: "مرحبا", lang: "Arabic" },
    { text: "Γεια σας", lang: "Greek" },
];

// Loading animation
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');
    const helloText = document.getElementById('hello-text');
    let currentIndex = 0;

    // Function to update hello text with fade effect
    const updateHelloText = () => {
        helloText.style.opacity = '0';
        
        setTimeout(() => {
            helloText.textContent = helloTexts[currentIndex].text;
            helloText.style.opacity = '1';
            currentIndex = (currentIndex + 1) % helloTexts.length;
        }, 100);
    };

    // Start hello animation
    updateHelloText();
    const helloInterval = setInterval(updateHelloText, 200);

    // After all hellos are shown, fade out loading screen
    setTimeout(() => {
        clearInterval(helloInterval);
        loadingScreen.style.opacity = '0';
        mainContent.style.opacity = '1';
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.classList.remove('overflow-hidden');
            initializeMainContent();
        }, 100);
    }, (helloTexts.length * 200) + 10);
});

// Initialize main content
function initializeMainContent() {
    const heroSection = document.querySelector('#hero');
    const aboutSection = document.querySelector('#about');
    let isTransitioning = false;
    let currentSection = 1;

    // Handle scroll events
    function handleScroll(event) {
        if (isTransitioning) return;
        
        const delta = event.deltaY;
        
        if (delta > 0 && currentSection === 1) {
            // Scrolling down to about section
            isTransitioning = true;
            heroSection.classList.add('scrolling');
            aboutSection.classList.add('scrolling');
            currentSection = 2;
            
            // Add animation classes after transition starts
            setTimeout(() => {
                const profileLeft = aboutSection.querySelector('.space-y-6:first-child');
                const profileRight = aboutSection.querySelector('.space-y-6:last-child');
                if (profileLeft) profileLeft.classList.add('animate-fadeIn');
                if (profileRight) profileRight.classList.add('animate-slideIn');
            }, 300);
            
            // Reset transition lock
            setTimeout(() => {
                isTransitioning = false;
            }, 100);
        } else if (delta < 0 && currentSection === 2) {
            // Scrolling up to hero section
            isTransitioning = true;
            heroSection.classList.remove('scrolling');
            aboutSection.classList.remove('scrolling');
            currentSection = 1;
            
            // Remove animation classes
            const profileLeft = aboutSection.querySelector('.space-y-6:first-child');
            const profileRight = aboutSection.querySelector('.space-y-6:last-child');
            if (profileLeft) profileLeft.classList.remove('animate-fadeIn');
            if (profileRight) profileRight.classList.remove('animate-slideIn');
            
            // Reset transition lock
            setTimeout(() => {
                isTransitioning = false;
            }, 100);
        }
    }

    // Add wheel event listener for smooth scrolling
    window.addEventListener('wheel', handleScroll, { passive: true });

    // Handle touch events for mobile
    let touchStartY = 0;
    
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (isTransitioning) return;
        
        const touchEndY = e.touches[0].clientY;
        const delta = touchStartY - touchEndY;
        
        handleScroll({ deltaY: delta });
    }, { passive: true });

    // Handle keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (isTransitioning) return;
        
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            handleScroll({ deltaY: 100 });
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            handleScroll({ deltaY: -100 });
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80; // Height of your fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observerFadeIn = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // Stop observing once animation is triggered
            }
        });
    }, observerOptions);

    // Observe all sections and elements that should animate
    document.querySelectorAll('section, .project-card, .skill-item').forEach(el => {
        el.classList.add('fade-in');
        observerFadeIn.observe(el);
    });

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNavigation() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    document.addEventListener('DOMContentLoaded', highlightNavigation);
    window.addEventListener('scroll', highlightNavigation);

    // Intersection Observer for fade-in animations
    const observerFadeIn2 = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
            }
        });
    }, {
        threshold: 0.1
    });

    // Observe all sections and project cards
    document.querySelectorAll('section, .project-card').forEach((el) => {
        el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
        observerFadeIn2.observe(el);
    });

    // Add floating animation to profile image
    const profileImage = document.querySelector('.hero-image');
    if (profileImage) {
        profileImage.classList.add('animate-float');
    }

    // Project Slider
    const projectsTrack = document.querySelector('.projects-track');
    let isDown = false;
    let startX;
    let scrollLeft;

    projectsTrack.addEventListener('mousedown', (e) => {
        isDown = true;
        projectsTrack.style.cursor = 'grabbing';
        startX = e.pageX - projectsTrack.offsetLeft;
        scrollLeft = projectsTrack.scrollLeft;
        e.preventDefault(); // Prevent default dragging
    });

    projectsTrack.addEventListener('mouseleave', () => {
        isDown = false;
        projectsTrack.style.cursor = 'grab';
    });

    projectsTrack.addEventListener('mouseup', () => {
        isDown = false;
        projectsTrack.style.cursor = 'grab';
    });

    projectsTrack.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - projectsTrack.offsetLeft;
        const walk = (x - startX) * 2;
        projectsTrack.scrollLeft = scrollLeft - walk;
    });

    // Prevent image dragging
    const projectImages = document.querySelectorAll('.project-card img');
    projectImages.forEach(img => {
        img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // Touch events for mobile
    projectsTrack.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - projectsTrack.offsetLeft;
        scrollLeft = projectsTrack.scrollLeft;
    });

    projectsTrack.addEventListener('touchend', () => {
        isDown = false;
    });

    projectsTrack.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.touches[0].pageX - projectsTrack.offsetLeft;
        const walk = (x - startX) * 2;
        projectsTrack.scrollLeft = scrollLeft - walk;
    });

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('#mobile-menu .nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

function submitForm(e) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxTykp4eT21FaPUV3-4IjG4-T2vBQ7gNtGZpRMX18Y6brddJnOQXciseGHkpG6B1rV9Tg/exec';
    const form = document.forms['contactForm'];
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (e) e.preventDefault();
    
    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
    
    return fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => swal("Good job!", "Thanks for your message!", "success"))
        .then(() => { window.location.reload(); })
        .catch(error => {
            console.error('Error!', error.message);
            // Re-enable submit button on error
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Send Message';
            swal("Error!", "Something went wrong!", "error");
        });
}
