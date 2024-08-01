import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Navbar from '../Navbar_Live';
import '../../styles/live.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx'; // Importing the XLSX library
import { useNavigate } from 'react-router-dom';
import { setPageStatus } from '../../redux/reducers/stockSlice';

const Historical_Reverse = () => {
  const globeStatus = useSelector((state) => state.stockData.pageStatus);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCriteria, setFilterCriteria] = useState({ column: '', from: '', to: '' });

  const fetchData = () => {
    axios.get('http://127.0.0.1:5000/history-reverse')
      .then((res) => {
        setData(res.data); // Corrected this line
        // dispatch(setAllData(res.data))
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    // Fetch data immediately
    fetchData();
    dispatch(setPageStatus("history_reverse"))
    // Set up interval to fetch data every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle null values
        if (aValue === null && bValue !== null) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        if (aValue !== null && bValue === null) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue === null && bValue === null) {
          return 0;
        }

        // Handle non-null values
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const processedData = React.useMemo(() => {
    let filtered = [...sortedData]; // Use sortedData to maintain sorting

    if (searchTerm) {
      filtered = filtered.filter(item => item[1].toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (filterCriteria.column && filterCriteria.from && filterCriteria.to) {
      const columnIndex = parseInt(filterCriteria.column);
      filtered = filtered.filter(item => {
        const value = parseFloat(item[columnIndex]);
        const from = parseFloat(filterCriteria.from);
        const to = parseFloat(filterCriteria.to);
        return value >= from && value <= to;
      });
    }

    return filtered;
  }, [sortedData, searchTerm, filterCriteria]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCriteria(prev => ({ ...prev, [name]: value }));
  };
  

  // Calculate totals and sums
  const totals = processedData.reduce((acc, item) => {
    const nullStatus = (item[5] == null && item[7] == null) ? parseFloat(item[9]) - parseFloat(item[3]) : 0;
    acc.totalCompanies += 1;
    acc.totalProfit += item[5] ? 1 : 0; // Assuming column 5 is Profit 1%
    acc.totalLoss += item[7] ? 1 : 0; // Assuming column 7 is Stop Loss
    acc.totalOpenPrice += parseFloat(item[2]) || 0; // Assuming column 2 is Open Price
    acc.totalEntryPrice += parseFloat(item[3]) || 0;
    acc.totalProfitPrice += parseFloat(item[5]) || 0;
    acc.totalClosePrice += parseFloat(item[9]) || 0; // Assuming column 9 is Closing Price
    acc.totalStopPrice += parseFloat(item[7]) || 0; // Assuming column 7 is Stop Loss
    acc.totalEntryVol += parseFloat(item[11]) || 0; // Assuming column 11 is Entry Volume
    acc.totalYesterdayVol += parseFloat(item[12]) || 0; // Assuming column 12 is Yesterday Volume
    acc.totalAvg += parseFloat(item[13]) || 0; // Assuming column 13 is Average
    acc.profitValue=acc.totalProfitPrice/101
    acc.lossValue=acc.totalStopPrice/99
    if (nullStatus !== 0) {
      acc.nullTotal += nullStatus;
      if (nullStatus > 0) {
        acc.positiveCount += 1;
      } else {
        acc.negativeCount += 1;
      }
    }
    item.nullStatus = nullStatus; // Add nullStatus to each item
    return acc;
  }, {
    totalCompanies: 0,
    totalProfit: 0,
    totalLoss: 0,
    totalOpenPrice: 0,
    totalEntryPrice:0,
    totalProfitPrice:0,
    totalClosePrice: 0,
    totalStopPrice: 0,
    totalEntryVol: 0,
    totalYesterdayVol: 0,
    totalAvg: 0,
    nullTotal: 0,
    positiveCount: 0,
    negativeCount: 0,
    profitValue: 0,
    lossValue: 0,

  });

  totals.totalNull = totals.totalCompanies - totals.totalProfit - totals.totalLoss;
 
  const getCurrentDateTime = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    hours = String(hours).padStart(2, '0');

    return `${day}-${month}-${year}`;
  };

  const generatePDF = () => {
    const input = document.getElementById('table-to-pdf');
    
    // Adjust the scale to fit more data in a single page
    html2canvas(input, { scale: 2, useCORS: true, logging: true })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0); // Ensure high quality
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
  
        let imgHeight = (pdfWidth / canvasWidth) * canvasHeight;
        let heightLeft = imgHeight;
        let position = 0;
  
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
  
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;
        }
  
        pdf.save(`Historical_Reverse_${getCurrentDateTime()}.pdf`);
      })
      .catch((error) => {
        console.error("Error generating PDF: ", error);
      });
  };
    

  const generateExcel = () => {
    const wb = XLSX.utils.book_new();

    // Add summary sheet
    const summaryData = [
      ['Total Companies', 'No.of Profit', 'No.of Loss', 'No.of Null', 'Open_Price Total', 'Close_Price Total', 'Stop_Price Total', 'Entry_Vol Total', 'Yesterday_Vol Total', 'Avg Total', 'Null_Total', 'Positive', 'Negative'],
      [totals.totalCompanies, totals.totalProfit, totals.totalLoss, totals.totalNull, totals.totalOpenPrice.toFixed(2), totals.totalClosePrice.toFixed(2), totals.totalStopPrice.toFixed(2), totals.totalEntryVol.toFixed(2), totals.totalYesterdayVol.toFixed(2), totals.totalAvg.toFixed(2), totals.nullTotal.toFixed(2), totals.positiveCount, totals.negativeCount]
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

    // Add data sheet
    const dataHeader = ['Company Name', 'Open Price', 'Entry Price', 'Entry Time', 'Profit 1%', 'Achieved Time', 'Stop Loss', 'Loss Time', 'Closing Price', 'Closing Time', 'Entry Volume', 'Yesterday Volume', 'Average', 'Null Status'];
    const dataBody = sortedData.map(item => [
      item[1], item[2], item[3], item[4], item[5], item[6], item[7], item[8], item[9], item[10], item[11], item[12], item[13], item.nullStatus.toFixed(2)
    ]);
    const wsData = XLSX.utils.aoa_to_sheet([dataHeader, ...dataBody]);
    XLSX.utils.book_append_sheet(wb, wsData, 'Data');

    // Save to file
    XLSX.writeFile(wb, `Historical_Reverse_${getCurrentDateTime()}.xlsx`);
  };

  // Function to determine row class
  const getRowClass = (item) => {
    if (item[5] != null) {
      return 'table-success'; // Bootstrap class for green background
    }
    if (item[7] != null) {
      return 'table-danger'; // Bootstrap class for red background
    }
    return '';
  };

  const clearTable = () => {
    let formData = new FormData();
    formData.append("request", "history-reverse");
    axios.post('http://127.0.0.1:5000/clear-table',formData)
      .then((res) => {
        console.log("Response from server:", res);
        fetchData(); // Corrected this line
        alert("Table Cleared");
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }

  
  return (
    <>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"10px"}}>
          <Button type='button' variant='danger' onClick={generatePDF}>Download As PDF</Button>
          <Button type='button' variant='success' onClick={generateExcel}>Download As Excel</Button>
          <Button type='button' variant='danger' onClick={()=>clearTable()}>Clear Table</Button>
          {globeStatus=="history_forward"?<Button type='button' variant='outline-dark' onClick={()=>dispatch(setPageStatus("history_reverse"))}>Reverse Datas</Button>:<Button type='button' variant='outline-primary' onClick={()=>dispatch(setPageStatus("history_forward"))}>Forward Datas</Button>}
        </div>
        <br />
        <hr></hr>
        <div id="filters" style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
          <h3>Filters</h3>
        </div>
        <div>
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search By Company Name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Form.Select
            aria-label="Default select example"
            name="column"
            value={filterCriteria.column}
            onChange={handleFilterChange}
          >
            <option>Filter By</option>
            <option value="2">Open Price</option>
            <option value="3">Entry Price</option>
            <option value="4">Entry Time</option>
            <option value="5">Profit 1%</option>
            <option value="6">Achieved Time</option>
            <option value="7">Stop Loss</option>
            <option value="8">Loss Time</option>
            <option value="9">Closing Price</option>
            <option value="10">Closing Time</option>
            <option value="11">Entry Volume</option>
            <option value="12">Yesterday Volume</option>
            <option value="13">Average</option>
            <option value="nullStatus">Null Status</option>
          </Form.Select>
          <Form.Control
            aria-label="From"
            placeholder='From'
            name="from"
            value={filterCriteria.from}
            onChange={handleFilterChange}
          />
          <Form.Control
            aria-label="To"
            placeholder='To'
            name="to"
            value={filterCriteria.to}
            onChange={handleFilterChange}
          />
        </InputGroup>
        </div>
        <div id="table-to-pdf" className="square border border-dark"> 
          <Table bordered responsive hover variant="dark">
            <thead>
              <tr>
                <th>Total Companies</th>
                <th>No.of Profit</th>
                <th>No.of Loss</th>
                <th>No.of Null</th>
                <th>Open_Price Total</th>
                <th>Entry_Price Total</th>
                <th>Profit Total</th>
                <th>Stop_Price Total</th>
                <th>Close_Price Total</th>
                <th>Entry_Vol Total</th>
                <th>Yesterday_Vol Total</th>
                <th>Avg Total</th>
                <th>Null_Total</th>
                <th>Positive</th>
                <th>Negative</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{totals.totalCompanies}</td>
                <td>{totals.totalProfit}  [<b>P.V : {totals.profitValue.toFixed(2)}</b>]</td>
                <td>{totals.totalLoss}  [<b>L.V : {totals.lossValue.toFixed(2)}</b>]</td>
                <td>{totals.totalNull}</td>
                <td>{totals.totalOpenPrice.toFixed(2)}</td>
                <td>{totals.totalEntryPrice.toFixed(2)}</td>
                <td>{totals.totalProfitPrice.toFixed(2)}</td>
                <td>{totals.totalStopPrice.toFixed(2)}</td>
                <td>{totals.totalClosePrice.toFixed(2)}</td>
                <td>{totals.totalEntryVol.toFixed(2)}</td>
                <td>{totals.totalYesterdayVol.toFixed(2)}</td>
                <td>{totals.totalAvg.toFixed(2)}</td>
                <td>{totals.nullTotal.toFixed(2)}</td>
                <td>{totals.positiveCount}</td>
                <td>{totals.negativeCount}</td>
              </tr>
            </tbody>
          </Table>
          <Table bordered hover responsive className="table">
            <thead>
              <tr>
                <th>No's</th>
                <th onClick={() => handleSort(1)}>Company Name {sortConfig.key === 1 ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}</th>
                <th onClick={() => handleSort(2)}>Open Price {sortConfig.key === 2 ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}</th>
                <th onClick={() => handleSort(3)}>Entry Price {sortConfig.key === 3 ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}</th>
                <th onClick={() => handleSort(4)}>Entry Time {sortConfig.key === 4 ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}</th>
                <th onClick={() => handleSort(5)}>Profit 1% {sortConfig.key === 5 ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}</th>
                <th onClick={() => handleSort(6)}>Achieved Time {sortConfig.key === 6 ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}</th>
                <th onClick={() => handleSort(7)}>Stop Loss {sortConfig.key === 7 ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}</th>
                <th onClick={() => handleSort(8)}>Loss Time {sortConfig.key === 8 ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}</th>
                <th onClick={() => handleSort(9)}>Closing Price {sortConfig.key === 9 ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}</th>
                <th onClick={() => handleSort(10)}>Closing Time {sortConfig.key === 10 ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}</th>
                <th onClick={() => handleSort(11)}>Entry Volume {sortConfig.key === 11 ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}</th>
                <th onClick={() => handleSort(12)}>Yesterday Volume {sortConfig.key === 12 ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}</th>
                <th onClick={() => handleSort(13)}>Average {sortConfig.key === 13 ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}</th>
                <th onClick={() => handleSort(14)}>AVG_% {sortConfig.key === 14 ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}</th>
                <th onClick={() => handleSort('nullStatus')}>Null Status {sortConfig.key === 'nullStatus' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : null}</th>
              </tr>
            </thead>
            <tbody>
            {processedData.map((item, index) => (
              <tr key={index} className={getRowClass(item)} onClick={()=>navigate(`/dashboard/${item[1]}/forward`)}>
                <td>{index + 1}</td>
                <td>{item[1]}</td>
                <td>{item[2]}</td>
                <td>{item[3]}</td>
                <td>{item[4]}</td>
                <td>{item[5] == null ? "NULL" : item[5]}</td>
                <td>{item[6] == null ? "NULL" : item[6]}</td>
                <td>{item[7] == null ? "NULL" : item[7]}</td>
                <td>{item[8] == null ? "NULL" : item[8]}</td>
                <td>{item[9]}</td>
                <td>{item[10]}</td>
                <td>{item[11]}</td>
                <td>{item[12]}</td>
                <td>{item[13].toFixed(2)}</td>
                <td>{item[14].toFixed(2)}</td>
                <td>{item.nullStatus.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          </Table>
        </div>
    </>
  );
};

export default Historical_Reverse;
