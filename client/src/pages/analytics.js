import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import api from '../utils/api';
import PersistLogin from '@/utils/PersistLogin';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useRef, useState } from 'react';
import DataLabelsPlugin from 'chartjs-plugin-datalabels';

Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  DataLabelsPlugin
);

const AnalyticsDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const barChartRef = useRef(null);
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await api.get('/api/analytics/metrics');
        setMetrics(data);
      } catch (error) {
        console.error('Failed to load metrics:', error);
      }
    };

    fetchMetrics();

    return () => {
      // Cleanup charts on component unmount
      [barChartRef, lineChartRef, pieChartRef].forEach(chartRef => {
        if (chartRef.current) chartRef.current.destroy();
      });
    };
  }, []);
  console.log(metrics)

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
          size: 12
        },
        formatter: (value) => value,
        anchor: 'center',
        align: 'center'
      }
    },
    scales: {
      x: { type: 'category' },
      y: { type: 'linear', beginAtZero: true }
    }
  };

  const pieChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: { position: 'right' },
      datalabels: {
        ...chartOptions.plugins.datalabels,
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
          return `${Math.round((value / total) * 100)}%`;
        }
      }
    }
  };

  if (!metrics) return <div className="text-center p-8">Loading analytics...</div>;

  return (
    <PersistLogin>
      <ProtectedRoute>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {/* Completed Tasks Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">Completed Tasks by User</h3>
            <div className="h-64">
              <Bar
                ref={barChartRef}
                data={{
                  labels: metrics?.completedTasks.map(t => t._id),
                  datasets: [{
                    label: 'Completed Tasks',
                    data: metrics?.completedTasks.map(t => t.count),
                    backgroundColor: '#3B82F6'
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>

          {/* Overdue Trends Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">Overdue Trends</h3>
            <div className="h-64">
              <Line
                ref={lineChartRef}
                data={{
                  labels: metrics?.overdueTrends.map(t => `Month ${t._id}`),
                  datasets: [{
                    label: 'Overdue Tasks',
                    data: metrics?.overdueTrends.map(t => t.count),
                    borderColor: '#EF4444',
                    tension: 0.1
                  }]
                }}
                options={chartOptions}
              />
            </div>
          </div>

          {/* Priority Distribution Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">Task Priority Distribution</h3>
            <div className="h-64">
              <Pie
                ref={pieChartRef}
                data={{
                  labels: metrics?.priorityDistribution.map(t => t._id),
                  datasets: [{
                    data: metrics?.priorityDistribution.map(t => t.total),
                    backgroundColor: ['#EF4444', '#3B82F6', '#F59E0B']
                  }]
                }}
                options={pieChartOptions}
              />
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </PersistLogin>
  );
};

export default AnalyticsDashboard;

// const AnalyticsDashboard = () => {
//   const [metrics, setMetrics] = useState(null);

//   useEffect(() => {
//     const fetchMetrics = async () => {
//       const { data } = await api.get('/api/analytics/metrics');
//       setMetrics(data);
//     };
//     fetchMetrics();
//   }, []);

//   return (

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
//           {/* Completed Tasks */}
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-lg font-bold mb-4">Completed Tasks</h3>
//             <Bar
//               data={{
//                 labels: metrics?.completedTasks.map(t => t._id),
//                 datasets: [{
//                   label: 'Completed Tasks',
//                   data: metrics?.completedTasks.map(t => t.count)
//                 }]
//               }}
//             />
//           </div>

//           {/* Overdue Trends */}
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-lg font-bold mb-4">Overdue Trends</h3>
//             <Line
//               data={{
//                 labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//                 datasets: [{
//                   label: 'Overdue Tasks',
//                   data: metrics?.overdueTrends.map(t => t.count)
//                 }]
//               }}
//             />
//           </div>

//           {/* Priority Distribution */}
//           <div className="bg-white p-4 rounded-lg shadow">
//             <h3 className="text-lg font-bold mb-4">Priority Distribution</h3>
//             <Pie
//               data={{
//                 labels: metrics?.priorityDistribution.map(t => t._id),
//                 datasets: [{
//                   data: metrics?.priorityDistribution.map(t => t.total),
//                   backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
//                 }]
//               }}
//             />
//           </div>
//         </div>


//   );
// };


