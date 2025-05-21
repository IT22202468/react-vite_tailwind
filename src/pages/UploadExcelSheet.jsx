import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Navbar from "../components/Navbar";
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const UploadExcelSheet = () => {
  const [rows, setRows] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [file, setFile] = useState(null);

  // Define columns for the DataGrid
  const columns = [
    { field: 'grantedDate', headerName: 'Granted Date', editable: true, width: 150 },
    { field: 'buyerName', headerName: 'Buyer name', editable: true, width: 150 },
    { field: 'invoiceNumber', headerName: 'Invoice Number', editable: true, width: 150 },
    { field: 'grantedValue', headerName: 'Granted Value', editable: true, width: 150 },
    { field: 'lrAmount', headerName: 'LR Amount', editable: true, width: 150 },
    { field: 'difference', headerName: 'Difference', editable: true, width: 150 },
    { field: 'aging', headerName: 'Aging', editable: true, width: 120 },
    { field: 'reasonCategory', headerName: 'Reason Category', editable: true, width: 180 },
    { field: 'reasons', headerName: 'Reasons', editable: true, width: 180 },
    { field: 'comments', headerName: 'Comments', editable: true, width: 180 },
    { field: 'grantedValue2', headerName: 'Granted Value', editable: true, width: 150 },
    { field: 'value', headerName: 'Value', editable: true, width: 120 },
    { field: 'attachments', headerName: 'Attachments', editable: true, width: 150 },
    { field: 'updatedBy', headerName: 'Updated by', editable: true, width: 150 },
    { field: 'updatedOn', headerName: 'Updated on', editable: true, width: 150 },
    { field: 'updatedTime', headerName: 'Updated time', editable: true, width: 150 },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleDeleteRow(params.row.id)}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      ),
    }
  ];

  // Column mapping from Excel to our table
  const columnMapping = {
    "Granted Date": "grantedDate",
    "Customer": "buyerName",
    "CI/ BAH Number": "invoiceNumber",
    "Granted Amount": "grantedValue",
    "LR Amount": "lrAmount",
    "Difference": "difference",
    // Other fields will be calculated or left blank
  };

  // Calculate age in days from granted date
  const calculateAging = (grantedDate) => {
    if (!grantedDate) return '';
    
    let date;
    // Check if the date is already a Date object or needs conversion
    if (grantedDate instanceof Date) {
      date = grantedDate;
    } else {
      // Try to convert from Excel date or string format
      date = new Date(grantedDate);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return '';
      }
    }
    
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays.toString();
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFile(file);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      
      // Get the range of the sheet
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      
      // Find header row (row 4, which is index 3 in 0-based indexing)
      const headerRowIndex = 3; 
      const headers = [];
      
      // Extract headers from row 4
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: headerRowIndex, c: C });
        const cell = worksheet[cellAddress];
        headers[C] = cell?.v || '';
      }

      // Process data rows (starting from row 5)
      const jsonData = [];
      for (let R = headerRowIndex + 1; R <= range.e.r; R++) {
        const row = {};
        let hasData = false;
        
        for (let C = range.s.c; C <= range.e.c; C++) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = worksheet[cellAddress];
          const headerText = headers[C];
          
          // Skip if no header or not in our mapping
          if (!headerText || !columnMapping[headerText]) continue;
          
          const fieldName = columnMapping[headerText];
          if (cell) {
            row[fieldName] = cell.v;
            hasData = true;
          } else {
            row[fieldName] = '';
          }
        }
        
        // Only add rows that have data
        if (hasData) {
          // Set ID for DataGrid
          row.id = nextId + jsonData.length;
          
          // Calculate aging based on granted date
          if (row.grantedDate) {
            row.aging = calculateAging(row.grantedDate);
          }
          
          // Set empty values for fields not present in Excel
          row.reasonCategory = row.reasonCategory || '';
          row.reasons = row.reasons || '';
          row.comments = row.comments || '';
          row.grantedValue2 = row.grantedValue2 || '';
          row.value = row.value || '';
          row.attachments = row.attachments || '';
          row.updatedBy = row.updatedBy || '';
          row.updatedOn = row.updatedOn || '';
          row.updatedTime = row.updatedTime || '';
          
          jsonData.push(row);
        }
      }
      
      setRows(jsonData);
      setNextId(nextId + jsonData.length);
      
      console.log("Excel data loaded into DataGrid", jsonData);
    } catch (error) {
      console.error("Error processing Excel file:", error);
      alert("Error processing the Excel file. Please check the format.");
    }
  };

  // Create a blank table with predefined columns
  const createBlankTable = () => {
    const emptyRows = Array(5).fill().map((_, index) => ({
      id: nextId + index,
      grantedDate: '',
      buyerName: '',
      invoiceNumber: '',
      grantedValue: '',
      lrAmount: '',
      difference: '',
      aging: '',
      reasonCategory: '',
      reasons: '',
      comments: '',
      grantedValue2: '',
      value: '',
      attachments: '',
      updatedBy: '',
      updatedOn: '',
      updatedTime: ''
    }));
    
    setRows(emptyRows);
    setNextId(nextId + 5);
    
    console.log("Created blank table with DataGrid");
  };

  // Add a new row to the table
  const handleAddRow = () => {
    setRows(prevRows => [
      ...prevRows, 
      {
        id: nextId,
        grantedDate: '',
        buyerName: '',
        invoiceNumber: '',
        grantedValue: '',
        lrAmount: '',
        difference: '',
        aging: '',
        reasonCategory: '',
        reasons: '',
        comments: '',
        grantedValue2: '',
        value: '',
        attachments: '',
        updatedBy: '',
        updatedOn: '',
        updatedTime: ''
      }
    ]);
    setNextId(nextId + 1);
  };

  // Delete a row from the table
  const handleDeleteRow = (id) => {
    setRows(rows.filter(row => row.id !== id));
  };

  // Handle cell edit
  const handleCellEdit = (params) => {
    const updatedRows = rows.map(row => {
      if (row.id === params.id) {
        // If granted date is updated, recalculate aging
        const updatedRow = { ...row, [params.field]: params.value };
        if (params.field === 'grantedDate') {
          updatedRow.aging = calculateAging(params.value);
        }
        return updatedRow;
      }
      return row;
    });
    setRows(updatedRows);
  };

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Upload Excel Sheet</h1>
        
        <div className="mb-6">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="mb-4 p-2 border border-gray-300 rounded"
          />
          <p className="text-sm text-gray-500 mb-2">
            Select an Excel file or create a blank table
          </p>
          <Button 
            variant="contained" 
            color="success" 
            onClick={createBlankTable}
            style={{ marginTop: '8px' }}
          >
            Create Empty Table
          </Button>
        </div>
        
        {/* Table row count info */}
        <div className="mb-4 text-sm text-gray-500">
          <p>Rows in table: {rows.length}</p>
        </div>
        
        {rows.length > 0 ? (
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              checkboxSelection={false}
              disableRowSelectionOnClick
              onCellEditStop={handleCellEdit}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddRow}
              style={{ marginTop: '16px' }}
            >
              Add Row
            </Button>
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-100 rounded">
            <p className="text-gray-500">Create a table for data entry</p>
            <p className="text-gray-400 text-sm mt-2">Click "Create Empty Table" above to get started</p>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadExcelSheet;
