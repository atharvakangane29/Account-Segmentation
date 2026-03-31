/**
 * account-explorer.js
 * Page-specific logic for the Account Explorer page.
 * Adds filter wiring, drawer updates, KPI consistency, AI insight generation,
 * and robust pagination (5 per page).
 */

let currentPage = 1;
const pageSize = 5;
let filteredAccounts = [];

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function populateSelectOptions(selectId, options) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = options.map((option) => `<option>${option}</option>`).join('');
}

function getFilterState() {
    return {
        segment: document.getElementById('filter-segment')?.value || 'All Segments',
        score: document.getElementById('filter-score')?.value || 'Score: All',
        owner: document.getElementById('filter-owner')?.value || 'Owner: All',
        region: document.getElementById('filter-region')?.value || 'Region: All'
    };
}

function normalizeFilterValue(value) {
    return String(value || '').trim().toLowerCase();
}

function updatePaginationUI() {
    const total = filteredAccounts.length;
    const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, total);
    
    const statusEl = document.getElementById('pagination-status');
    if (statusEl) {
        statusEl.innerHTML = `Showing <span class="font-medium text-brand-textPrimary">${start}</span> to <span class="font-medium text-brand-textPrimary">${end}</span> of <span class="font-medium text-brand-textPrimary">${total}</span> results`;
    }

    const prevBtn = document.getElementById('btn-prev-page');
    const nextBtn = document.getElementById('btn-next-page');

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = end >= total;
}

function renderAccountRows() {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageAccounts = filteredAccounts.slice(start, end);

    tbody.innerHTML = pageAccounts.map(account => {
        const statusColor = getStatusColor(account.status);
        const isSelected = currentAccount && currentAccount.id === account.id;
        const rowClass = isSelected 
            ? 'bg-brand-primary/10 border-l-brand-primary' 
            : 'hover:bg-brand-primary/5 border-l-transparent';
        const iconClass = isSelected ? 'fa-chevron-down' : 'fa-chevron-right';

        return `
            <tr data-account-id="${account.id}" class="${rowClass} transition-colors cursor-pointer border-l-4">
                <td class="px-4 py-4 text-center text-brand-textSecondary group-hover:text-brand-primary transition-colors">
                    <button class="chevron-btn"><i class="fa-solid ${iconClass} text-xs"></i></button>
                </td>
                <td class="px-4 py-4">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded bg-brand-dark text-white flex items-center justify-center font-bold text-xs">${account.initials}</div>
                        <div>
                            <p class="font-medium text-brand-textPrimary account-name">${account.name}</p>
                            <p class="text-xs text-brand-textSecondary account-id">ID: ${account.id}</p>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-4 text-brand-textSecondary">${account.segment}</td>
                <td class="px-4 py-4">
                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${statusColor}/10 text-${statusColor} border border-${statusColor}/20">
                        <span class="w-1.5 h-1.5 rounded-full bg-${statusColor}"></span> ${account.status}
                    </span>
                </td>
                <td class="px-4 py-4 font-medium text-brand-textPrimary">${account.arr}</td>
                <td class="px-4 py-4 text-brand-textSecondary">${account.owner}</td>
                <td class="px-4 py-4 text-brand-textSecondary text-xs">${account.lastActivity}</td>
                <td class="px-4 py-4 text-right">
                    <button class="text-brand-textSecondary hover:text-brand-primary p-1"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                </td>
            </tr>
        `;
    }).join('');

    mountAccountRowHandlers();
    updatePaginationUI();
}

function getStatusColor(status) {
    const s = status.toLowerCase();
    if (s.includes('growth')) return 'semantic-emerald';
    if (s.includes('opportunity')) return 'semantic-amber';
    if (s.includes('at-risk')) return 'brand-critical';
    if (s.includes('strategic')) return 'semantic-violet';
    return 'brand-textSecondary';
}

