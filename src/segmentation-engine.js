/**
 * segmentation-engine.js
 * Charts update ONLY when "Apply Weights" is clicked.
 * Draft buttons (Draft 1-3) restore previous slider + metric states.
 */

/* ─── State ─────────────────────────────────────────────────── */
var segmentationEngineData = null;
var drafts = [];          // [{weights, metrics}, …]  max 3
var activeDraftIndex = -1; // -1 = "Current" is active

/* ─── Helpers ────────────────────────────────────────────────── */
function getEl(id) { return document.getElementById(id); }

function readSliders() {
    return {
        rev:      +getEl('rev-slider').value,
        growth:   +getEl('growth-slider').value,
        loyalty:  +getEl('loyalty-slider').value,
        affinity: +getEl('affinity-slider').value,
        k:        +getEl('k-cluster-slider').value
    };
}

function pushSliders(w) {
    getEl('rev-slider').value      = w.rev;
    getEl('growth-slider').value   = w.growth;
    getEl('loyalty-slider').value  = w.loyalty;
    getEl('affinity-slider').value = w.affinity;
    getEl('k-cluster-slider').value = w.k;
}

function refreshLabels() {
    var w = readSliders();
    var total = w.rev + w.growth + w.loyalty + w.affinity;

    getEl('rev-val').textContent     = w.rev      + '%';
    getEl('growth-val').textContent  = w.growth   + '%';
    getEl('loyalty-val').textContent = w.loyalty  + '%';
    getEl('affinity-val').textContent= w.affinity + '%';
    getEl('k-val').textContent       = w.k;
    getEl('total-weight').textContent = total + '%';
    getEl('total-weight').style.color = (total === 100) ? '#10b981' : '#A35139';

    getEl('bar-rev').style.width      = w.rev      + '%';
    getEl('bar-growth').style.width   = w.growth   + '%';
    getEl('bar-loyalty').style.width  = w.loyalty  + '%';
    getEl('bar-affinity').style.width = w.affinity + '%';
}

/* ─── Metrics ────────────────────────────────────────────────── */
function computeMetrics(weights) {
    var total  = weights.rev + weights.growth + weights.loyalty + weights.affinity;
    var factor = (total === 100) ? 1.0 : 0.93;
    return {
        accuracy:  (86 + Math.random() * 8  * factor).toFixed(1) + '%',
        roc:       (0.90 + Math.random() * 0.06 * factor).toFixed(2),
        precision: (0.82 + Math.random() * 0.10 * factor).toFixed(2),
        recall:    (0.84 + Math.random() * 0.10 * factor).toFixed(2)
    };
}

function showMetrics(m) {
    getEl('metric-accuracy').textContent  = m.accuracy;
    getEl('metric-roc').textContent       = m.roc;
    getEl('metric-precision').textContent = m.precision;
    getEl('metric-recall').textContent    = m.recall;
}

function readMetrics() {
    return {
        accuracy:  getEl('metric-accuracy').textContent,
        roc:       getEl('metric-roc').textContent,
        precision: getEl('metric-precision').textContent,
        recall:    getEl('metric-recall').textContent
    };
}

/* ─── Draft management ───────────────────────────────────────── */
function saveDraft() {
    var snapshot = {
        weights: readSliders(),
        metrics: readMetrics()
    };
    // prepend newest; keep max 3
    drafts.unshift(snapshot);
    if (drafts.length > 3) drafts.pop();
}

// Called by inline onclick in dynamically generated buttons
window.loadDraft = function(index) {
    var draft = drafts[index];
    if (!draft) return;

    activeDraftIndex = index;

    // Restore sliders + labels
    pushSliders(draft.weights);
    refreshLabels();

    // Restore metrics display
    showMetrics(draft.metrics);

    // Redraw charts with the restored weights
    drawCharts(draft.weights);

    // Highlight correct tab
    renderDraftsUI();
    setCurrentButtonHighlight(false);
};

function renderDraftsUI() {
    var container = getEl('saved-drafts');
    if (!container) return;

    container.innerHTML = drafts.map(function(draft, i) {
        var isActive = (activeDraftIndex === i);
        var style = isActive
            ? 'background:#FFB16230;color:#1B2632;font-weight:600;'
            : 'color:#4A6B8A;';
        return '<button onclick="loadDraft(' + i + ')" type="button" '
            + 'style="' + style + 'padding:4px 10px;font-size:11px;border-radius:6px;border:none;cursor:pointer;transition:opacity .15s;" '
            + 'onmouseover="this.style.opacity=\'0.7\'" onmouseout="this.style.opacity=\'1\'">'
            + 'Draft ' + (i + 1)
            + '</button>';
    }).join('');
}

