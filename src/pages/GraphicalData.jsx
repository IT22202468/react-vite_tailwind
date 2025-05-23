import React, { useState } from "react";
import Navbar from "../components/Navbar";
import BuyerListSection from "../components/BuyerListSection";
import UploadStatusSection from "../components/UploadStatusSection";
import ReasonAnalysisSection from "../components/ReasonAnalysisSection";
import DataTableSection from "../components/DataTableSection";
import { Grid, Divider, Box } from "@mui/material";

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
      <Box className="p-8">
        <h2 className="text-2xl mb-6 font-bold text-gray-800">Graphical Data</h2>
        
        {/* Three column layout for charts with 20% 20% 60% distribution */}
        <Grid container spacing={3} sx={{ mb: 4, minHeight: '400px' }}>
          {/* Buyer Tabs (Left Column - 20%) */}
          <Grid item xs={12} md={2.4}>
            <BuyerListSection />
          </Grid>
          
          {/* Upload Status Chart (Middle Column - 20%) */}
          <Grid item xs={12} md={2.4}>
            <UploadStatusSection />
          </Grid>
          
          {/* Reason Analysis Chart (Right Column - 60%) */}
          <Grid item xs={12} md={7.2}>
            <ReasonAnalysisSection />
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Excel Data Table (Full Width Below) */}
        <DataTableSection
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
    </>
  );
};

export default GraphicalData;
