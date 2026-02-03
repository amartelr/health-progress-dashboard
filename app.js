// HealthProgress Premium - Clinical Dashboard
// Data extracted from NotebookLM

const dates = ['Feb 2023', 'Abr 2025', 'May 2025', 'Jun 04 2025', 'Jun 12 2025', 'Sep 2025', 'Dic 2025'];

const liverData = {
    ast: [19, 10, 21, 106, 124, 30, 17],
    alt: [23, 32, 80, 227, 277, 40, 14],
    ggt: [35, 36, 376, 500, 774, 480, 36],
    bili: [0.5, 0.5, 10.4, 5.51, 3.64, 0.67, 0.57]
};

const lipidData = {
    col: [190, 204, 210, 415, 415, 180, 198],
    tri: [100, 250, 310, 200, 180, 80, 117]
};

const hemData = {
    fer: [300, 280, 1500, 1911, 1911, 500, 380],
    hgb: [15.5, 15.2, 14.2, 12.6, 13.3, 16.2, 16.5]
};

// Chart storage by tab
const charts = {
    liver: null,
    lipids: null,
    hematology: null
};

// Chart.js Global Premium Dark Theme
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.06)';
Chart.defaults.font.family = "'Outfit', 'Inter', sans-serif";
Chart.defaults.plugins.legend.labels.boxWidth = 12;
Chart.defaults.plugins.legend.labels.padding = 16;

// ========== TAB SWITCHING ==========
function switchTab(tabId) {
    // Scroll to top to prevent bottom navbar from being pushed out of view
    window.scrollTo(0, 0);

    // Hide all tabs
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });

    // Deactivate all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Activate target tab
    const targetPane = document.getElementById(tabId);
    if (targetPane) {
        targetPane.classList.add('active');
    }

    // Activate nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        const onclick = item.getAttribute('onclick');
        if (onclick && onclick.includes(tabId)) {
            item.classList.add('active');
        }
    });

    // Initialize chart after CSS transition
    requestAnimationFrame(() => {
        setTimeout(() => createChart(tabId), 150);
    });
}

// ========== CHART CREATION ==========
function createChart(tabId) {
    if (tabId === 'liver') createLiverChart();
    else if (tabId === 'lipids') createLipidChart();
    else if (tabId === 'hematology') createHemChart();
}

function createLiverChart() {
    const canvas = document.getElementById('liverChart');
    if (!canvas) return;

    // Destroy existing chart if any
    if (charts.liver) {
        charts.liver.destroy();
        charts.liver = null;
    }

    const ctx = canvas.getContext('2d');

    charts.liver = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'AST (GOT)',
                    data: liverData.ast,
                    borderColor: '#a78bfa',
                    backgroundColor: 'rgba(167, 139, 250, 0.15)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: '#a78bfa',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                },
                {
                    label: 'ALT (GPT)',
                    data: liverData.alt,
                    borderColor: '#22d3ee',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 4,
                    pointBackgroundColor: '#22d3ee'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    backgroundColor: 'rgba(20, 20, 27, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#94a3b8',
                    padding: 14,
                    cornerRadius: 12,
                    borderColor: 'rgba(139, 92, 246, 0.3)',
                    borderWidth: 1,
                    callbacks: {
                        label: function (context) {
                            const label = context.dataset.label;
                            const val = context.raw;
                            let range = '';
                            if (label.includes('AST')) range = ' (Ideal: 10-40 U/L)';
                            if (label.includes('ALT')) range = ' (Ideal: 7-56 U/L)';
                            return `${label}: ${val} U/L${range}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.04)', borderDash: [4, 4] }
                },
                x: { grid: { display: false } }
            }
        }
    });
}

function createLipidChart() {
    const canvas = document.getElementById('lipidChart');
    if (!canvas) return;

    if (charts.lipids) {
        charts.lipids.destroy();
        charts.lipids = null;
    }

    const ctx = canvas.getContext('2d');

    charts.lipids = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Colesterol Total',
                    data: lipidData.col,
                    backgroundColor: 'rgba(139, 92, 246, 0.8)',
                    borderRadius: 6,
                    barPercentage: 0.6
                },
                {
                    label: 'Triglicéridos',
                    data: lipidData.tri,
                    backgroundColor: 'rgba(34, 211, 238, 0.8)',
                    borderRadius: 6,
                    barPercentage: 0.6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    backgroundColor: 'rgba(20, 20, 27, 0.95)',
                    padding: 14,
                    cornerRadius: 12,
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} mg/dL (Ideal: < 200)`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.04)', borderDash: [4, 4] }
                },
                x: { grid: { display: false } }
            }
        }
    });
}

function createHemChart() {
    const canvas = document.getElementById('hemChart');
    if (!canvas) return;

    if (charts.hematology) {
        charts.hematology.destroy();
        charts.hematology = null;
    }

    const ctx = canvas.getContext('2d');

    charts.hematology = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Ferritina (ng/mL)',
                    data: hemData.fer,
                    borderColor: '#f87171',
                    backgroundColor: 'rgba(248, 113, 113, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: '#f87171'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    backgroundColor: 'rgba(20, 20, 27, 0.95)',
                    padding: 14,
                    cornerRadius: 12,
                    callbacks: {
                        label: (ctx) => `${ctx.dataset.label}: ${ctx.raw} ng/mL (Normal: 30-300)`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.04)', borderDash: [4, 4] }
                },
                x: { grid: { display: false } }
            }
        }
    });
}

// ========== TIPPY.JS POPOVERS ==========
function initPopovers() {
    tippy('[data-tippy]', {
        content: (reference) => reference.getAttribute('data-tippy'),
        theme: 'obsidian',
        animation: 'shift-away',
        placement: 'top',
        arrow: true,
        duration: [200, 150],
        delay: [100, 0],
        maxWidth: 280,
        interactive: false,
        allowHTML: true
    });
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    // Initialize charts for the default tab
    createChart('liver');

    // Initialize modern popovers
    initPopovers();
});
