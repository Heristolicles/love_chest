// This file handles the storage of the last opened date and the messages, possibly using local storage to track daily openings.

const STORAGE_KEY = 'dailyLoveChest';
const LAST_OPENED_KEY = 'lastOpened';

function getMessages() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveMessages(messages) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function getLastOpenedDate() {
    return localStorage.getItem(LAST_OPENED_KEY);
}

function setLastOpenedDate(date) {
    localStorage.setItem(LAST_OPENED_KEY, date);
}

// Check if the chest can be opened today
function canOpenChest() {
    const lastOpened = localStorage.getItem('lastOpenedDate');
    
    if (!lastOpened) {
        return true;
    }
    
    const today = new Date().toDateString();
    return today !== lastOpened;
}

// Save the date when the chest was last opened
function setLastOpenedDate(date) {
    localStorage.setItem('lastOpenedDate', date);
}

// Get the index of the last shown message
function getLastMessageIndex() {
    const index = localStorage.getItem('lastMessageIndex');
    return index ? parseInt(index) : -1;
}

// Save the index of the last shown message
function setLastMessageIndex(index) {
    localStorage.setItem('lastMessageIndex', index);
}

// Get the last message that was shown
function getLastMessage() {
    return localStorage.getItem('lastShownMessage') || "";
}

// Save the last message that was shown
function setLastMessage(message) {
    localStorage.setItem('lastShownMessage', message);
}
