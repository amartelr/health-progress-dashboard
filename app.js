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

let activeCharts = {};

// Chart.js Global Overrides for Premium Dark Design
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';
Chart.defaults.font.family = "'Outfit', sans-serif";

function switchTab(tabId) {
    document.querySelectorAll('.tab-pane').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');

    // Select correct nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('onclick').includes(tabId)) {
            item.classList.add('active');
        }
    });

    // Small delay to ensure the tab is rendered (flex/block) before Chart.js calculates size
    setTimeout(() => initCharts(tabId), 50);
}

function initCharts(tabId) {
    if (tabId === 'liver') createLiverChart();
    if (tabId === 'lipids') createLipidChart();
    if (tabId === 'hematology') createHemChart();
}

function createLiverChart() {
    const canvas = document.getElementById('liverChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (activeCharts.liver) activeCharts.liver.destroy();

    activeCharts.liver = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'AST (GOT)',
                    data: liverData.ast,
                    borderColor: '#a78bfa',
                    backgroundColor: 'rgba(167, 139, 250, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4
                },
                {
                    label: 'ALT (GPT)',
                    data: liverData.alt,
                    borderColor: '#00f5ff',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
                tooltip: {
                    backgroundColor: '#1e1e2d',
                    titleColor: '#fff',
                    bodyColor: '#94a3b8',
                    padding: 12,
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label;
                            let val = context.raw;
                            let range = '';
                            if (label.includes('AST')) range = ' (Ideal: 10-40)';
                            if (label.includes('ALT')) range = ' (Ideal: 7-56)';
                            return `${label}: ${val} U/L${range}`;
                        }
                    }
                }
            },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)', borderDash: [5, 5] } },
                x: { grid: { display: false } }
            }
        }
    });
}

function createLipidChart() {
    const ctx = document.getElementById('lipidChart').getContext('2d');
    if (activeCharts.lipids) activeCharts.lipids.destroy();

    activeCharts.lipids = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Colesterol Total',
                    data: lipidData.col,
                    backgroundColor: '#8b5cf6',
                    borderRadius: 8,
                    barThickness: 15
                },
                {
                    label: 'Triglicéridos',
                    data: lipidData.tri,
                    backgroundColor: '#00f5ff',
                    borderRadius: 8,
                    barThickness: 15
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (c) => `${c.dataset.label}: ${c.raw} mg/dL (Ideal: < 200)`
                    }
                }
            },
            scales: {
                y: { grid: { borderDash: [5, 5] } },
                x: { grid: { display: false } }
            }
        }
    });
}

function createHemChart() {
    const ctx = document.getElementById('hemChart').getContext('2d');
    if (activeCharts.hem) activeCharts.hem.destroy();

    activeCharts.hem = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Ferritina (ng/mL)',
                    data: hemData.fer,
                    borderColor: '#ef4444',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false,
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { grid: { borderDash: [5, 5] } },
                x: { grid: { display: false } }
            }
        }
    });
}

window.onload = () => initCharts('liver');
