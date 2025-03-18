document.addEventListener('DOMContentLoaded', () => {
    const hearts = ['❤️', '💖', '💗', '💓', '💝', '💕'];
    const heartsContainer = document.querySelector('.hearts-background');
    const numberOfHearts = 50;

    // Create static heart grid
    for (let i = 0; i < numberOfHearts; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = (Math.random() * 90 + 5) + 'vw';  // Keep hearts away from edges
        heart.style.top = (Math.random() * 90 + 5) + 'vh';   // Keep hearts away from edges
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.opacity = '0.3';
        heartsContainer.appendChild(heart);
    }
});
