import React, { useState } from 'react';   //1-5 lines is for the import of the libraries required
import * as XLSX from 'xlsx';
import Dropzone from 'react-dropzone';
import Plot from 'react-plotly.js';
import './App.css';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filteredData, setFilteredData] = useState(null); 

  const handleFileUpload = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.SheetNames[0];
      const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet]);


      const filteredData = excelData.filter((item) => !Object.values(item).every((value) => value === null));

      
      setFilteredData(filteredData);
    };
    reader.readAsArrayBuffer(file);
  };
  const renderCharts = () => {             // this is a function to filter the data of the uploaded file using react plotly.js
    if (filteredData) {
      const columns = Object.keys(filteredData[0]);
  
      const lineTraces = columns.map((column) => ({
        x: filteredData.map((item) => item[column]),
        y: filteredData.map((item) => item[column]),
        type: 'line',
        name: column,
      }));
  
      const scatterTraces = columns.map((column) => ({
        x: filteredData.map((item) => item[column]),
        y: filteredData.map((item) => item[column]),
        type: 'scatter',
        mode: 'lines+markers',
        name: column,
      }));
  
      const barTraces = columns.map((column) => ({
        x: columns,
        y: filteredData.map((item) => item[column]),
        type: 'bar',
        name: column,
      }));
  
      const pieTrace = {
        labels: columns,
        values: columns.map((column) => filteredData.length),
        type: 'pie',
        name: 'Pie Chart',
      };
  
      return (

        <div className="charts-container">       
            <div className="chart-item">
                 <h2>Bar Plot</h2>
                  <Plot data={barTraces} layout={{  barmode: 'group' }} />
            </div>
            <div className="chart-item">
            <h2>Pie Chart</h2>
            <Plot data={[pieTrace]} layout={{ title: 'Pie Chart' }} />
           </div>
            <div className="chart-item">
                <h2>Line plot</h2>
                <Plot data={lineTraces} layout={{  }} />
            </div>
  
          <div className="chart-item">
            <h2>Scatter Plot</h2>
            <Plot data={scatterTraces} layout={{ }} />
          </div>
  
          
  
          
        </div>
      );
    }
  }; 
  return (
    <div className="container">
      <h1 className="title">
      <span style={{ color: 'black' }}>Data Visualization Using -</span>
        <span style={{ color: 'red', border: '1px solid black', padding: '0 5px',backgroundColor: 'black'  }}>MERN</span>
      
      </h1>
      <Dropzone onDrop={handleFileUpload}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>upload your file over here.</p>
            {uploadedFile && <p className="file-info"><b>we are processing your file:</b>: {uploadedFile.name}</p>}
          </div>
        )}
      </Dropzone>
      {filteredData && renderCharts()}

    </div>
  );
}

export default App;