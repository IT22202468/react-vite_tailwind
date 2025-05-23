import React from 'react';
import UploadStatusChart from './UploadStatusChart';
import { Box, Paper, Typography } from "@mui/material";

const UploadStatusSection = () => {
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100% - 50px)' }}>
        <UploadStatusChart />
      </Box>
    </Paper>
  );
};

export default UploadStatusSection;
