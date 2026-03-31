/**
 * executive-overview.js
 * Waterfall bar click → shows contributing accounts inline.
 * Clicking an account card navigates to Account Explorer with filter applied.
 * All three periods end at $428.5M (matching the KPI).
 */

let executiveOverviewData = null;
let activeExecutiveRange  = 'Q3 2026';

// ─── Period waterfall datasets (all resolve to $428.5M) ─────────────────────

const PERIOD_DATA = {
    'Q3 2026': {
        subtitle: 'Net change in revenue: Q2 → Q3 2026',
        waterfall: {
            measures: ['absolute',  'relative',       'relative', 'relative', 'relative',   'total'],
            labels:   ['Q2 2026',   'New Contracts',  'Upsells',  'Churn',    'Price Adj.', 'Q3 2026'],
            values:   [381.2,        42.5,              18.3,      -11.2,      -2.3,          428.5],
            texts:    ['$381.2M',   '+$42.5M',        '+$18.3M',  '-$11.2M', '-$2.3M',    '$428.5M'],
        },
        donut: {
            values: [50.1, 31.4, 12.0, 6.5],
            labels: ['Growth', 'Opportunity', 'At-Risk', 'Strategic'],
            colors: ['#FFB162', '#7FA3C0', '#A35139', '#4A6B8A'],
            totalAccounts: 283,
        },
    },
    'YTD': {
        subtitle: 'Year-to-date drivers: Q4 2025 baseline → Q3 2026 ($428.5M)',
        waterfall: {
            measures: ['absolute','relative','relative','relative','relative','relative','relative','relative','relative','relative','relative','relative','relative','total'],
            labels:   ["Q4'25 Base","Q1 New Accts","Q1 Upsells","Q1 Churn","Q1 Adj.","Q2 New Accts","Q2 Upsells","Q2 Churn","Q2 Adj.","Q3 New Accts","Q3 Upsells","Q3 Churn","Q3 Adj.","YTD Total"],
            values:   [340.4, 8.2, 10.5, -4.3, 0.6, 12.1, 8.7, -3.2, 8.2, 42.5, 18.3, -11.2, -2.3, 428.5],
            texts:    ['$340.4M','+$8.2M','+$10.5M','-$4.3M','+$0.6M','+$12.1M','+$8.7M','-$3.2M','+$8.2M','+$42.5M','+$18.3M','-$11.2M','-$2.3M','$428.5M'],
        },
        donut: {
            values: [47.2, 33.1, 13.5, 6.2],
            labels: ['Growth', 'Opportunity', 'At-Risk', 'Strategic'],
            colors: ['#FFB162', '#7FA3C0', '#A35139', '#4A6B8A'],
            totalAccounts: 291,
        },
    },
    '12M': {
        subtitle: 'Trailing 12-month drivers: Q3 2025 baseline → Q3 2026 ($428.5M)',
        waterfall: {
            measures: ['absolute','relative','relative','relative','relative','relative','relative','relative','relative','relative','relative','relative','relative','relative','relative','relative','relative','total'],
            labels:   ["Q3'25 Base","Q4'25 New","Q4'25 Upsells","Q4'25 Churn","Q4'25 Adj.","Q1'26 New","Q1'26 Upsells","Q1'26 Churn","Q1'26 Adj.","Q2'26 New","Q2'26 Upsells","Q2'26 Churn","Q2'26 Adj.","Q3'26 New","Q3'26 Upsells","Q3'26 Churn","Q3'26 Adj.","LTM Total"],
            values:   [312.0, 14.8, 8.1, -3.2, 8.7, 8.2, 10.5, -4.3, 0.6, 12.1, 8.7, -3.2, 8.2, 42.5, 18.3, -11.2, -2.3, 428.5],
            texts:    ['$312.0M','+$14.8M','+$8.1M','-$3.2M','+$8.7M','+$8.2M','+$10.5M','-$4.3M','+$0.6M','+$12.1M','+$8.7M','-$3.2M','+$8.2M','+$42.5M','+$18.3M','-$11.2M','-$2.3M','$428.5M'],
        },
        donut: {
            values: [45.8, 34.5, 12.8, 6.9],
            labels: ['Growth', 'Opportunity', 'At-Risk', 'Strategic'],
            colors: ['#FFB162', '#7FA3C0', '#A35139', '#4A6B8A'],
            totalAccounts: 298,
        },
    },
};

