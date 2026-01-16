document.addEventListener('DOMContentLoaded', () => {
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
});

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
