import React from "react";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, Select, MenuItem, FormControl, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DescriptionIcon from '@mui/icons-material/Description';

const reasonOptions = [
  "R&Q", 
  "ARU", 
  "ARU & R&Q", 
  "Rounding off", 
  "Changes in Invoice reference", 
  "Partial Granting"
];

const ExcelDataTable = ({
  rows,
  setRows,
  nextId,
  setNextId,
  attachments,
  setAttachments,
  calculateAging,
  calculateDifference
}) => {
  // Handle change for reason dropdown
  const handleReasonChange = (id, value) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        return { ...row, reasons: value };
      }
      return row;
    }));
  };

  // Handle attachment upload
  const handleAttachmentUpload = (event, rowId) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setAttachments(prev => ({
        ...prev,
        [rowId]: [...(prev[rowId] || []), ...files]
      }));
      setRows(rows.map(row => {
        if (row.id === rowId) {
          return { ...row, attachments: `${files.length} file(s)` };
        }
        return row;
      }));
    }
  };

  // Handle viewing of attachments
  const handleViewAttachment = (rowId) => {
    const files = attachments[rowId];
    if (!files || files.length === 0) return;
    alert(`Attached files:\n${files.map(file => `- ${file.name} (${(file.size/1024).toFixed(2)} KB)`).join('\n')}`);
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
    if (attachments[id]) {
      const updatedAttachments = { ...attachments };
      delete updatedAttachments[id];
      setAttachments(updatedAttachments);
    }
  };

  // Handle cell edit
  const handleCellEdit = (params) => {
    const updatedRows = rows.map(row => {
      if (row.id === params.id) {
        const updatedRow = { ...row, [params.field]: params.value };
        if (params.field === 'grantedDate') {
          updatedRow.aging = calculateAging(params.value);
        }
        if (params.field === 'grantedValue' || params.field === 'lrAmount') {
          updatedRow.difference = calculateDifference(
            params.field === 'grantedValue' ? params.value : row.grantedValue,
            params.field === 'lrAmount' ? params.value : row.lrAmount
          );
        }
        return updatedRow;
      }
      return row;
    });
    setRows(updatedRows);
  };

  const columns = [
    { field: 'grantedDate', headerName: 'Granted Date', editable: true, minWidth: 130 },
    { field: 'buyerName', headerName: 'Buyer name', editable: true, minWidth: 180 },
    { field: 'invoiceNumber', headerName: 'Invoice Number', editable: true, minWidth: 170 },
    { field: 'grantedValue', headerName: 'Granted Value', editable: true, minWidth: 130 },
    { field: 'lrAmount', headerName: 'LR Amount', editable: true, minWidth: 130 },
    { field: 'difference', headerName: 'Difference', editable: true, minWidth: 130 },
    { field: 'aging', headerName: 'Aging', editable: true, minWidth: 100 },
    { field: 'reasonCategory', headerName: 'Reason Category', editable: true, minWidth: 150 },
    { 
      field: 'reasons', 
      headerName: 'Reasons', 
      minWidth: 200, 
      editable: false,
      renderCell: (params) => (
        <FormControl fullWidth size="small">
          <Select
            value={params.value || ''}
            onChange={(e) => handleReasonChange(params.row.id, e.target.value)}
            displayEmpty
            sx={{ height: 35, fontSize: '0.875rem' }}
          >
            <MenuItem value="" disabled><em>Select reason</em></MenuItem>
            {reasonOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )
    },
    { field: 'comments', headerName: 'Comments', editable: true, minWidth: 200 },
    { field: 'value', headerName: 'Value', editable: true, minWidth: 120 },
    { 
      field: 'attachments', 
      headerName: 'Attachments', 
      minWidth: 150,
      editable: false,
      renderCell: (params) => {
        const rowId = params.row.id;
        const hasAttachment = attachments[rowId] && attachments[rowId].length > 0;
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {hasAttachment ? (
              <Tooltip title={attachments[rowId].map(file => file.name).join(', ')}>
                <IconButton 
                  color="primary" 
                  aria-label="view attachments"
                  size="small"
                  onClick={() => handleViewAttachment(rowId)}
                >
                  <DescriptionIcon />
                  <span style={{ marginLeft: 5, fontSize: '0.75rem' }}>
                    {attachments[rowId].length}
                  </span>
                </IconButton>
              </Tooltip>
            ) : (
              <div>
                <input
                  type="file"
                  id={`attachment-upload-${rowId}`}
                  multiple
                  onChange={(e) => handleAttachmentUpload(e, rowId)}
                  style={{ display: 'none' }}
                />
                <label htmlFor={`attachment-upload-${rowId}`}>
                  <IconButton 
                    component="span" 
                    color="primary" 
                    aria-label="upload attachment"
                    size="small"
                  >
                    <AttachFileIcon />
                  </IconButton>
                </label>
              </div>
            )}
          </div>
        );
      }
    },
    { field: 'updatedBy', headerName: 'Updated by', editable: true, minWidth: 150 },
    { field: 'updatedOn', headerName: 'Updated on', editable: true, minWidth: 150 },
    { field: 'updatedTime', headerName: 'Updated time', editable: true, minWidth: 150 },
    { 
      field: 'actions', 
      headerName: 'Actions', 
      minWidth: 110,
      editable: false,
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

  if (rows.length === 0) {
    return (
      <div className="p-8 text-center bg-gray-100 rounded">
        <p className="text-gray-500">Create a table for data entry</p>
        <p className="text-gray-400 text-sm mt-2">Click "Create Empty Table" above to get started</p>
      </div>
    );
  }

  return (
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
        slots={{
          toolbar: GridToolbar,
        }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        columnVisibilityModel={{}}
        columnResizeMode="onChange"
        sx={{
          '& .MuiDataGrid-columnHeader': {
            backgroundColor: '#f5f5f5',
          },
          '& .MuiDataGrid-cell': {
            padding: '8px',
          },
          '& .MuiDataGrid-columnSeparator': {
            visibility: 'visible',
          },
        }}
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
  );
};

export default ExcelDataTable;
