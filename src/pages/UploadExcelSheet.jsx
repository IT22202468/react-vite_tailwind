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

  // Process file whenever it changes
  useEffect(() => {
    if (!file) return;
    
    // Show file being processed
    console.log("Processing file:", file.name);
    
    const reader = new FileReader();
    
    // Add error handling for the reader
    reader.onerror = () => {
      console.error("FileReader error:", reader.error);
      alert("Error reading file. Please try again.");
    };
    
    reader.onload = (evt) => {
      try {
        const data = evt.target.result;
        console.log("File loaded, parsing with XLSX...");
        
        // Try different parsing options
        let workbook;
        try {
          workbook = XLSX.read(data, { type: "array" });
        } catch (e) {
          console.error("Error with array type, trying binary", e);
          workbook = XLSX.read(data, { type: "binary" });
        }
        
        if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
          console.error("No sheets found in workbook");
          alert("No data found in Excel file.");
          return;
        }
        
        console.log("Available sheets:", workbook.SheetNames);
        
        // Get first sheet if 'Not uploaded' not found
        const targetSheets = ["Not uploaded", "Sheet1", ""];
        let sheetName = null;
        
        for (const target of targetSheets) {
          sheetName = workbook.SheetNames.find(
            name => name.toLowerCase() === target.toLowerCase()
          );
          if (sheetName) break;
        }
        
        // Fallback to first sheet
        if (!sheetName && workbook.SheetNames.length > 0) {
          sheetName = workbook.SheetNames[0];
        }
        
        console.log("Using sheet:", sheetName);
        const sheet = workbook.Sheets[sheetName];
        
        if (sheet) {
          // Try with different options if default fails
          let json;
          try {
            json = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
          } catch (e) {
            console.error("Error with default options, trying simpler version", e);
            json = XLSX.utils.sheet_to_json(sheet, { raw: true });
          }
          
          console.log("Parsed data:", json);
          
          if (json && json.length > 0) {
            // Process data with column mapping
            processExcelData(json);
          } else {
            console.warn("Sheet is empty or parsing failed");
            alert("No data found in selected sheet.");
          }
        } else {
          console.error("Sheet not found");
          alert("Selected sheet not found in Excel file.");
        }

        // Get 'Description' sheet
        const descSheetName = workbook.SheetNames.find(
          name => name.toLowerCase() === "description"
        );
        if (descSheetName) {
          const descSheet = workbook.Sheets[descSheetName];
          const descJson = XLSX.utils.sheet_to_json(descSheet, { header: 1 });
          setDescription(descJson);
          console.log("Description data:", descJson);
        }
      } catch (err) {
        console.error("Error processing Excel file:", err);
        alert("Error processing Excel file. Please check file format.");
      }
    };
    
    try {
      // Try both methods for better compatibility
      reader.readAsArrayBuffer(file);
    } catch (e) {
      console.error("Error with ArrayBuffer, falling back to binary string", e);
      reader.readAsBinaryString(file);
    }
  }, [file]);

  // Process Excel data with column mapping
  const processExcelData = (excelData) => {
    if (!Array.isArray(excelData) || excelData.length === 0) return;
    
    // Handle data based on format (array of arrays or array of objects)
    let headerRow, dataRows;
    
    if (Array.isArray(excelData[0])) {
      // Format is array of arrays
      headerRow = excelData[0];
      dataRows = excelData.slice(1);
    } else {
      // Format is array of objects
      headerRow = Object.keys(excelData[0]);
      dataRows = excelData.map(row => headerRow.map(key => row[key] || ""));
    }
    
    console.log("Original headers:", headerRow);
    
    // Create the target column headers according to the mapping
    const targetHeaders = Object.values(columnMapping).concat(additionalColumns);
    setColumns(targetHeaders);
    console.log("Mapped headers:", targetHeaders);
    
    // Map the data to the new structure
    const mappedData = dataRows.map(row => {
      // Create an object with the original column values
      const originalRowObj = {};
      headerRow.forEach((header, idx) => {
        originalRowObj[header] = row[idx];
      });
      
      // Map to the new structure
      const newRow = [];
      
      // Add mapped columns first - using the mapping configuration
      Object.keys(columnMapping).forEach(excelCol => {
        // Find the index of the Excel column in the header
        const colIndex = headerRow.findIndex(h => 
          h.toLowerCase() === excelCol.toLowerCase() || 
          h.toLowerCase().includes(excelCol.toLowerCase())
        );
        
        if (colIndex !== -1) {
          newRow.push(row[colIndex]);
        } else {
          // If column not found by direct match, try to find similar column names
          const similarColIndex = headerRow.findIndex(h => 
            h.toLowerCase().includes(excelCol.split(" ")[0].toLowerCase())
          );
          
          if (similarColIndex !== -1) {
            newRow.push(row[similarColIndex]);
          } else {
            newRow.push(""); // No matching column found
          }
        }
      });
      
      // Calculate Aging for each row
      const grantedDateColIndex = headerRow.findIndex(h => 
        h.toLowerCase() === "granted date" || 
        h.toLowerCase().includes("granted") && h.toLowerCase().includes("date")
      );
      const grantedDate = grantedDateColIndex !== -1 ? row[grantedDateColIndex] : "";
      const aging = calculateAging(grantedDate);
      
      // Add additional columns with placeholders or calculated values
      newRow.push(aging); // Aging (calculated)
      
      // Add all other additional columns
      for (let i = 1; i < additionalColumns.length; i++) {
        newRow.push(""); // Empty placeholders for manual input
      }
      
      return newRow;
    });
    
    setTableData(mappedData);
    console.log("Mapped data:", mappedData);
  };

  // Handle cell edit
  const handleCellChange = (rowIdx, colIdx, value) => {
    setTableData((prev) => {
      const updated = prev.map((row, r) =>
        r === rowIdx ? row.map((cell, c) => (c === colIdx ? value : cell)) : row
      );
      return updated;
    });
  };

  // Render function for the table UI
  const renderTable = () => {
    return (
      <div className="overflow-x-auto border rounded shadow">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              {columns.map((col, idx) => (
                <th key={idx} className="border px-4 py-2 text-left">{col || `Column ${idx+1}`}</th>
              ))}
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="border px-4 py-2 text-center text-gray-500">
                  No data found in the sheet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
            Upload an Excel file with columns: Granted Date, Customer, CI/ BAH Number, Granted Amount, LR Amount, Difference
          </p>
        </div>
        
        {/* Debug info */}
        <div className="mb-4 text-sm text-gray-500">
          <p>Columns detected: {columns.length}</p>
          <p>Rows detected: {tableData.length}</p>
        </div>
        
        {columns.length > 0 ? (
          renderTable()
        ) : (
          <div className="p-8 text-center bg-gray-100 rounded">
            <p className="text-gray-500">Please upload an Excel file with data to display</p>
            <p className="text-gray-400 text-sm mt-2">The file should contain the required columns listed above</p>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadExcelSheet;
