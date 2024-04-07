

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import React, { useState } from 'react';
function App()
{
  const [inputData, setInputData] = useState('');
  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState(null);

  const processData = async () =>
  {
    // if input data not json
    if (!isValidJSON(inputData)) {
      setError('Invalid JSON data');
      return;
    }

    function isValidJSON(text)
    {
      try
      {
        JSON.parse(text);
        return true;
      } catch (error)
      {
        return false;
      }
    }
    setError(null);
    const data = new FormData();
    const jsonBlob = new Blob([inputData], { type: "application/json" });
    data.append("json", jsonBlob);

    try
    {
      const resp = await fetch("http://localhost:3000/transactions/upload-json", {
        method: "POST",
        body: data,
      });

      if (!resp.ok)
      {
        const err = new Error("Response wasn't okay");
        err.resp = resp;
        throw err;
      }

      const response = await resp.json(); // await here to get the JSON data

      const chunkedArray = [];
      for (let i = 0; i < response.data.length; i += 50)
      {
        chunkedArray.push(response.data.slice(i, i + 50));
      }
      setRowData(response.data);
      setInputData('')
    } catch (err)
    {
      console.error(err);
    }
  };
  

  const handleInputChange = (event) =>
  {
    setInputData(event.target.value);
  };

  const columnDefs = [
    { headerName: 'Transaction',suppressSizeToFit: false, field: 'transaction', width: 200 },
    {
      headerName: 'Transformations',suppressSizeToFit: false, field: 'transformations', width: 500, cellRenderer: params => {
        const array = params.data.transformations;
        return array.map(item => `[PartNum: ${item.partNum} - Size:${item.size} Qty: ${item.qty}]`).join(', \n');
      }
    },
    { headerName: 'Balance',suppressSizeToFit: false, field: 'balance', width: 100 },
    { headerName: 'IsValid',suppressSizeToFit: false, field: 'isValid', width: 100 },
    { headerName: 'Error Reason',suppressSizeToFit: false, field: 'errorReason', width: 300, cellRenderer: params => params.value.join(', \n') }
  ];
  
  function formatArrayData(params)
  {
    // Extract the array from the rowData
    const arrayData = params.data.transformations;

    // Format the array data as a string
    const formattedData = arrayData.map(item => `[PartNum: ${item.partNum} - Size:${item.size} Qty: ${item.qty}]`);

    return formattedData;
  }
  return (
    <div className='max-w-7xl mx-auto'>
      <h1 className="text-3xl font-bold">Input JSON Data</h1>
      <textarea
        value={inputData}
        onChange={handleInputChange}
        className="w-full h-40 border border-gray-300 p-2 mb-4"
        placeholder="Enter JSON data here..."
      />
      <button
        onClick={processData}
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-6"
      >
        Process
      </button>
      {error && (
        <div className="bg-red-100  mb-6 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {rowData && (
        <div className="ag-theme-alpine" style={{ height: '800px', width: '100%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            >
            {/* Define your columns here */}
          </AgGridReact>
        </div>
      )}
    </div>
  );
}

export default App;
