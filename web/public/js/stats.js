document.addEventListener('DOMContentLoaded', () => {
    // Проверка наличия canvas элементов
    const cpuCanvas = document.getElementById('cpuChart');
    const ramCanvas = document.getElementById('ramChart');
    
    if (!cpuCanvas || !ramCanvas) {
        console.error('Canvas elements not found!');
        showError('Графики не могут быть загружены');
        return;
    }

    // Проверка загрузки Chart.js
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded!');
        showError('Библиотека графиков не загружена');
        return;
    }

    // Инициализация графиков
    const cpuCtx = cpuCanvas.getContext('2d');
    const ramCtx = ramCanvas.getContext('2d');

    const cpuChart = new Chart(cpuCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Загрузка CPU (%)',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    const ramChart = new Chart(ramCtx, {
        type: 'bar',
        data: {
            labels: ['Использовано', 'Свободно'],
            datasets: [{
                label: 'Память (MB)',
                data: [0, 0],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(75, 192, 192, 0.5)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Функция показа ошибки
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'chart-error';
        errorDiv.textContent = message;
        document.querySelector('.charts-container').appendChild(errorDiv);
    }

    // Функция обновления данных
    async function updateCharts() {
        try {
            const response = await fetch('/api/stats');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const stats = await response.json();
            
            // Обновляем CPU
            const timeLabel = new Date().toLocaleTimeString();
            cpuChart.data.labels.push(timeLabel);
            cpuChart.data.datasets[0].data.push(stats.cpu.load);
            
            // Ограничиваем количество точек
            if (cpuChart.data.labels.length > 15) {
                cpuChart.data.labels.shift();
                cpuChart.data.datasets[0].data.shift();
            }
            
            // Обновляем RAM
            ramChart.data.datasets[0].data = [
                stats.ram.used,
                stats.ram.free
            ];
            
            cpuChart.update();
            ramChart.update();
            
        } catch (error) {
            console.error('Error updating charts:', error);
            showError('Ошибка загрузки данных');
        }
    }

    // Первое обновление и интервал
    updateCharts();
    setInterval(updateCharts, 3000);
});