function setCurrentButtonHighlight(isActive) {
    var btn = getEl('btn-current-model');
    if (!btn) return;
    if (isActive) {
        btn.style.cssText = 'background:#FFB16230;color:#1B2632;font-weight:600;padding:4px 10px;font-size:11px;border-radius:6px;border:none;cursor:pointer;';
    } else {
        btn.style.cssText = 'color:#4A6B8A;padding:4px 10px;font-size:11px;border-radius:6px;border:none;cursor:pointer;background:transparent;';
    }
}

/* ─── Chart drawing ──────────────────────────────────────────── */
function getSegmentsByAccountType(type) {
    if (!segmentationEngineData) return [];
    var all = segmentationEngineData.bubbleChart.segments;
    if (type === 'Hospitals')       return all.filter(function(s){ return ['Growth','Strategic'].includes(s.name); });
    if (type === 'Pharmacy Chains') return all.filter(function(s){ return ['Opportunity','Growth'].includes(s.name); });
    if (type === 'Distributors')    return all.filter(function(s){ return ['Strategic','Opportunity'].includes(s.name); });
    return all;
}

function drawCharts(weights) {
    if (!segmentationEngineData) return;

    var type     = (getEl('filter-account-type') || {}).value || 'All Account Types';
    var segments = getSegmentsByAccountType(type);

    // Weight-driven scale factor
    var total = (weights.rev + weights.growth + weights.loyalty + weights.affinity);
    var scale = Math.max(0.5, total / 100);

    // Build jittered bubble data
    var bubbleSeries = segments.map(function(seg) {
        var count = Math.round(seg.count * scale * (0.85 + Math.random() * 0.30));
        count = Math.max(5, count);

        var xArr = [], yArr = [], sArr = [];
        for (var i = 0; i < count; i++) {
            xArr.push(seg.xRange[0] + Math.random() * (seg.xRange[1] - seg.xRange[0]));
            yArr.push(seg.yRange[0] + Math.random() * (seg.yRange[1] - seg.yRange[0]));
            sArr.push((seg.sizeRange[0] + Math.random() * (seg.sizeRange[1] - seg.sizeRange[0])) * scale);
        }

        return {
            x: xArr, y: yArr,
            mode: 'markers',
            name: seg.name,
            marker: {
                color: seg.color,
                size:  sArr,
                sizemode: 'area',
                sizeref: 2,
                line: { color: '#F7F4EF', width: 1 },
                opacity: 0.82
            },
            text: xArr.map(function(_, i){
                return 'Account ' + (i+1) + '<br>ARR: $' + (1 + Math.random()*5).toFixed(1) + 'M';
            }),
            hoverinfo: 'text'
        };
    });

    var bubbleLayout = {
        font: { family:'Inter,sans-serif', color:'#4A6B8A' },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor:  'rgba(0,0,0,0)',
        margin: { t:20, r:20, b:40, l:60 },
        xaxis: { title:'Account Value Score', range:[0,100], gridcolor:'#D8D0C4', zerolinecolor:'#C9C1B1' },
        yaxis: { title:'Churn Risk Score',    range:[0,100], gridcolor:'#D8D0C4', zerolinecolor:'#C9C1B1' },
        showlegend: true,
        legend: { orientation:'h', y:-0.18, x:0.5, xanchor:'center' },
        shapes: [
            { type:'line', x0:50, y0:0,   x1:50,  y1:100, line:{ color:'#C9C1B1', width:2, dash:'dash' } },
            { type:'line', x0:0,  y0:50,  x1:100, y1:50,  line:{ color:'#C9C1B1', width:2, dash:'dash' } }
        ],
        annotations: [
            { x:25, y:95, text:'High Risk / Low Value',  showarrow:false, font:{ color:'#4A6B8A', size:10 } },
            { x:75, y:95, text:'High Risk / High Value', showarrow:false, font:{ color:'#4A6B8A', size:10 } },
            { x:25, y:5,  text:'Low Risk / Low Value',   showarrow:false, font:{ color:'#4A6B8A', size:10 } },
            { x:75, y:5,  text:'Low Risk / High Value',  showarrow:false, font:{ color:'#4A6B8A', size:10 } }
        ]
    };

    Plotly.react('bubble-chart', bubbleSeries, bubbleLayout, { responsive:true, displayModeBar:false });

    // Jittered Sankey
    var sd = JSON.parse(JSON.stringify(segmentationEngineData.sankeyChart));
    sd.links.value = sd.links.value.map(function(v) {
        return Math.max(1, Math.round(v * scale * (0.75 + Math.random() * 0.50)));
    });
    renderSankeyChart('sankey-chart', sd);
}

