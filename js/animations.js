// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Ensure Lenis and GSAP ScrollTrigger work together perfectly
window.lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{
  window.lenis.raf(time * 1000)
});
gsap.ticker.lagSmoothing(0);

// --- Loader Animation ---
const tlLoader = gsap.timeline({
    onComplete: () => {
        document.querySelector('.loader').style.display = 'none';
    }
});

tlLoader.to('.loader-logo, .loader-text', {
    opacity: 1,
    scale: 1,
    duration: 1,
    stagger: 0.2,
    ease: 'power2.inOut'
})
.to('.loader-progress', {
    width: '100%',
    duration: 1.5,
    ease: 'power3.inOut'
}, '-=0.5')
.to('.loader', {
    yPercent: -100,
    duration: 1,
    ease: 'expo.inOut'
}, '+=0.5')
// Hero Text reveal right after loader
.from('.hero-title .line', {
    y: 100,
    opacity: 0,
    duration: 1.2,
    stagger: 0.15,
    ease: 'power4.out'
}, '-=0.5')
.to('.hero-subtitle, .scroll-indicator', {
    opacity: 1,
    duration: 1,
    ease: 'power2.out'
}, '-=0.5');

// --- Parallax Effects ---
// Hero content parallax on scroll
gsap.to('.hero-content', {
    y: '50%',
    opacity: 0,
    scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
    }
});

// About Image Parallax
gsap.to('.about-img', {
    y: '-20%',
    scrollTrigger: {
        trigger: '.about-image-wrapper',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
    }
});

// --- Text Reveals ---
// About Section text
gsap.from('.about .section-title, .about .section-desc, .about .btn', {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.about-text',
        start: 'top 80%',
    }
});

// --- Horizontal Scroll (Services) ---
// Only apply on non-mobile screens
let mm = gsap.matchMedia();

mm.add("(min-width: 1025px)", () => {
    const servicesWrapper = document.querySelector('.services-wrapper');
    const getScrollAmount = () => -(servicesWrapper.scrollWidth - window.innerWidth);
    
    gsap.to(servicesWrapper, {
        x: getScrollAmount,
        ease: "none",
        scrollTrigger: {
            trigger: ".services",
            start: "top top",
            end: () => `+=${getScrollAmount() * -1}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true
        }
    });
});

// --- Projects Reveal ---
const projectItems = document.querySelectorAll('.project-item');
projectItems.forEach(item => {
    gsap.from(item, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: item,
            start: 'top 85%',
        }
    });
});

// --- Team Reveal ---
gsap.from('.team-member', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
        trigger: '.team-grid',
        start: 'top 80%',
    }
});
