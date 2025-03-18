import { handleError, DOMError } from './utils/errorHandling.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        const hearts = ['❤️', '💖', '💗', '💓', '💝', '💕'];
        const heartsContainer = document.querySelector('.hearts-background');
        
        if (!heartsContainer) {
            throw new DOMError('Hearts background container not found');
        }

        const numberOfHearts = 50;
        
        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();

        // Create static heart grid
        for (let i = 0; i < numberOfHearts; i++) {
            try {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
                
                // Keep hearts away from edges (5-95% of viewport)
                heart.style.left = `${Math.random() * 90 + 5}vw`;
                heart.style.top = `${Math.random() * 90 + 5}vh`;
                heart.style.fontSize = `${Math.random() * 20 + 10}px`;
                heart.style.opacity = '0.3';
                
                fragment.appendChild(heart);
            } catch (error) {
                // Log individual heart creation errors but continue with others
                console.error('Error creating heart:', error);
            }
        }

        // Single DOM operation to add all hearts
        heartsContainer.appendChild(fragment);
        
    } catch (error) {
        handleError(error);
        // Add minimal fallback heart background if main one fails
        try {
            const fallbackHeart = document.createElement('div');
            fallbackHeart.className = 'heart';
            fallbackHeart.innerHTML = '❤️';
            fallbackHeart.style.left = '50vw';
            fallbackHeart.style.top = '50vh';
            fallbackHeart.style.opacity = '0.3';
            document.body.appendChild(fallbackHeart);
        } catch {
            // Silently fail if even fallback fails
            console.error('Failed to create fallback heart background');
        }
    }
});
