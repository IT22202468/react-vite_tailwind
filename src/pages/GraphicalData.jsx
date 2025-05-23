import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ReasonAnalysisChart from "../components/ReasonAnalysisChart";
import BuyerTabs from "../components/BuyerTabs";
import UploadStatusChart from "../components/UploadStatusChart";
import ExcelDataTable from "../components/ExcelDataTable";
import { Box, Paper, Grid, Typography, Divider } from "@mui/material";

const GraphicalData = () => {
  // Mock data for the ExcelDataTable component
  const [rows, setRows] = useState([
    {
      id: 1,
      grantedDate: '3/15/2023',
      buyerName: 'ABC Corporation',
      invoiceNumber: 'INV-2023-001',
      grantedValue: '25000',
      lrAmount: '24500',
      difference: '500',
      aging: '120',
      reasonCategory: '',
      reasons: 'ARU',
      comments: 'Payment pending',
      value: '24500',
      attachments: '',
      updatedBy: 'John Doe',
      updatedOn: '6/15/2023',
      updatedTime: '14:30'
    },
    {
      id: 2,
      grantedDate: '4/18/2023',
      buyerName: 'XYZ Industries',
      invoiceNumber: 'INV-2023-042',
      grantedValue: '37500',
      lrAmount: '37000',
      difference: '500',
      aging: '86',
      reasonCategory: '',
      reasons: 'R&Q',
      comments: '',
      value: '37000',
      attachments: '',
      updatedBy: 'Jane Smith',
      updatedOn: '7/20/2023',
      updatedTime: '11:15'
    }
  ]);
  const [nextId, setNextId] = useState(3);
  const [attachments, setAttachments] = useState({});

  // Helper functions for ExcelDataTable
  const calculateAging = (grantedDate) => {
    if (!grantedDate) return '';
    
    const date = new Date(grantedDate);
    if (isNaN(date.getTime())) return '';
    
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays.toString();
  };

  const calculateDifference = (grantedValue, lrAmount) => {
    const grantedNum = parseFloat(grantedValue) || 0;
    const lrNum = parseFloat(lrAmount) || 0;
    
    return (grantedNum - lrNum).toFixed(2);
  };

  return (
    <>
      <Navbar />
      <div className="p-8">        
        {/* Three column layout for charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Buyer Tabs (Left Column) */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                Buyer List
              </Typography>
              <BuyerTabs />
            </Paper>
          </Grid>
          
          {/* Upload Status Chart (Middle Column) */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                Upload Status
              </Typography>
              <UploadStatusChart />
            </Paper>
          </Grid>
          
          {/* Reason Analysis Chart (Right Column) */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
                Reason Analysis
              </Typography>
              <ReasonAnalysisChart />
            </Paper>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Excel Data Table (Full Width Below) */}
        <Paper elevation={2} sx={{ p: 2 }}>
          <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
            Transaction Details
          </Typography>
          <Box sx={{ mt: 2 }}>
            <ExcelDataTable
              rows={rows}
              setRows={setRows}
              nextId={nextId}
              setNextId={setNextId}
              attachments={attachments}
              setAttachments={setAttachments}
              calculateAging={calculateAging}
              calculateDifference={calculateDifference}
            />
          </Box>
        </Paper>
      </div>
    </>
  );
};

export default GraphicalData;
