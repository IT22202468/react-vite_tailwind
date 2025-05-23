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
import { Box, Paper, Typography, CircularProgress } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReasonAnalysisSection = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    // Simulate API fetch with mock data
    // In production, replace this with actual API call
    setTimeout(() => {
      try {
        // Mock data
        const mockData = [
          { reason: 'R&Q', totalValue: 180000 },
          { reason: 'ARU', totalValue: 125000 },
          { reason: 'ARU & R&Q', totalValue: 85000 },
          { reason: 'Rounding off', totalValue: 35000 },
          { reason: 'Changes in Invoice reference', totalValue: 72000 }
        ];
        
        const labels = mockData.map(item => item.reason);
        const data = mockData.map(item => item.totalValue);

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
        
        setLoading(false);
      } catch (err) {
        console.error('Error preparing chart data:', err);
        setError('Failed to load reason analysis data');
        setLoading(false);
      }
    }, 800);
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
    layout: {
      padding: {
        top: 10,
        bottom: 10
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
        Reason Analysis
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        height: 'calc(100% - 50px)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', width: '100%' }}>
            <Bar data={chartData} options={options} />
          </div>
        )}
      </Box>
    </Paper>
  );
};

export default ReasonAnalysisSection;