// ─── Per-driver-type account data ─────────────────────────────────────────────
// Matched by classifying bar labels (e.g. "Q1 Upsells" → type "upsell")

const DRIVER_ACCOUNTS = {
    new: {
        title: 'New Contract Accounts',
        explorerFilter: { score: 'Score: All', segment: 'All Segments' },
        accounts: [
            { id: 'ACC-1289', name: 'Mayo Clinic Group',     arr: '+$8.4M',  status: 'Strategic', statusClass: 'text-semantic-violet'  },
            { id: 'ACC-4412', name: "St. Jude's Medical",    arr: '+$6.2M',  status: 'Strategic', statusClass: 'text-semantic-violet'  },
            { id: 'ACC-7721', name: 'AmerisourceBergen',     arr: '+$12.1M', status: 'Growth',    statusClass: 'text-semantic-emerald' },
        ],
    },
    upsell: {
        title: 'Upsell Accounts',
        explorerFilter: { score: 'Growth (Emerald)', segment: 'All Segments' },
        accounts: [
            { id: 'ACC-9908', name: 'Kaiser Permanente',     arr: '+$4.5M', status: 'Growth',    statusClass: 'text-semantic-emerald' },
            { id: 'ACC-5544', name: 'Cardinal Health',       arr: '+$9.8M', status: 'Growth',    statusClass: 'text-semantic-emerald' },
            { id: 'ACC-2284', name: 'National MedSupply',    arr: '+$5.1M', status: 'Strategic', statusClass: 'text-semantic-violet'  },
        ],
    },
    churn: {
        title: 'At-Risk / Churned Accounts',
        explorerFilter: { score: 'At-Risk (Rose)', segment: 'All Segments' },
        accounts: [
            { id: 'ACC-7742', name: 'Pinnacle Health',       arr: '-$5.2M', status: 'At-Risk', statusClass: 'text-brand-critical' },
            { id: 'ACC-6654', name: 'Rite Aid Pharmacies',   arr: '-$3.1M', status: 'At-Risk', statusClass: 'text-brand-critical' },
            { id: 'ACC-8812', name: 'Sutter Health',         arr: '-$2.9M', status: 'At-Risk', statusClass: 'text-brand-critical' },
        ],
    },
    price: {
        title: 'Price Adjustment Accounts',
        explorerFilter: { score: 'Opportunity (Amber)', segment: 'All Segments' },
        accounts: [
            { id: 'ACC-3321', name: 'Blue Shield Partners',  arr: '-$1.5M', status: 'Opportunity', statusClass: 'text-semantic-amber' },
            { id: 'ACC-3390', name: 'Cleveland Clinic',      arr: '-$0.8M', status: 'Opportunity', statusClass: 'text-semantic-amber' },
        ],
    },
};

// ─── Classify a bar label into a driver type ──────────────────────────────────

function classifyBar(label) {
    const l = label.toLowerCase();
    if (l.includes('upsell'))                         return 'upsell';
    if (l.includes('new') || l.includes('contract'))  return 'new';
    if (l.includes('churn'))                          return 'churn';
    if (l.includes('adj') || l.includes('price'))     return 'price';
    return null; // absolute / total bars
}

// ─── Render the inline bar-detail panel ──────────────────────────────────────

