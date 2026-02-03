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

// Chart.js Global Defaults for Premium Dark UI
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';
Chart.defaults.font.family = "'Inter', sans-serif";

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');

    // Update nav item highlighting
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.onclick.toString().includes(tabId)) {
            item.classList.add('active');
        }
    });

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

    const purpleGradient = ctx.createLinearGradient(0, 0, 0, 400);
    purpleGradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
    purpleGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

    activeCharts.liver = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'ALT (GPT)',
                    data: liverData.alt,
                    borderColor: '#8b5cf6',
                    borderWidth: 3,
                    pointBackgroundColor: '#8b5cf6',
                    pointBorderColor: 'rgba(255,255,255,0.2)',
                    pointBorderWidth: 4,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    tension: 0.4,
                    fill: true,
                    backgroundColor: purpleGradient
                },
                {
                    label: 'AST (GOT)',
                    data: liverData.ast,
                    borderColor: '#00f5ff',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            scales: {
                y: { grid: { borderDash: [5, 5] } },
                x: { grid: { display: false } }
            },
            plugins: {
                legend: { position: 'top', align: 'end', labels: { usePointStyle: true, boxWidth: 6 } }
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
                    label: 'Total Cholesterol',
                    data: lipidData.col,
                    backgroundColor: '#8b5cf6',
                    borderRadius: 10,
                    barThickness: 20
                },
                {
                    label: 'Triglycerides',
                    data: lipidData.tri,
                    backgroundColor: '#00f5ff',
                    borderRadius: 10,
                    barThickness: 20
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
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
                    label: 'Ferritin',
                    data: hemData.fer,
                    borderColor: '#ef4444',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false
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
