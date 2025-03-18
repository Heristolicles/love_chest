// Error handling utilities

// Custom error types
class DOMError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DOMError';
    }
}

class StorageError extends Error {
    constructor(message) {
        super(message);
        this.name = 'StorageError';
    }
}

class AssetError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AssetError';
    }
}

// Error handlers
function handleError(error, fallback = null) {
    console.error(`[Love Chest Error] ${error.name}: ${error.message}`);
    
    // Show user-friendly error message
    const errorMessages = {
        DOMError: "Es gab ein Problem beim Laden der Seite. Bitte lade die Seite neu.",
        StorageError: "Es gab ein Problem beim Speichern. Deine Daten sind möglicherweise nicht gespeichert.",
        AssetError: "Es gab ein Problem beim Laden der Animationen. Die Schatztruhe funktioniert trotzdem!",
        Error: "Es ist ein unerwarteter Fehler aufgetreten. Bitte lade die Seite neu."
    };

    showErrorMessage(errorMessages[error.name] || errorMessages.Error);
    return fallback;
}

// User-friendly error message display
function showErrorMessage(message) {
    // Remove any existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorElement.classList.add('fade-out');
        setTimeout(() => errorElement.remove(), 500);
    }, 5000);

    // Insert at the top of the app container
    const appContainer = document.getElementById('app');
    if (appContainer) {
        appContainer.insertBefore(errorElement, appContainer.firstChild);
    } else {
        document.body.insertBefore(errorElement, document.body.firstChild);
    }
}

// Safe DOM element getter
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        throw new DOMError(`Element with id "${id}" not found`);
    }
    return element;
}

// Safe localStorage wrapper
const safeStorage = {
    getItem(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            throw new StorageError(`Failed to read from storage: ${error.message}`);
        }
    },

    setItem(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            throw new StorageError(`Failed to write to storage: ${error.message}`);
        }
    },

    removeItem(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            throw new StorageError(`Failed to remove from storage: ${error.message}`);
        }
    }
};

export { 
    handleError, 
    showErrorMessage, 
    getElement, 
    safeStorage,
    DOMError,
    StorageError,
    AssetError
};