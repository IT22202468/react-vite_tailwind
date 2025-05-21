import React, { useState } from "react";
import * as XLSX from "xlsx";
import Navbar from "../components/Navbar";

const UploadExcelSheet = () => {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [description, setDescription] = useState([]);

  // Handle file upload and parse Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
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
            // Handle case where header might not be at row 0
            const header = Array.isArray(json[0]) ? json[0] : 
                          Object.keys(json[0] || {});
            
            // Create consistent table data structure
            let tableRows;
            if (Array.isArray(json[0])) {
              // Data is already in row format
              setColumns(json[0]);
              tableRows = json.slice(1);
            } else {
              // Data is in object format, convert to row format
              setColumns(header);
              tableRows = json.map(row => 
                header.map(col => row[col] || "")
              );
            }
            
            setTableData(tableRows);
            console.log("Set columns:", header);
            console.log("Set table data:", tableRows);
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

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Upload Excel Sheet</h1>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="mb-4 p-2 border border-gray-300 rounded"
        />
        
        {/* Debug info */}
        <div className="mb-4 text-sm text-gray-500">
          <p>Columns detected: {columns.length}</p>
          <p>Rows detected: {tableData.length}</p>
        </div>
        
        {columns.length > 0 ? (
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
        ) : (
          <div className="p-8 text-center bg-gray-100 rounded">
            <p className="text-gray-500">Please upload an Excel file with data to display</p>
            <p className="text-gray-400 text-sm mt-2">The file should contain a sheet named "Not uploaded" or any sheet with data</p>
          </div>
        )}
      </div>
    </>
  );
};

export default UploadExcelSheet;
