/**
 * account-explorer.js
 * Page-specific logic for the Account Explorer page.
 * Renders mini trend chart from mock data.
 */

document.addEventListener('DOMContentLoaded', function () {
    onDataReady(function (data) {
        try {
            renderMiniTrendChart('mini-trend-chart');
        } catch (err) {
            console.error('[AccountExplorer] Chart render error:', err);
        }
    });
});
