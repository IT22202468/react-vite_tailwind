import React, { useState } from "react";
import * as XLSX from "xlsx";
import Navbar from "../components/Navbar";
import { Button } from '@mui/material';
import ExcelDataTable from "../components/ExcelDataTable";

const UploadExcelSheet = () => {
  const [rows, setRows] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [file, setFile] = useState(null);
  const [attachments, setAttachments] = useState({});

  // Define reason options for dropdown
  const reasonOptions = [
    "R&Q", 
    "ARU", 
    "ARU & R&Q", 
    "Rounding off", 
    "Changes in Invoice reference", 
    "Partial Granting"
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

  // Helper function to convert Excel serial date to JavaScript Date
  const excelDateToJSDate = (excelDate) => {
    // Excel dates are number of days since 1/1/1900
    if (typeof excelDate === 'number') {
      // Use a more direct approach to handle Excel dates
      // The extra +1 accounts for the timezone difference when constructing date objects
      const year = Math.floor((excelDate - 1) / 365.25) + 1900;
      let remainingDays = Math.floor(excelDate - 1 - ((year - 1900) * 365.25));

      // Account for Excel leap year bug
      if (excelDate > 60) {
        remainingDays += 1; // Add a day to offset the non-existent 2/29/1900 in Excel
      }

      // Use UTC methods to avoid timezone issues
      const baseDate = new Date(Date.UTC(1900, 0, 0));
      const resultDate = new Date(baseDate);
      resultDate.setUTCDate(baseDate.getUTCDate() + excelDate);

      // Format the date
      const month = resultDate.getUTCMonth() + 1; // months are 0-based
      const day = resultDate.getUTCDate();
      const fullYear = resultDate.getUTCFullYear();
      
      return `${month}/${day}/${fullYear}`;
    }
    // If it's already a string or we couldn't convert, return as is
    return excelDate;
  };

  // Calculate age in days from granted date
  const calculateAging = (grantedDate) => {
    if (!grantedDate) return '';
    
    let dateStr, date;
    
    if (typeof grantedDate === 'number') {
      // Convert Excel date to JS date string first
      dateStr = excelDateToJSDate(grantedDate);
      // Parse the resulting string
      const [month, day, year] = dateStr.split('/').map(Number);
      date = new Date(year, month - 1, day); // month is 0-indexed in JS Date
    } else if (typeof grantedDate === 'string') {
      // Try to parse the string date
      date = new Date(grantedDate);
    } else if (grantedDate instanceof Date) {
      date = grantedDate;
    } else {
      return '';
    }
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return '';
    }
    
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays.toString();
  };

  // Helper function to calculate difference between granted value and LR amount
  const calculateDifference = (grantedValue, lrAmount) => {
    // Convert to numbers and handle empty or non-numeric values
    const grantedNum = parseFloat(grantedValue) || 0;
    const lrNum = parseFloat(lrAmount) || 0;
    
    // Calculate difference
    return (grantedNum - lrNum).toFixed(2);
  };

  // Handle change for reason dropdown
  const handleReasonChange = (id, value) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        return { ...row, reasons: value };
      }
      return row;
    }));
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
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      const headerRowIndex = 3; 
      const headers = [];
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellAddress = XLSX.utils.encode_cell({ r: headerRowIndex, c: C });
        const cell = worksheet[cellAddress];
        headers[C] = cell?.v || '';
      }
      const jsonData = [];
      for (let R = headerRowIndex + 1; R <= range.e.r; R++) {
        const row = {};
        let hasData = false;
        for (let C = range.s.c; C <= range.e.c; C++) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = worksheet[cellAddress];
          const headerText = headers[C];
          if (!headerText || !columnMapping[headerText]) continue;
          const fieldName = columnMapping[headerText];
          if (cell) {
            if (fieldName === 'grantedDate') {
              if (cell.t === 'n') {
                row[fieldName] = excelDateToJSDate(cell.v);
              } else {
                row[fieldName] = cell.v;
              }
            } else {
              row[fieldName] = cell.v;
            }
            hasData = true;
          } else {
            row[fieldName] = '';
          }
        }
        if (hasData) {
          row.id = nextId + jsonData.length;
          if (row.grantedDate) {
            row.aging = calculateAging(row.grantedDate);
          }
          if (row.grantedValue !== undefined && row.lrAmount !== undefined) {
            row.difference = calculateDifference(row.grantedValue, row.lrAmount);
          }
          row.reasonCategory = row.reasonCategory || '';
          row.reasons = row.reasons || '';
          row.comments = row.comments || '';
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
      setAttachments({});
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
      value: '',
      attachments: '',
      updatedBy: '',
      updatedOn: '',
      updatedTime: ''
    }));
    
    setRows(emptyRows);
    setNextId(nextId + 5);
    setAttachments({});
  };

  // Pass all table-related state and handlers to ExcelDataTable
  return (
    <>
      <Navbar />
      <div className="p-8">
        <h2 className="text-2xl mb-4">Upload Excel Sheet</h2>
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
        <div className="mb-4 text-sm text-gray-500">
          <p>Rows in table: {rows.length}</p>
        </div>
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
      </div>
    </>
  );
};

export default UploadExcelSheet;