function showBarDetailPanel(label, value) {
    const panel = document.getElementById('waterfall-bar-detail');
    if (!panel) return;

    const type = classifyBar(label);
    if (!type) {
        panel.classList.add('hidden');
        panel.innerHTML = '';
        return;
    }

    const d        = DRIVER_ACCOUNTS[type];
    const negative = value < 0;
    const valFmt   = `${negative ? '' : '+'}$${Math.abs(value).toFixed(1)}M`;
    const valClass = negative ? 'text-brand-critical' : 'text-semantic-emerald';

    // Build account card HTML
    const cards = d.accounts.map((acc, i) => `
        <button
            class="acc-card text-left bg-brand-cardBg rounded-lg border border-brand-border p-3
                   hover:border-brand-primary/60 hover:shadow-sm transition-all group"
            data-acc-id="${acc.id}"
            data-filter='${JSON.stringify(d.explorerFilter)}'>
            <div class="flex items-center justify-between mb-1">
                <span class="text-xs font-semibold text-brand-textPrimary
                             group-hover:text-brand-primary transition-colors truncate pr-2">${acc.name}</span>
                <span class="text-xs font-mono font-bold ${acc.statusClass} shrink-0">${acc.arr}</span>
            </div>
            <span class="text-xs text-brand-textSecondary">${acc.status}</span>
            <div class="mt-1.5 flex items-center gap-1 text-xs text-brand-primary
                        opacity-0 group-hover:opacity-100 transition-opacity">
                View in Explorer&nbsp;<i class="fa-solid fa-arrow-right text-[9px]"></i>
            </div>
        </button>
    `).join('');

    panel.innerHTML = `
        <div class="bg-brand-bg/70 px-5 py-4">
            <div class="flex items-center justify-between mb-3">
                <p class="text-xs font-bold text-brand-textSecondary uppercase tracking-wider flex items-center gap-2">
                    <i class="fa-solid fa-magnifying-glass text-brand-primary"></i>
                    <span class="text-brand-textPrimary">${label}</span>
                    &mdash; ${d.title}
                </p>
                <div class="flex items-center gap-3">
                    <span class="text-sm font-mono font-bold ${valClass}">${valFmt}</span>
                    <button id="btn-close-bar" class="text-brand-textSecondary hover:text-brand-textPrimary">
                        <i class="fa-solid fa-xmark text-xs"></i>
                    </button>
                </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                ${cards}
            </div>
            <button id="btn-view-all-bar"
                    data-filter='${JSON.stringify(d.explorerFilter)}'
                    class="text-xs font-medium text-brand-primary hover:underline flex items-center gap-1">
                View all ${d.title} in Account Explorer&nbsp;<i class="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
        </div>
    `;

    panel.classList.remove('hidden');

    // Close button
    document.getElementById('btn-close-bar')?.addEventListener('click', () => {
        panel.classList.add('hidden');
        panel.innerHTML = '';
    });

    // Account cards → navigate with filter + selected account
    panel.querySelectorAll('.acc-card').forEach(card => {
        card.addEventListener('click', () => {
            const accountId = card.dataset.accId;
            const filter    = JSON.parse(card.dataset.filter);
            localStorage.setItem('selectedAccountId', accountId);
            localStorage.setItem('explorerFilter',    JSON.stringify(filter));
            window.location.href = '2-BI Platform - Account Explorer.html';
        });
    });

    // "View all" button → navigate with filter only
    document.getElementById('btn-view-all-bar')?.addEventListener('click', () => {
        const filter = JSON.parse(document.getElementById('btn-view-all-bar').dataset.filter);
        localStorage.setItem('explorerFilter', JSON.stringify(filter));
        window.location.href = '2-BI Platform - Account Explorer.html';
    });
}

// ─── Attach Plotly click listener (call once after first render) ──────────────

function attachWaterfallClickHandler() {
    const el = document.getElementById('waterfall-chart');
    if (!el || !el.on) return;
    el.on('plotly_click', (eventData) => {
        if (!eventData?.points?.length) return;
        const pt = eventData.points[0];
        showBarDetailPanel(pt.x, pt.y);
    });
}

// ─── Main chart refresh ───────────────────────────────────────────────────────