function filterAccountTableRows(allAccounts) {
    const filters = getFilterState();
    const segmentFilter = filters.segment;
    const scoreFilter = filters.score;
    const ownerFilter = filters.owner;
    const regionFilter = filters.region;

    filteredAccounts = allAccounts.filter((account) => {
        const normalizedSegment = normalizeFilterValue(segmentFilter).replace(/s$/, '');
        const normalizedAccountSegment = normalizeFilterValue(account.segment).replace(/s$/, '');
        const matchesSegment = segmentFilter === 'All Segments' || normalizedAccountSegment.includes(normalizedSegment);
        
        const scoreType = scoreFilter.split(' ')[0].toLowerCase();
        const matchesScore = scoreFilter === 'Score: All' || normalizeFilterValue(account.status).includes(scoreType);
        
        const matchesOwner = ownerFilter === 'Owner: All' || normalizeFilterValue(account.owner) === normalizeFilterValue(ownerFilter.replace(/^owner:\s*/i, ''));
        const matchesRegion = regionFilter === 'Region: All' || normalizeFilterValue(account.region) === normalizeFilterValue(regionFilter.replace(/^region:\s*/i, ''));
        
        return matchesSegment && matchesScore && matchesOwner && matchesRegion;
    });

    currentPage = 1; // Reset to first page on filter change
    renderAccountRows();
}

function applyAccountExplorerState(data) {
    const kpis = data.accountExplorer.summaryKpis;
    setText('metric-total-accounts', data.accountExplorer.accounts.length);
    setText('metric-growth-potential', kpis.growthPotential.value);
    setText('metric-at-risk', kpis.atRiskAccounts.value);
    setText('metric-health-score', `${kpis.avgHealthScore.value}${kpis.avgHealthScore.suffix || ''}`);

    filterAccountTableRows(data.accountExplorer.accounts || []);
    updateAIInsight({ page: 'accountExplorer', filters: getFilterState() });
}

let currentAccount = null;

function openDetailsDrawer(account, row) {
    if (!account) return;
    currentAccount = account;

    // Handle Selection UI across current page rows
    document.querySelectorAll('tbody tr').forEach(r => {
        r.classList.remove('bg-brand-primary/10', 'border-l-brand-primary');
        r.classList.add('border-l-transparent');
        const icon = r.querySelector('.chevron-btn i');
        if (icon) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-right');
        }
    });

    if (row) {
        row.classList.add('bg-brand-primary/10', 'border-l-brand-primary');
        row.classList.remove('border-l-transparent');
        const icon = row.querySelector('.chevron-btn i');
        if (icon) {
            icon.classList.remove('fa-chevron-right');
            icon.classList.add('fa-chevron-down');
        }
    }

    setText('details-initials', account.initials);
    setText('details-name', account.name);
    setText('details-subtitle', `${account.segment} • ${account.region}`);
    
    const statusEl = document.getElementById('details-status');
    if (statusEl) {
        const color = getStatusColor(account.status);
        statusEl.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-${color}"></span> ${account.status} (${account.statusScore}/100)`;
        statusEl.className = `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-${color}/10 text-${color} border border-${color}/20`;
    }
    
    setText('details-revenue', account.arr);
    
    const contactContainer = document.querySelector('#details-drawer .space-y-3');
    if (contactContainer && account.contacts) {
        contactContainer.innerHTML = account.contacts.map(c => `
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full border border-brand-border bg-brand-bg flex items-center justify-center text-brand-textSecondary text-xs font-medium">
                    ${c.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                    <p class="text-sm font-medium text-brand-textPrimary leading-none">${c.name}</p>
                    <p class="text-xs text-brand-textSecondary mt-0.5">${c.role}</p>
                </div>
            </div>
        `).join('');
    }

    const drawer = document.getElementById('details-drawer');
    if (drawer) drawer.classList.remove('hidden');
    
    setText('details-ai-text', 'Analyzing account context...');
    updateAIInsight({ page: 'accountExplorer', filters: getFilterState(), account });
}