/* ─── Init ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
    onDataReady(function(data) {
        segmentationEngineData = data.segmentationEngine;
        if (!segmentationEngineData) {
            console.error('[SegEngine] No segmentationEngine data found.');
            return;
        }

        try {
            // Populate account type filter
            var select = getEl('filter-account-type');
            if (select) {
                var opts = (segmentationEngineData.filterOptions || {}).accountTypes ||
                           ['All Account Types','Hospitals','Pharmacy Chains','Distributors'];
                select.innerHTML = opts.map(function(o){ return '<option>' + o + '</option>'; }).join('');
                select.addEventListener('change', function() {
                    // Redraw with current slider state without saving a new draft
                    drawCharts(readSliders());
                });
            }

            // Set initial slider values
            var w = segmentationEngineData.weights;
            getEl('rev-slider').value      = w.revenue.value;
            getEl('growth-slider').value   = w.growth.value;
            getEl('loyalty-slider').value  = w.loyalty.value;
            getEl('affinity-slider').value = w.affinity.value;
            refreshLabels();

            // Create a baseline "Draft 1" so there's always something to show
            var baseMetrics = { accuracy:'88.4%', roc:'0.92', precision:'0.85', recall:'0.89' };
            showMetrics(baseMetrics);
            drafts = [{ weights: readSliders(), metrics: baseMetrics }];
            activeDraftIndex = -1;
            renderDraftsUI();

            // Initial chart draw
            drawCharts(readSliders());

            // ── Wire up sliders (labels + bars only, NO chart redraw) ──
            var sliderIds = ['rev-slider','growth-slider','loyalty-slider','affinity-slider',
                             'k-cluster-slider','lookback-slider','iv-slider'];
            sliderIds.forEach(function(id) {
                var el = getEl(id);
                if (!el) return;
                el.addEventListener('input', function() {
                    // Special label updates
                    if (id === 'k-cluster-slider')
                        getEl('k-val').textContent = el.value;
                    if (id === 'lookback-slider')
                        getEl('lookback-val').textContent = el.value + ' mo';
                    if (id === 'iv-slider')
                        getEl('iv-val').textContent = '> 0.' + String(el.value).padStart(2,'0');

                    refreshLabels(); // Only updates numbers/bars, NOT charts
                });
            });

            // ── Apply Weights button ──────────────────────────────────
            var applyBtn = getEl('btn-apply-weights');
            if (applyBtn) {
                applyBtn.addEventListener('click', function() {
                    var weights = readSliders();
                    var metrics = computeMetrics(weights);

                    // Update metric cards
                    showMetrics(metrics);

                    // Redraw charts
                    drawCharts(weights);

                    // Save as new draft
                    saveDraft();
                    activeDraftIndex = 0; // newest draft
                    renderDraftsUI();
                    setCurrentButtonHighlight(false);

                    // Brief visual pulse on button
                    applyBtn.style.background = '#10b981';
                    setTimeout(function(){ applyBtn.style.background = ''; }, 600);
                });
            }

            // ── Current Model button ──────────────────────────────────
            var currentBtn = getEl('btn-current-model');
            if (currentBtn) {
                currentBtn.addEventListener('click', function() {
                    activeDraftIndex = -1;
                    setCurrentButtonHighlight(true);
                    renderDraftsUI();

                    // Reset to initial weights
                    var ww = segmentationEngineData.weights;
                    pushSliders({ rev: ww.revenue.value, growth: ww.growth.value,
                                  loyalty: ww.loyalty.value, affinity: ww.affinity.value, k: 4 });
                    refreshLabels();
                    showMetrics(baseMetrics);
                    drawCharts(readSliders());
                });

                // Highlight "Current" on startup
                setCurrentButtonHighlight(true);
            }

            // ── Reset button ──────────────────────────────────────────
            var resetBtn = getEl('btn-reset-model');
            if (resetBtn) {
                resetBtn.addEventListener('click', function() {
                    var ww = segmentationEngineData.weights;
                    pushSliders({ rev: ww.revenue.value, growth: ww.growth.value,
                                  loyalty: ww.loyalty.value, affinity: ww.affinity.value, k: 4 });
                    getEl('lookback-slider').value = 6;
                    getEl('iv-slider').value = 10;
                    getEl('lookback-val').textContent = '6 mo';
                    getEl('iv-val').textContent = '> 0.10';
                    refreshLabels();
                });
            }

            // ── Save Segment button ───────────────────────────────────
            var saveBtn = getEl('btn-save-segment');
            if (saveBtn) {
                saveBtn.addEventListener('click', function() {
                    saveDraft();
                    activeDraftIndex = 0;
                    renderDraftsUI();
                    setCurrentButtonHighlight(false);
                    alert('Saved to Draft ' + drafts.length + '.');
                });
            }

        } catch(err) {
            console.error('[SegEngine] Init error:', err);
        }
    });
});
