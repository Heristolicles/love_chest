import { handleError } from './utils/errorHandling.js';
import './chest.js';
import './background.js';

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('serviceWorker.js', {
                scope: './'
            });
            console.log('Service Worker registered successfully:', registration);
        } catch (error) {
            handleError(new Error(`Service Worker registration failed: ${error.message}`));
        }
    });
}