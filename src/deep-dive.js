/**
 * deep-dive.js
 * Page-specific logic for the Account Deep-Dive page.
 * Renders the radar chart, populates account data, and handles simulator impact.
 */

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function updateSimulatorImpact() {
    const vol = parseFloat(document.getElementById('vol-slider').value);
    const disc = parseFloat(document.getElementById('disc-slider').value);
    const cogs = parseFloat(document.getElementById('cogs-slider').value);

    // Simple business logic for simulator
    // Baseline: $1.2M revenue at 10,000 units, 12% disc, 2% cogs = 42.5% margin
    const baseRevenue = 1200000;
    const baseUnits = 10000;
    const basePrice = (baseRevenue / (1 - 0.12)) / baseUnits; // Theoretical list price per unit
    
    // Revenue = Units * Price * (1 - Discount)
    const projectedRevenue = vol * basePrice * (1 - disc / 100);
    
    // Margin = Revenue - COGS
    // Assume base COGS is $80 per unit, affected by adjustment
    const baseUnitCogs = 80;
    const projectedUnitCogs = baseUnitCogs * (1 + cogs / 100);
    const totalCogs = vol * projectedUnitCogs;
    const projectedMarginVal = projectedRevenue - totalCogs;
    const projectedMarginPct = (projectedMarginVal / projectedRevenue) * 100;

    // Update UI
    setText('proj-rev', `$${(projectedRevenue / 1000000).toFixed(2)}M`);
    const revChange = ((projectedRevenue / baseRevenue - 1) * 100).toFixed(1);
    const revChangeEl = document.getElementById('proj-rev-change');
    if (revChangeEl) {
        revChangeEl.textContent = `${revChange > 0 ? '+' : ''}${revChange}% vs Current`;
        revChangeEl.className = `text-xs mt-1 ${revChange >= 0 ? 'text-emerald-500' : 'text-brand-critical'}`;
    }

    setText('proj-margin', `${projectedMarginPct.toFixed(1)}%`);
    const marginBar = document.getElementById('proj-margin-bar');
    if (marginBar) marginBar.style.width = `${Math.min(Math.max(projectedMarginPct, 0), 100)}%`;

    const marginDiff = (projectedMarginPct - 45).toFixed(1); // Target 45%
    const marginChangeEl = document.getElementById('proj-margin-change');
    if (marginChangeEl) {
        marginChangeEl.textContent = `${marginDiff > 0 ? '+' : ''}${marginDiff}% vs Target`;
        marginChangeEl.className = `text-xs mt-1 ${marginDiff >= 0 ? 'text-emerald-500' : 'text-brand-critical'}`;
    }
}

async function applyDeepDiveAIInsight(account) {
    const target = document.getElementById('deep-ai-text');
    if (!target) return;
    
    const context = {
        page: 'deepDive',
        account: account
    };
    const insight = await generateAIInsight(context);
    target.textContent = insight;
}

