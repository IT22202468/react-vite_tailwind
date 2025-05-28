import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReasonAnalysisChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/reason-analysis')
      .then(res => {
        const labels = res.data.map(item => item.reason);
        const data = res.data.map(item => item.totalValue);

        // Alternate colors between the two
        const colors = labels.map((_, index) =>
          index % 2 === 0 ? '#8ED973' : '#00B050'
        );

        setChartData({
          labels,
          datasets: [
            {
              label: 'Total Value',
              data,
              backgroundColor: colors,
              borderColor: colors,
              borderWidth: 1,
              categoryPercentage: 1.0,
              barPercentage: 1.0,
              barThickness: 50,
              hoverBackgroundColor: colors.map(color =>
                color === '#8ED973' ? '#6fbf59' : '#008C3A'
              )
            }
          ]
        });
      })
      .catch(err => console.error('Error fetching chart data:', err));
  }, []);

  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return '$' + context.raw.toLocaleString();
          }
        }
      },
      title: {
        display: true,
        text: 'Reason Analysis (Horizontal View)'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Total Value'
        },
        ticks: {
          callback: (value) => '$' + value.toLocaleString()
        }
      },
      y: {
        title: {
          display: true,
          text: 'Reason'
        },
        grid: {
          display: false
        }
      }
    },
    elements: {
      bar: {
        barThickness: 25
      }
    },
    // layout: {
    //   padding: {
    //     top: 10,
    //     bottom: 10
    //   }
    // }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>Loading chart...</p>
      )}
    </div>
  );
};

export default ReasonAnalysisChart;
