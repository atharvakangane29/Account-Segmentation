/**
 * segmentation-engine.js
 * Page-specific logic for the Segmentation Engine page.
 * Handles weight sliders, weight bar visualization, and chart rendering.
 */

function updateWeights() {
    const r = +document.getElementById('rev-slider').value;
    const g = +document.getElementById('growth-slider').value;
    const l = +document.getElementById('loyalty-slider').value;
    const a = +document.getElementById('affinity-slider').value;
    const total = r + g + l + a;

    document.getElementById('rev-val').textContent = r + '%';
    document.getElementById('growth-val').textContent = g + '%';
    document.getElementById('loyalty-val').textContent = l + '%';
    document.getElementById('affinity-val').textContent = a + '%';
    document.getElementById('total-weight').textContent = total + '%';
    document.getElementById('total-weight').style.color = total === 100 ? '#10b981' : '#A35139';

    document.getElementById('bar-rev').style.width = r + '%';
    document.getElementById('bar-growth').style.width = g + '%';
    document.getElementById('bar-loyalty').style.width = l + '%';
    document.getElementById('bar-affinity').style.width = a + '%';
}

document.addEventListener('DOMContentLoaded', function () {
    onDataReady(function (data) {
        const d = data.segmentationEngine;
        try {
            // Set initial slider values from data
            const w = d.weights;
            document.getElementById('rev-slider').value = w.revenue.value;
            document.getElementById('growth-slider').value = w.growth.value;
            document.getElementById('loyalty-slider').value = w.loyalty.value;
            document.getElementById('affinity-slider').value = w.affinity.value;
            updateWeights();

            // Render charts
            renderBubbleChart('bubble-chart', d.bubbleChart.segments);
            renderSankeyChart('sankey-chart', d.sankeyChart);
        } catch (err) {
            console.error('[SegEngine] Error:', err);
        }
    });
});
