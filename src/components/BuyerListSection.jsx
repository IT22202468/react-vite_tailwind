import React from 'react';
import BuyerTabs from './BuyerTabs';
import { Box, Paper, Typography } from "@mui/material";

const BuyerListSection = () => {
  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Typography variant="h6" component="h3" sx={{ 
        mb: 2, 
        fontWeight: 600, 
        color: '#333',
        borderBottom: '1px solid #eaeaea',
        paddingBottom: '8px'
      }}>
        Buyer List
      </Typography>
      <Box sx={{ height: 'calc(100% - 50px)' }}>
        <BuyerTabs />
      </Box>
    </Paper>
  );
};

export default BuyerListSection;
