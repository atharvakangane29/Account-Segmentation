/**
 * charts.js
 * Shared Plotly chart configuration and rendering utilities.
 */

const ChartConfig = {
    responsive: true,
    displayModeBar: false
};

function commonLayout() {
    return {
        font: { family: 'Inter, sans-serif', color: '#4A6B8A' },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 20, r: 20, b: 40, l: 60 }
    };
}

/* ---------- Executive Overview Charts ---------- */

function renderWaterfallChart(containerId, wfData) {
    const data = [{
        type: 'waterfall',
        orientation: 'v',
        measure: wfData.measures,
        x: wfData.labels,
        textposition: 'outside',
        text: wfData.texts,
        y: wfData.values,
        connector: { line: { color: '#C9C1B1' } },
        decreasing: { marker: { color: '#A35139' } },
        increasing: { marker: { color: '#FFB162' } },
        totals:     { marker: { color: '#4A6B8A' } }
    }];

    const layout = {
        ...commonLayout(),
        yaxis: { title: 'Revenue (Millions USD)', gridcolor: '#D8D0C4', zerolinecolor: '#C9C1B1' },
        xaxis: { showgrid: false },
        showlegend: false
    };

    Plotly.newPlot(containerId, data, layout, ChartConfig);
}

function renderDonutChart(containerId, donutData) {
    const data = [{
        values: donutData.values,
        labels: donutData.labels,
        type: 'pie',
        hole: 0.7,
        marker: {
            colors: donutData.colors,
            line: { color: '#F7F4EF', width: 2 }
        },
        textinfo: 'none',
        hoverinfo: 'label+percent'
    }];

    const layout = {
        ...commonLayout(),
        margin: { t: 0, r: 0, b: 0, l: 0 },
        showlegend: false,
        annotations: [
            { font: { size: 24, family: 'Inter', weight: 'bold', color: '#2C3B4D' }, showarrow: false, text: String(donutData.totalAccounts), x: 0.5, y: 0.53 },
            { font: { size: 12, family: 'Inter', color: '#4A6B8A' }, showarrow: false, text: 'Total Accounts', x: 0.5, y: 0.43 }
        ]
    };

    Plotly.newPlot(containerId, data, layout, ChartConfig);
}

/* ---------- Segmentation Engine Charts ---------- */

function generateBubbleSeries(seg) {
    return {
        x: Array.from({ length: seg.count }, () => Math.random() * (seg.xRange[1] - seg.xRange[0]) + seg.xRange[0]),
        y: Array.from({ length: seg.count }, () => Math.random() * (seg.yRange[1] - seg.yRange[0]) + seg.yRange[0]),
        mode: 'markers',
        name: seg.name,
        marker: {
            color: seg.color,
            size: Array.from({ length: seg.count }, () => Math.random() * (seg.sizeRange[1] - seg.sizeRange[0]) + seg.sizeRange[0]),
            sizemode: 'area',
            sizeref: 2,
            line: { color: '#F7F4EF', width: 1 },
            opacity: 0.8
        },
        text: Array.from({ length: seg.count }, (_, i) => `Account ${i + 1}<br>ARR: $${(Math.random() * 5 + 1).toFixed(1)}M`),
        hoverinfo: 'text'
    };
}

function renderBubbleChart(containerId, segments) {
    const data = segments.map(generateBubbleSeries);
    const layout = {
        ...commonLayout(),
        xaxis: { title: 'Account Value Score', range: [0, 100], gridcolor: '#D8D0C4', zerolinecolor: '#C9C1B1' },
        yaxis: { title: 'Churn Risk Score', range: [0, 100], gridcolor: '#D8D0C4', zerolinecolor: '#C9C1B1' },
        showlegend: true,
        legend: { orientation: 'h', y: -0.15, x: 0.5, xanchor: 'center' },
        shapes: [
            { type: 'line', x0: 50, y0: 0, x1: 50, y1: 100, line: { color: '#C9C1B1', width: 2, dash: 'dash' } },
            { type: 'line', x0: 0, y0: 50, x1: 100, y1: 50, line: { color: '#C9C1B1', width: 2, dash: 'dash' } }
        ],
        annotations: [
            { x: 25, y: 95, text: 'High Risk / Low Value', showarrow: false, font: { color: '#4A6B8A', size: 10 } },
            { x: 75, y: 95, text: 'High Risk / High Value', showarrow: false, font: { color: '#4A6B8A', size: 10 } },
            { x: 25, y: 5,  text: 'Low Risk / Low Value',  showarrow: false, font: { color: '#4A6B8A', size: 10 } },
            { x: 75, y: 5,  text: 'Low Risk / High Value', showarrow: false, font: { color: '#4A6B8A', size: 10 } }
        ]
    };
    Plotly.newPlot(containerId, data, layout, ChartConfig);
}

function renderSankeyChart(containerId, sankeyData) {
    const data = {
        type: 'sankey',
        orientation: 'h',
        node: {
            pad: 15,
            thickness: 20,
            line: { color: 'black', width: 0 },
            label: sankeyData.nodeLabels,
            color: sankeyData.nodeColors
        },
        link: sankeyData.links
    };
    const layout = {
        ...commonLayout(),
        margin: { t: 10, l: 10, r: 10, b: 10 },
        font: { size: 12, color: '#4A6B8A' }
    };
    Plotly.newPlot(containerId, [data], layout, ChartConfig);
}

/* ---------- Deep Dive Charts ---------- */

function renderRadarChart(containerId, radarData) {
    const data = [{
        type: 'scatterpolar',
        r: radarData.values,
        theta: radarData.labels,
        fill: 'toself',
        fillcolor: 'rgba(255, 177, 98, 0.2)',
        line: { color: '#FFB162', width: 2 },
        marker: { color: '#FFB162', size: 6 }
    }];

    const layout = {
        polar: {
            radialaxis: { visible: true, range: [0, 100], showticklabels: false, gridcolor: '#D8D0C4' },
            angularaxis: { tickfont: { size: 11, color: '#4A6B8A' }, gridcolor: '#D8D0C4' }
        },
        margin: { t: 20, r: 30, b: 20, l: 30 },
        showlegend: false,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };

    Plotly.newPlot(containerId, data, layout, ChartConfig);
}

/* ---------- Account Explorer Charts ---------- */

function renderMiniTrendChart(containerId) {
    const data = [{
        x: ['1', '5', '10', '15', '20', '25', '30'],
        y: [45, 52, 48, 60, 65, 75, 82],
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: '#7FA3C0', width: 2, shape: 'spline' },
        marker: { size: 4, color: '#7FA3C0' },
        fill: 'tozeroy',
        fillcolor: 'rgba(127, 163, 192, 0.1)'
    }];

    const layout = {
        margin: { t: 5, r: 5, b: 20, l: 20 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: { showgrid: false, zeroline: false, showticklabels: false },
        yaxis: { showgrid: true, gridcolor: '#D8D0C4', zeroline: false, showticklabels: false },
        showlegend: false,
        hovermode: 'closest'
    };

    Plotly.newPlot(containerId, data, layout, { ...ChartConfig, staticPlot: true });
}
