/**
 * data-loader.js
 * Centralized data access utility.
 * Uses window.MockData set by data/mock-data.js (loaded via <script> tag).
 * This avoids CORS issues with file:// protocol.
 */

window.AppData = window.MockData || null;

/**
 * Helper: run a callback with the loaded mock data.
 * data/mock-data.js must be loaded BEFORE this script.
 */
function onDataReady(callback) {
    if (!window.AppData && window.MockData) {
        window.AppData = window.MockData;
    }
    if (window.AppData) {
        callback(window.AppData);
    } else {
        console.error('[DataLoader] No mock data available. Ensure data/mock-data.js is loaded before data-loader.js.');
    }
}
