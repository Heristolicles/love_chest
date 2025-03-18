import { handleError, safeStorage, StorageError } from './utils/errorHandling.js';

/**
 * @typedef {Object} StorageKeys
 * @property {string} MESSAGES - Key for stored messages
 * @property {string} LAST_OPENED - Key for last opened date
 * @property {string} LAST_MESSAGE_INDEX - Key for last message index
 * @property {string} LAST_MESSAGE - Key for last shown message
 * @property {string} CHEST_STATE - Key for chest open/closed state
 */

/** @type {StorageKeys} */
const StorageKeys = {
    MESSAGES: 'dailyLoveChest',
    LAST_OPENED: 'lastOpenedDate',
    LAST_MESSAGE_INDEX: 'lastMessageIndex',
    LAST_MESSAGE: 'currentMessage',
    CHEST_STATE: 'chestOpen'
};

/**
 * Validates a date string
 * @param {string} date - Date string to validate
 * @returns {boolean} - Whether the date is valid
 */
function isValidDate(date) {
    if (!date) return false;
    try {
        return Boolean(new Date(date).getTime());
    } catch {
        return false;
    }
}

/**
 * Gets stored messages array
 * @returns {string[]} Array of messages
 */
export function getMessages() {
    try {
        const messages = safeStorage.getItem(StorageKeys.MESSAGES);
        if (!messages) return [];
        
        const parsed = JSON.parse(messages);
        if (!Array.isArray(parsed)) {
            throw new StorageError('Stored messages are not in valid format');
        }
        
        return parsed;
    } catch (error) {
        handleError(error);
        return [];
    }
}

/**
 * Saves messages array to storage
 * @param {string[]} messages - Array of messages to save
 */
export function saveMessages(messages) {
    try {
        if (!Array.isArray(messages)) {
            throw new StorageError('Messages must be an array');
        }
        safeStorage.setItem(StorageKeys.MESSAGES, JSON.stringify(messages));
    } catch (error) {
        handleError(error);
    }
}

/**
 * Gets the date when the chest was last opened
 * @returns {string|null} Last opened date or null if never opened
 */
export function getLastOpenedDate() {
    try {
        const date = safeStorage.getItem(StorageKeys.LAST_OPENED);
        return isValidDate(date) ? date : null;
    } catch (error) {
        handleError(error);
        return null;
    }
}

/**
 * Sets the date when the chest was last opened
 * @param {string} date - Date string to save
 */
export function setLastOpenedDate(date) {
    try {
        if (!isValidDate(date)) {
            throw new StorageError('Invalid date format');
        }
        safeStorage.setItem(StorageKeys.LAST_OPENED, date);
    } catch (error) {
        handleError(error);
    }
}

/**
 * Checks if the chest can be opened today
 * @returns {boolean} Whether the chest can be opened
 */
export function canOpenChest() {
    try {
        const lastOpened = getLastOpenedDate();
        if (!lastOpened) return true;
        
        const today = new Date().toDateString();
        return today !== lastOpened;
    } catch (error) {
        handleError(error);
        return true; // Allow opening on error to prevent lockout
    }
}

/**
 * Gets the chest's open/closed state
 * @returns {boolean} Whether the chest is open
 */
export function getChestState() {
    try {
        return safeStorage.getItem(StorageKeys.CHEST_STATE) === 'true';
    } catch (error) {
        handleError(error);
        return false;
    }
}

/**
 * Sets the chest's open/closed state
 * @param {boolean} isOpen - Whether the chest is open
 */
export function setChestState(isOpen) {
    try {
        safeStorage.setItem(StorageKeys.CHEST_STATE, isOpen.toString());
    } catch (error) {
        handleError(error);
    }
}

/**
 * Gets the last shown message
 * @returns {string} Last shown message or empty string if none
 */
export function getLastMessage() {
    try {
        return safeStorage.getItem(StorageKeys.LAST_MESSAGE) || '';
    } catch (error) {
        handleError(error);
        return '';
    }
}

/**
 * Saves the last shown message
 * @param {string} message - Message to save
 */
export function setLastMessage(message) {
    try {
        if (typeof message !== 'string') {
            throw new StorageError('Message must be a string');
        }
        safeStorage.setItem(StorageKeys.LAST_MESSAGE, message);
    } catch (error) {
        handleError(error);
    }
}

/**
 * Clears all stored data
 * Useful for testing or resetting the application
 */
export function clearStorage() {
    try {
        Object.values(StorageKeys).forEach(key => {
            safeStorage.removeItem(key);
        });
    } catch (error) {
        handleError(error);
    }
}
