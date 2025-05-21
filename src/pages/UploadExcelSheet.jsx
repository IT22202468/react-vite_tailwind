import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Navbar from "../components/Navbar";

const UploadExcelSheet = () => {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [description, setDescription] = useState([]);
  const [file, setFile] = useState(null);

  // Column mapping from Excel to desired table headers
  const columnMapping = {
    "Granted Date": "Granted Date",
    "Customer": "Buyer name",
    "CI/ BAH Number": "Invoice Number",
    "Granted Amount": "Granted Value",
    "LR Amount": "LR Amount",
    "Difference": "Difference",
  };

  // Additional columns that need to be calculated or added manually
  const additionalColumns = [
    "Aging",
    "Reason Category",
    "Reasons",
    "Comments",
    "Granted Value",
    "Value",
    "Attachments",
    "Updated by",
    "Updated on", 
    "Updated time"
  ];

  // Calculate days between today and granted date
  const calculateAging = (grantedDateStr) => {
    if (!grantedDateStr) return "";
    
    try {
      // Try to parse the date (handle different formats)
      let grantedDate;
      
      // Check if it's an Excel serial number
      if (typeof grantedDateStr === 'number') {
        grantedDate = XLSX.SSF.parse_date_code(grantedDateStr);
        grantedDate = new Date(grantedDate.y, grantedDate.m - 1, grantedDate.d);
      } else {
        // Try to parse as string date
        grantedDate = new Date(grantedDateStr);
      }
      
      if (isNaN(grantedDate.getTime())) {
        return "Invalid date";
      }
      
      const today = new Date();
      const diffTime = Math.abs(today - grantedDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays.toString();
    } catch (e) {
      console.error("Error calculating aging for", grantedDateStr, e);
      return "Error";
    }
  };

  // Handle file upload and parse Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFile(file);
  };

  // Create a blank table with predefined columns instead of filling from Excel
  const createBlankTable = () => {
    // Define all columns we want in our table
    const tableColumns = [
      "Granted Date",
      "Buyer name",
      "Invoice Number",
      "Granted Value",
      "LR Amount",
      "Difference",
      "Aging",
      "Reason Category",
      "Reasons",
      "Comments",
      "Granted Value",
      "Value",
      "Attachments",
      "Updated by",
      "Updated on",
      "Updated time"
    ];
    
    // Set the columns
    setColumns(tableColumns);
    
    // Create empty rows (let's start with 5 blank rows)
    const emptyRows = Array(5).fill().map(() => Array(tableColumns.length).fill(""));
    setTableData(emptyRows);
    
    console.log("Created blank table with predefined columns");
  };

  // Process file whenever it changes - just create blank table instead of parsing Excel
  useEffect(() => {
    if (!file) return;
    
    // Show file being processed
    console.log("File selected:", file.name);
    
    // Instead of parsing the Excel file, just create a blank table
    createBlankTable();
    
    // For UX feedback, we'll still show that the file was "processed"
    setTimeout(() => {
      alert("Table ready for data entry");
    }, 500);
    
  }, [file]);

  // Handle cell edit
  const handleCellChange = (rowIdx, colIdx, value) => {
    setTableData((prev) => {
      const updated = prev.map((row, r) =>
        r === rowIdx ? row.map((cell, c) => (c === colIdx ? value : cell)) : row
      );
      return updated;
    });
  };
  
  // Add a new row to the table
  const addRow = () => {
    setTableData(prev => [...prev, Array(columns.length).fill("")]);
  };
  
  // Remove a row from the table
  const removeRow = (rowIdx) => {
    setTableData(prev => prev.filter((_, idx) => idx !== rowIdx));
  };

  // Render function for the table UI with add row button (remove resizable columns)
  const renderTable = () => {
    return (
      <>
        <div className="overflow-x-auto border rounded shadow">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                {columns.map((col, idx) => (
                  <th key={idx} className="border px-4 py-2 text-left">
                    {col || `Column ${idx+1}`}
                  </th>
                ))}
                <th className="border px-2 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 ? (
                tableData.map((row, rowIdx) => (
                  <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    {columns.map((_, colIdx) => (
                      <td key={colIdx} className="border px-4 py-2">
                        <input
                          className="w-full bg-transparent outline-none focus:bg-blue-50 p-1"
                          value={row[colIdx] !== undefined ? row[colIdx] : ""}
                          onChange={e =>
                            handleCellChange(rowIdx, colIdx, e.target.value)
                          }
                        />
                      </td>
                    ))}
                    <td className="border px-2 py-2 text-center">
                      <button
                        onClick={() => removeRow(rowIdx)}
                        className="bg-red-500 text-white p-1 rounded hover:bg-red-600 focus:outline-none"
                        title="Remove Row"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="border px-4 py-2 text-center text-gray-500">
                    No data in table
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <button 
          onClick={addRow} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Row
        </button>
      </>
    );
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
          <p className="text-sm text-gray-500">
            Select an Excel file (the table will be created with empty rows for manual data entry)
          </p>
          <button 
            onClick={createBlankTable} 
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create Empty Table
          </button>
        </div>
        
        {/* Table row count info */}
        <div className="mb-4 text-sm text-gray-500">
          <p>Rows in table: {tableData.length}</p>
        </div>
        
        {columns.length > 0 ? (
          renderTable()
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