function updateExecutiveCharts(range) {
    const period = PERIOD_DATA[range];
    if (!period) return;

    // Reset dynamic panel
    const panel = document.getElementById('waterfall-bar-detail');
    if (panel) { panel.classList.add('hidden'); panel.innerHTML = ''; }

    setEl('waterfall-subtitle', period.subtitle);

    // Waterfall – no jitter; exact numbers required
    renderWaterfallChart('waterfall-chart', period.waterfall);

    // Re-attach after each newPlot (Plotly.newPlot purges element listeners)
    attachWaterfallClickHandler();

    // Donut – mild jitter
    const dn = period.donut;
    renderDonutChart('donut-chart', {
        ...dn,
        values: dn.values.map(v => Math.max(1, Math.round(v * (0.93 + Math.random() * 0.14)))),
    });
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function setEl(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function setActiveRangeButton(range) {
    const map = { 'Q3 2026': 'range-q3', 'YTD': 'range-ytd', '12M': 'range-12m' };
    Object.entries(map).forEach(([key, btnId]) => {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        const active = key === range;
        btn.classList.toggle('bg-brand-primary/20',          active);
        btn.classList.toggle('text-brand-textPrimary',       active);
        btn.classList.toggle('text-brand-textSecondary',    !active);
        btn.classList.toggle('hover:text-brand-textPrimary', !active);
    });
}

function getExecutiveFilterState() {
    return {
        region:  document.getElementById('exec-filter-region')?.value  || 'All Regions',
        segment: document.getElementById('exec-filter-segment')?.value || 'All Segments',
        metric:  document.getElementById('exec-filter-metric')?.value  || 'All Metrics',
    };
}

function applyExecutiveAIInsights(data) {
    const insights = data.executiveOverview.insights || [];
    insights.slice(0, 3).forEach((insight, idx) => {
        const el = document.getElementById(`exec-ai-text-${idx + 1}`);
        if (el) el.textContent = insight.body || generateLocalInsight({ page: 'executiveOverview', note: insight.title });
    });
}

function attachNavigationButtons() {
    document.querySelectorAll('button[data-navigate-target]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.navigateTarget;
            if (target) window.location.href = target;
        });
    });
}

function attachExecutivePageEvents() {
    [
        { id: 'range-q3',  range: 'Q3 2026' },
        { id: 'range-ytd', range: 'YTD' },
        { id: 'range-12m', range: '12M' },
    ].forEach(({ id, range }) => {
        document.getElementById(id)?.addEventListener('click', () => {
            activeExecutiveRange = range;
            setActiveRangeButton(range);
            updateExecutiveCharts(range);
        });
    });

    document.getElementById('btn-toggle-filters')?.addEventListener('click', function () {
        const panel = document.getElementById('executive-filter-panel');
        if (!panel) return;
        const hidden = panel.classList.toggle('hidden');
        this.innerHTML = hidden
            ? '<i class="fa-solid fa-filter text-brand-textSecondary"></i> Filters'
            : '<i class="fa-solid fa-filter text-brand-textSecondary"></i> Hide Filters';
    });

    document.getElementById('btn-export-report')?.addEventListener('click', () => {
        alert('Exporting executive summary report…');
    });

    ['exec-filter-region', 'exec-filter-segment', 'exec-filter-metric'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => updateExecutiveCharts(activeExecutiveRange));
    });

    document.getElementById('btn-toggle-ai')?.addEventListener('click', function () {
        const cards = document.getElementById('exec-ai-cards');
        if (!cards) return;
        const hidden = cards.classList.toggle('hidden');
        const icon = this.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-chevron-up',  !hidden);
            icon.classList.toggle('fa-chevron-down', hidden);
        }
    });

    attachNavigationButtons();
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
    onDataReady(function (data) {
        executiveOverviewData = data.executiveOverview;
        try {
            setActiveRangeButton(activeExecutiveRange);
            updateExecutiveCharts(activeExecutiveRange);
            applyExecutiveAIInsights(data);
            attachExecutivePageEvents();
        } catch (err) {
            console.error('[ExecOverview] Init error:', err);
        }
    });
});
