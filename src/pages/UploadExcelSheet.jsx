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

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFile(file);
    // For immediate feedback
    setTimeout(() => {
      createBlankTable();
    }, 100);
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
    const updatedRows = rows.map(row => 
      row.id === params.id ? { ...row, [params.field]: params.value } : row
    );
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