function clearFilters() {
    ['filter-segment', 'filter-score', 'filter-owner', 'filter-region'].forEach((id) => {
        const select = document.getElementById(id);
        if (select) select.selectedIndex = 0;
    });
    applyAccountExplorerState(window.AppData);
}

function exportCsv() {
    alert('Export CSV clicked. Exporting current view...');
}

async function updateAIInsight(context) {
    const target = document.getElementById('details-ai-text');
    if (!target) return;
    const insight = await generateAIInsight(context);
    target.textContent = insight;
}

function mountAccountRowHandlers() {
    const rows = document.querySelectorAll('tbody tr[data-account-id]');
    rows.forEach((row) => {
        row.addEventListener('click', () => {
            const accountId = row.dataset.accountId;
            const account = filteredAccounts.find((item) => item.id === accountId);
            if (account) {
                openDetailsDrawer(account, row);
            }
        });
    });
}

function initAccountExplorerPage(data) {
    const filters = data.accountExplorer.filters || {};
    populateSelectOptions('filter-segment', filters.segments || []);
    populateSelectOptions('filter-score', filters.scores || []);
    populateSelectOptions('filter-owner', filters.owners || []);
    populateSelectOptions('filter-region', filters.regions || []);

    const filterIds = ['filter-segment', 'filter-score', 'filter-owner', 'filter-region'];
    filterIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', () => applyAccountExplorerState(data));
    });

    const clearButton = document.getElementById('btn-clear-filters');
    if (clearButton) clearButton.addEventListener('click', clearFilters);

    const exportButton = document.getElementById('btn-export-csv');
    if (exportButton) exportButton.addEventListener('click', exportCsv);

    const closeButton = document.getElementById('btn-close-drawer');
    if (closeButton) closeButton.addEventListener('click', () => {
        const drawer = document.getElementById('details-drawer');
        if (drawer) drawer.classList.add('hidden');
        currentAccount = null;
        renderAccountRows();
    });

    // Pagination Click Handlers
    document.getElementById('btn-prev-page')?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderAccountRows();
        }
    });

    document.getElementById('btn-next-page')?.addEventListener('click', () => {
        if (currentPage * pageSize < filteredAccounts.length) {
            currentPage++;
            renderAccountRows();
        }
    });

    const deepDiveBtn = document.getElementById('btn-view-deep-dive');
    if (deepDiveBtn) {
        deepDiveBtn.addEventListener('click', (e) => {
            if (currentAccount) {
                localStorage.setItem('selectedAccountId', currentAccount.id);
            }
        });
    }

    applyAccountExplorerState(data);

    // ── Restore filter state from Executive Overview bar-click navigation ──
    const storedFilter = localStorage.getItem('explorerFilter');
    if (storedFilter) {
        try {
            const filter = JSON.parse(storedFilter);
            if (filter.score && filter.score !== 'Score: All') {
                const scoreEl = document.getElementById('filter-score');
                if (scoreEl) {
                    for (const opt of scoreEl.options) {
                        if (opt.text === filter.score || opt.value === filter.score) {
                            scoreEl.value = opt.value;
                            break;
                        }
                    }
                }
            }
            if (filter.segment && filter.segment !== 'All Segments') {
                const segEl = document.getElementById('filter-segment');
                if (segEl) {
                    for (const opt of segEl.options) {
                        if (opt.text === filter.segment || opt.value === filter.segment) {
                            segEl.value = opt.value;
                            break;
                        }
                    }
                }
            }
            localStorage.removeItem('explorerFilter');
            filterAccountTableRows(data.accountExplorer.accounts || []);
        } catch (e) {
            console.warn('[AccountExplorer] Filter restore failed:', e);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    onDataReady(function (data) {
        try {
            initAccountExplorerPage(data);
        } catch (err) {
            console.error('[AccountExplorer] Error:', err);
        }
    });
});
