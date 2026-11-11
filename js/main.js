// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Sync Lenis with GSAP Ticker
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Export lenis instance if needed in other files
window.lenis = lenis;

const header = document.querySelector('.header');
let previousScroll = lenis.scroll;

lenis.on('scroll', ({ scroll }) => {
    const scrollDelta = scroll - previousScroll;

    if (scroll < 100) {
        header.classList.remove('header-hidden');
        previousScroll = scroll;
    } else if (Math.abs(scrollDelta) >= 4) {
        header.classList.toggle('header-hidden', scrollDelta > 0);
        previousScroll = scroll;
    }
});

// Custom Cursor Logic
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const links = document.querySelectorAll('a, button, .project-item, .logo');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Immediate cursor update
    gsap.set(cursor, {
        x: mouseX,
        y: mouseY
    });
});

// Smooth follower update
gsap.ticker.add(() => {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    gsap.set(follower, {
        x: followerX,
        y: followerY
    });
});

// Hover effects for cursor
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        follower.classList.add('active');
        cursor.style.display = 'none';
    });
    
    link.addEventListener('mouseleave', () => {
        follower.classList.remove('active');
        cursor.style.display = 'block';
    });
});

// Magnetic Buttons
const magneticElements = document.querySelectorAll('.magnetic, .logo');

magneticElements.forEach((elem) => {
    elem.addEventListener('mousemove', (e) => {
        const rect = elem.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(elem, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
    
    elem.addEventListener('mouseleave', () => {
        gsap.to(elem, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)'
        });
    });
});
