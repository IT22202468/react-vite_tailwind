import React from "react";
import Navbar from "../components/Navbar";
import ReasonAnalysisChart from "../components/ReasonAnalysisChart";

const GraphicalData = () => {
  return (
    <>
      <Navbar />
      <div className="p-8">
        <h2 className="text-2xl mb-4">Graphical Data</h2>
        <ReasonAnalysisChart />
      </div>
    </>
  );
};

export default GraphicalData;
