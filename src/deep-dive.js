/**
 * deep-dive.js
 * Page-specific logic for the Account Deep-Dive page.
 * Renders the radar chart from mock data.
 */

document.addEventListener('DOMContentLoaded', function () {
    onDataReady(function (data) {
        const d = data.deepDive;
        try {
            renderRadarChart('radar-chart', d.radarChart);
        } catch (err) {
            console.error('[DeepDive] Chart render error:', err);
        }
    });
});
