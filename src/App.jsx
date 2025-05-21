import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Login from "./components/Login";
import Register from "./components/Register";
import AdminPage from "./pages/AdminPage";
import Dashboard from "./pages/dashboard";
import UploadExcelSheet from "./pages/UploadExcelSheet";
import GraphicalData from "./pages/GraphicalData";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload-excel" element={<UploadExcelSheet />} />
        <Route path="/graphical-data" element={<GraphicalData />} />
      </Routes>
    </Router>
  )
}

export default App
