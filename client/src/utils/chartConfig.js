// utils/chartConfig.js
export const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: {
      x: { type: 'category' },
      y: { type: 'linear', beginAtZero: true }
    }
  };
  
  export const colors = {
    blue: '#3B82F6',
    red: '#EF4444',
    amber: '#F59E0B'
  };