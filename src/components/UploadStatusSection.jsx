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
import { Box, CircularProgress, Typography, Paper } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend, Title, DoughnutController);

const UploadStatusSection = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completionPercentage, setCompletionPercentage] = useState(0);

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
        
        // Calculate completion percentage
        const total = mockData.uploaded + mockData.notUploaded;
        const percentage = Math.round((mockData.uploaded / total) * 100);
        setCompletionPercentage(percentage);
        
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

  // Plugin to display percentage in the center
  const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart) => {
      const width = chart.width;
      const height = chart.height;
      const ctx = chart.ctx;
      
      ctx.restore();
      ctx.font = '18px Arial';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      
      const text = `${completionPercentage}%`;
      const textX = width / 2;
      const textY = height / 2;
      
      ctx.fillText(text, textX, textY);
      ctx.font = '14px Arial';
      ctx.fillText('Completed', textX, textY + 20);
      ctx.save();
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

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" component="h3" sx={{ 
        mb: 2, 
        fontWeight: 600, 
        color: '#333',
        borderBottom: '1px solid #eaeaea',
        paddingBottom: '8px'
      }}>
        Upload Status
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100% - 40px)' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress />
          </Box>
        ) : !chartData ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <Typography variant="body1" color="error">Failed to load chart data</Typography>
          </Box>
        ) : (
          <Box sx={{ height: 300, width: '100%', position: 'relative' }}>
            <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default UploadStatusSection;
