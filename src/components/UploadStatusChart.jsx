import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import { Box, CircularProgress, Typography } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const UploadStatusChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would be an API call
    // For now, using mock data
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Mock data for uploaded vs not uploaded amounts
        const mockData = {
          uploaded: 782500,
          notUploaded: 421300
        };
        
        setChartData({
          labels: ['Uploaded', 'Not Uploaded'],
          datasets: [
            {
              data: [mockData.uploaded, mockData.notUploaded],
              backgroundColor: [
                '#51154A',
                '#F7C7AC' 
              ],
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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
      <Pie data={chartData} options={options} />
    </Box>
  );
};

export default UploadStatusChart;
