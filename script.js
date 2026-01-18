document.addEventListener('DOMContentLoaded', () => {
    // Original IntersectionObserver Logic
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once shown
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Original Style Injection
    /* Update style.css to support the intersection observer reveal */
    const styleUpdate = `
    .animate {
        opacity: 0;
        transform: translateY(30px);
        transition: all 1s ease;
    }

    .animate.visible {
        opacity: 1;
        transform: translateY(0);
    }
    `;

    const styleTag = document.createElement('style');
    styleTag.innerHTML = styleUpdate;
    document.head.appendChild(styleTag);

    // --- IPTV & Remote Input Method Support ---
    initInputControls();
});

/**
 * Initializes full control accessibility for IPTV remote controls,
 * pointer inputs, and drag gestures.
 */
function initInputControls() {
    // Configuration
    const SCROLL_STEP = 300; // Pixels to scroll per key press
    const html = document.documentElement;
    
    // State for Dragging
    let isDown = false;
    let isDragging = false;
    let startY;
    let scrollTop;
    let animationFrameId;

    // --- 1. REMOTE KEY & KEYBOARD NAVIGATION ---
    document.addEventListener('keydown', (e) => {
        const key = e.key;
        const code = e.keyCode;

        // Common KeyCodes for Remote Controls
        // 38: Arrow Up, 40: Arrow Down
        // 33: Page Up, 34: Page Down (Optional helpers)
        
        if (key === 'ArrowUp' || code === 38) {
            e.preventDefault(); // Stop default browser "jump"
            window.scrollBy({ top: -SCROLL_STEP, behavior: 'smooth' });
        } 
        else if (key === 'ArrowDown' || code === 40) {
            e.preventDefault();
            window.scrollBy({ top: SCROLL_STEP, behavior: 'smooth' });
        }
        else if (key === 'PageUp' || code === 33) {
            e.preventDefault();
            window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
        }
        else if (key === 'PageDown' || code === 34) {
            e.preventDefault();
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        }
        // Enter/OK (13) is left to default (clicking) behavior as requested
    });

    // --- 2. DRAG SCROLLING (Air Mouse / Pointer / Touch Wrapper) ---
    
    // stop ghost image dragging which interferes with scroll drag
    window.addEventListener('dragstart', (e) => e.preventDefault());

    document.addEventListener('mousedown', (e) => {
        // Only trigger on left mouse button (Standard Select/Click button)
        if (e.button !== 0) return;

        isDown = true;
        isDragging = false;
        startY = e.pageY;
        scrollTop = window.scrollY;

        // UI Feedback & Optimization for Drag
        document.body.style.cursor = 'grabbing';
        // Temporarily disable smooth scroll for direct 1:1 control response
        html.style.scrollBehavior = 'auto'; // 'auto' means instant/browser-default (overrides CSS 'smooth')
    });

    const stopDrag = () => {
        if (!isDown) return;
        isDown = false;
        document.body.style.cursor = '';
        html.style.scrollBehavior = ''; // Restore CSS smooth scrolling
        
        // Short delay to reset dragging status after click events might have fired
        setTimeout(() => { isDragging = false; }, 0);
    };

    document.addEventListener('mouseleave', stopDrag);
    document.addEventListener('mouseup', stopDrag);

    document.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault(); // Prevent text selection/highlighting during drag

        const y = e.pageY;
        const walk = (y - startY); // Calculate distance moved

        // Threshold to distinguish click vs drag
        if (Math.abs(walk) > 5) {
            isDragging = true;
        }

        // Use requestAnimationFrame for performance-safe scrolling on TVs
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        
        animationFrameId = requestAnimationFrame(() => {
            window.scrollTo(0, scrollTop - walk);
        });
    });

    // --- 3. CLICK PREVENTION ---
    // Prevent accidental clicks on links when user meant to "Drag Scroll"
    document.addEventListener('click', (e) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true); // Capture phase to intercept before target
}
