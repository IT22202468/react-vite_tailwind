import React from 'react';
import ExcelDataTable from './ExcelDataTable';
import { Box, Paper, Typography } from "@mui/material";

const DataTableSection = ({ 
  rows, 
  setRows, 
  nextId, 
  setNextId, 
  attachments, 
  setAttachments,
  calculateAging,
  calculateDifference
}) => {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" component="h3" sx={{ 
        mb: 3, 
        fontWeight: 600, 
        color: '#333',
        borderBottom: '1px solid #eaeaea',
        paddingBottom: '8px'
      }}>
        Buyer Wise Pending Upload Invoices
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
  );
};

export default DataTableSection;
