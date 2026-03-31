/**
 * executive-overview.js
 * Page-specific logic for the Executive Overview page.
 * Populates KPIs, charts and tables from AppData.
 */

document.addEventListener('DOMContentLoaded', function () {
    onDataReady(function (data) {
        const d = data.executiveOverview;
        try {
            renderWaterfallChart('waterfall-chart', d.waterfall);
            renderDonutChart('donut-chart', d.donut);
        } catch (err) {
            console.error('[ExecOverview] Chart render error:', err);
        }
    });
});
