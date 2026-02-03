// Data extracted from NotebookLM
const dates = ['Feb 2023', 'Abr 2025', 'May 2025', 'Jun 04 2025', 'Jun 12 2025', 'Sep 2025', 'Dic 2025'];

const liverData = {
    ast: [19, 10, 21, 106, 124, 30, 17],
    alt: [23, 32, 80, 227, 277, 40, 14],
    ggt: [35, 36, 376, 500, 774, 480, 36], // Interpolated Jun 04
    bili: [0.5, 0.5, 10.4, 5.51, 3.64, 0.67, 0.57]
};

const lipidData = {
    col: [190, 204, 210, 415, 415, 180, 198],
    tri: [100, 250, 310, 200, 180, 80, 117]
};

const hemData = {
    fer: [300, 280, 1500, 1911, 1911, 500, 380], // Ferritin peak
    hgb: [15.5, 15.2, 14.2, 12.6, 13.3, 16.2, 16.5]
};

let activeCharts = {};

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');

    initCharts(tabId);
}

function initCharts(tabId) {
    if (tabId === 'liver') createLiverChart();
    if (tabId === 'lipids') createLipidChart();
    if (tabId === 'hematology') createHemChart();
}

function createLiverChart() {
    const ctx = document.getElementById('liverChart').getContext('2d');
    if (activeCharts.liver) activeCharts.liver.destroy();

    activeCharts.liver = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'AST (GOT)',
                    data: liverData.ast,
                    borderColor: '#2563eb',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'ALT (GPT)',
                    data: liverData.alt,
                    borderColor: '#7c3aed',
                    tension: 0.4,
                    fill: false
                },
                {
                    label: 'GGT (x10)',
                    data: liverData.ggt.map(v => v / 10), // Scale for visibility
                    borderColor: '#ef4444',
                    borderDash: [5, 5],
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label;
                            if (label === 'GGT (x10)') {
                                return `GGT: ${liverData.ggt[context.dataIndex]} U/L`;
                            }
                            return `${label}: ${context.raw} U/L`;
                        }
                    }
                }
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
                    backgroundColor: 'rgba(37, 99, 235, 0.6)',
                    borderRadius: 8
                },
                {
                    label: 'Triglicéridos',
                    data: lipidData.tri,
                    backgroundColor: 'rgba(245, 158, 11, 0.6)',
                    borderRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true }
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
                    yAxisID: 'y',
                    borderColor: '#ef4444',
                    tension: 0.4
                },
                {
                    label: 'Hemoglobina (g/dL)',
                    data: hemData.hgb,
                    yAxisID: 'y1',
                    borderColor: '#10b981',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Ferritina' } },
                y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'Hemoglobina' } }
            }
        }
    });
}

// Initial Call
window.onload = () => initCharts('liver');
