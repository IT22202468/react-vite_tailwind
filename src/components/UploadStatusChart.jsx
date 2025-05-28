import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  DoughnutController
} from 'chart.js';
import { Box, CircularProgress, Typography } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend, Title, DoughnutController);

const UploadStatusChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 600));

        const mockData = {
          uploaded: 782500,
          notUploaded: 421300
        };

        const total = mockData.uploaded + mockData.notUploaded;
        const percentage = Math.round((mockData.uploaded / total) * 100);
        setCompletionPercentage(percentage);

        setChartData({
          labels: ['Uploaded', 'Not Uploaded'],
          datasets: [
            {
              data: [mockData.uploaded, mockData.notUploaded],
              backgroundColor: ['#51154A', '#F7C7AC'],
              borderWidth: 1,
              hoverOffset: 10
            }
          ]
        });
      } catch (err) {
        console.error("Error fetching upload status data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🎯 Plugin to display percentage and label in center
  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart) => {
      const { width, height, ctx } = chart;

      ctx.save();
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const centerX = width / 2;
      const centerY = height / 2 - 10;

      ctx.fillText(`${completionPercentage}%`, centerX, centerY);
      ctx.font = '10px Arial';
      ctx.fillText('Completed', centerX, centerY + 100);
      ctx.restore();
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '50%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      },
      title: {
        display: true,
        text: 'Uploaded vs Not Uploaded Amounts',
        font: {
          size: 16
        }
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!chartData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        <Typography variant="body1" color="error">Failed to load chart data</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 300, width: '100%', position: 'relative' }}>
      <Doughnut data={chartData} options={options} />
      {/* <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} /> */}
    </Box>
  );
};

export default UploadStatusChart;