function initDeepDivePage(data) {
    const selectedId = localStorage.getItem('selectedAccountId') || 'ACC-8921';
    const account = data.accountExplorer.accounts.find(a => a.id === selectedId) || data.accountExplorer.accounts[0];

    if (!account) return;

    console.log('[DeepDive] Syncing for:', account.name);

    // Sync Breadcrumb and Header
    const breadcrumb = document.querySelector('.breadcrumb .font-medium') || document.querySelector('.text-brand-textPrimary.font-medium');
    if (breadcrumb) breadcrumb.textContent = account.name;
    
    setText('details-name', account.name);
    setText('details-subtitle', `ID: ${account.id} • ${account.segment} • ${account.region}`);
    setText('details-initials', account.initials);

    const header = document.getElementById('account-header');
    if (header) {
        const titleH1 = header.querySelector('h1');
        if (titleH1) titleH1.textContent = account.name;
        
        const subtitleP = header.querySelector('p.text-brand-textSecondary');
        if (subtitleP) subtitleP.textContent = `ID: ${account.id} • ${account.segment} • ${account.region}`;
        
        const avatar = header.querySelector('.rounded-xl');
        if (avatar) avatar.textContent = account.initials;
    }

    // Sync Stats
    const statsContainer = document.querySelector('.lg-grid-cols-6') || document.querySelector('.grid.grid-cols-2.sm\\:grid-cols-3.lg\\:grid-cols-6');
    if (statsContainer) {
        const arrVal = statsContainer.querySelectorAll('p.text-lg.font-bold')[0];
        if (arrVal) arrVal.textContent = account.arr;

        const healthVal = statsContainer.querySelectorAll('p.text-lg.font-bold')[1];
        if (healthVal) {
            healthVal.innerHTML = `${account.statusScore}<span class="text-sm text-brand-textSecondary font-normal">/100</span>`;
        }
    }

    // Randomize Radar Chart Measures per request
    const randomizedRadar = {
        labels: ["Loyalty", "Growth", "Revenue", "Digital", "Margin"],
        values: [
            Math.floor(Math.random() * 40) + 60,
            Math.floor(Math.random() * 40) + 60,
            Math.floor(Math.random() * 40) + 60,
            Math.floor(Math.random() * 40) + 30,
            Math.floor(Math.random() * 30) + 70
        ]
    };
    renderRadarChart('radar-chart', randomizedRadar);

    // AI Insight
    applyDeepDiveAIInsight(account);

    // Simulator Listeners
    ['vol-slider', 'disc-slider', 'cogs-slider'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateSimulatorImpact);
    });

    // Initial calculation
    updateSimulatorImpact();

    // === DEEP-DIVE EXPORT MODAL ===
    const ddModal = document.getElementById('dd-export-modal');

    const closeDDModal = () => {
        ddModal.classList.remove('opacity-100');
        ddModal.classList.add('opacity-0');
        setTimeout(() => ddModal.classList.add('hidden'), 300);
    };

    document.getElementById('btn-export-deep-dive')?.addEventListener('click', () => {
        // 1. Header
        const acctName = document.querySelector('#account-header h1')?.textContent || 'Account';
        document.getElementById('dd-export-acct-name').textContent = acctName;
        const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        document.getElementById('dd-export-date').textContent = 'GENERATED ' + today.toUpperCase();

        // 2. KPI summary – scrape live values from the account header stats
        const statVals = document.querySelectorAll('#account-header .text-lg.font-bold');
        if (statVals.length >= 2) {
            document.getElementById('dd-export-arr').textContent = statVals[0]?.textContent || '$0';
            document.getElementById('dd-export-health').textContent = (statVals[1]?.textContent || '0') + '/100';
        }

        // Segment
        const segmentBadge = document.querySelector('#account-header .rounded-full');
        document.getElementById('dd-export-segment').textContent = segmentBadge?.textContent?.trim() || 'Growth';

        // 3. Capture Radar Chart
        const radarEl = document.getElementById('radar-chart');
        if (radarEl && typeof Plotly !== 'undefined') {
            Plotly.toImage(radarEl, { format: 'png', width: 500, height: 340 })
                .then(url => {
                    const img = document.getElementById('dd-export-radar-img');
                    if (img) img.src = url;
                })
                .catch(err => console.warn('[DD Export] Radar capture failed:', err));
        }

        // 4. LIME features – scrape from the page
        const limeContainer = document.getElementById('dd-export-lime');
        if (limeContainer) {
            const limeRows = document.querySelectorAll('#lime-explainability .flex.items-center.gap-3');
            let limeHTML = '';
            limeRows.forEach(row => {
                const label = row.querySelector('.w-28')?.textContent?.trim();
                const value = row.querySelector('.font-mono')?.textContent?.trim();
                if (label && value) {
                    const isPositive = value.startsWith('+');
                    limeHTML += `<div class="flex justify-between items-center py-1 border-b border-gray-100">
                        <span class="text-gray-700">${label}</span>
                        <span class="font-mono font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}">${value}</span>
                    </div>`;
                }
            });
            limeContainer.innerHTML = limeHTML || '<p class="text-gray-400 text-xs">No LIME data available.</p>';
        }

        // 5. Margin simulator snapshot
        document.getElementById('dd-export-proj-rev').textContent = document.getElementById('proj-rev')?.textContent || '$0';
        document.getElementById('dd-export-proj-margin').textContent = document.getElementById('proj-margin')?.textContent || '0%';

        // 6. AI Insight
        document.getElementById('dd-export-ai').textContent = document.getElementById('deep-ai-text')?.textContent || 'No AI insight available.';

        // 7. Next Best Action
        const nbaEl = document.querySelector('#ai-insight .bg-brand-bg .text-sm.text-brand-textPrimary.font-medium');
        document.getElementById('dd-export-nba').textContent = nbaEl?.textContent || 'No recommendation available.';

        // 8. Show modal
        ddModal.classList.remove('hidden');
        void ddModal.offsetWidth;
        ddModal.classList.remove('opacity-0');
        ddModal.classList.add('opacity-100');
    });

    document.getElementById('btn-close-dd-export')?.addEventListener('click', closeDDModal);
    document.getElementById('dd-export-backdrop')?.addEventListener('click', closeDDModal);

    // PDF / Print
    document.getElementById('btn-dd-print-pdf')?.addEventListener('click', () => {
        const printContent = document.getElementById('dd-print-paper').outerHTML;
        const originalBody = document.body.innerHTML;
        document.body.innerHTML = `<div style="max-width: 800px; margin: 0 auto; padding: 20px;">${printContent}</div>`;
        window.print();
        document.body.innerHTML = originalBody;
        window.location.reload();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    onDataReady(function (data) {
        try {
            initDeepDivePage(data);
        } catch (err) {
            console.error('[DeepDive] Initialization error:', err);
        }
    });
});

