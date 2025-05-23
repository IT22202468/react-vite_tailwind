import React from 'react';
import ReasonAnalysisChart from './ReasonAnalysisChart';
import { Box, Paper, Typography } from "@mui/material";

const ReasonAnalysisSection = () => {
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
        <ReasonAnalysisChart />
      </Box>
    </Paper>
  );
};

export default ReasonAnalysisSection;
