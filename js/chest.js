import { 
    handleError, 
    getElement, 
    safeStorage,
    AssetError 
} from './utils/errorHandling.js';

import {
    getLastOpenedDate,
    setLastOpenedDate,
    getChestState,
    setChestState,
    getLastMessage,
    setLastMessage
} from './storage.js';

import { getDailyMessage } from './messages.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Chest.js loaded");
    
    // DOM Elements with safe getters
    let chestContainer, messageDisplay, chestButton, chestClosed, chestOpen;
    
    try {
        chestContainer = getElement('chest-container');
        messageDisplay = getElement('message-display');
        chestButton = getElement('chest-button');
        chestClosed = getElement('chest-closed');
        chestOpen = getElement('chest-open');
    } catch (error) {
        handleError(error);
        return; // Stop initialization if critical elements are missing
    }
    
    // Check if chest is already open today
    loadChestState();
    
    chestButton.addEventListener('click', handleChestClick);
    
    function handleChestClick() {
        try {
            const today = new Date().toDateString();
            const lastOpened = getLastOpenedDate();
            
            if (lastOpened === today) {
                showSavedMessage();
                return;
            }
            
            openChestWithAnimation();
        } catch (error) {
            handleError(error);
        }
    }
    
    function openChestWithAnimation() {
        chestClosed.classList.add('hidden');
        chestOpen.classList.remove('hidden');
        
        // Add timeout for SVG load
        const svgLoadTimeout = setTimeout(() => {
            handleError(new AssetError('SVG animation failed to load'), () => {
                // Fallback: Show message without animation
                showMessageWithoutAnimation();
            });
        }, 3000);
        
        chestOpen.addEventListener('load', function() {
            clearTimeout(svgLoadTimeout);
            const openChestSvg = chestOpen.contentDocument;
            if (!openChestSvg) {
                handleError(new AssetError('Failed to load chest animation'), () => {
                    showMessageWithoutAnimation();
                });
                return;
            }
            
            const trigger = openChestSvg.getElementById('chest-trigger');
            if (!trigger) {
                handleError(new AssetError('Animation trigger not found'), () => {
                    showMessageWithoutAnimation();
                });
                return;
            }
            
            try {
                trigger.beginElement();
                
                // Add sparkles with error handling
                setTimeout(() => {
                    try {
                        const sparkles = document.createElement('object');
                        sparkles.setAttribute('type', 'image/svg+xml');
                        sparkles.setAttribute('data', 'assets/sparkles.svg');
                        sparkles.className = 'sparkles';
                        
                        // Add timeout for sparkles load
                        const sparklesTimeout = setTimeout(() => {
                            handleError(new AssetError('Sparkles animation failed to load'));
                        }, 2000);
                        
                        sparkles.addEventListener('load', () => {
                            clearTimeout(sparklesTimeout);
                            requestAnimationFrame(() => {
                                sparkles.classList.add('active');
                            });
                        });
                        
                        sparkles.addEventListener('error', () => {
                            clearTimeout(sparklesTimeout);
                            handleError(new AssetError('Failed to load sparkles animation'));
                        });
                        
                        chestContainer.appendChild(sparkles);
                        
                        // Show message
                        setTimeout(() => {
                            showMessageWithAnimation();
                        }, 1500);
                    } catch (error) {
                        handleError(error);
                        showMessageWithoutAnimation();
                    }
                }, 500);
            } catch (error) {
                handleError(error);
                showMessageWithoutAnimation();
            }
        });
        
        chestOpen.addEventListener('error', () => {
            clearTimeout(svgLoadTimeout);
            handleError(new AssetError('Failed to load chest SVG'), () => {
                showMessageWithoutAnimation();
            });
        });
    }
    
    function showMessageWithAnimation() {
        try {
            const message = getDailyMessage();
            if (message) {
                messageDisplay.style.width = '250px';
                messageDisplay.style.maxWidth = '250px';
                messageDisplay.textContent = message;
                messageDisplay.classList.remove('hidden');
                messageDisplay.classList.add('message-reveal');
                
                // Save state
                setLastOpenedDate(new Date().toDateString());
                setLastMessage(message);
                setChestState(true);
                
                // Update button state
                updateButtonState(true);
            }
        } catch (error) {
            handleError(error);
            showMessageWithoutAnimation();
        }
    }
    
    function showMessageWithoutAnimation() {
        try {
            const message = getDailyMessage();
            if (message) {
                messageDisplay.style.width = '250px';
                messageDisplay.style.maxWidth = '250px';
                messageDisplay.textContent = message;
                messageDisplay.classList.remove('hidden');
                
                // Save state
                setLastOpenedDate(new Date().toDateString());
                setLastMessage(message);
                setChestState(true);
                
                // Update button state
                updateButtonState(true);
            }
        } catch (error) {
            handleError(error);
        }
    }
    
    function loadChestState() {
        try {
            const today = new Date().toDateString();
            const lastOpened = getLastOpenedDate();
            const chestIsOpen = getChestState();
            
            if (lastOpened === today && chestIsOpen) {
                // Restore open state
                chestClosed.classList.add('hidden');
                chestOpen.classList.remove('hidden');
                updateButtonState(true);
                showSavedMessage();
            } else {
                // Reset for new day
                chestClosed.classList.remove('hidden');
                chestOpen.classList.add('hidden');
                messageDisplay.classList.add('hidden');
                updateButtonState(false);
                
                if (lastOpened !== today) {
                    setChestState(false);
                    setLastMessage('');
                }
            }
        } catch (error) {
            handleError(error);
            // Set safe default state
            chestClosed.classList.remove('hidden');
            chestOpen.classList.add('hidden');
            messageDisplay.classList.add('hidden');
            updateButtonState(false);
        }
    }
    
    function showSavedMessage() {
        try {
            const savedMessage = getLastMessage();
            if (savedMessage) {
                messageDisplay.style.width = '250px';
                messageDisplay.style.maxWidth = '250px';
                messageDisplay.textContent = savedMessage;
                messageDisplay.classList.remove('hidden');
                messageDisplay.classList.add('message-reveal');
            }
        } catch (error) {
            handleError(error);
        }
    }
    
    function updateButtonState(disabled) {
        chestButton.textContent = disabled ? "Komm morgen wieder 😘" : "Schatz öffnen";
        chestButton.disabled = disabled;
    }
});