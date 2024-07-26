import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Navbar from '../Navbar_Live';
import '../../styles/live.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx'; // Importing the XLSX library

const Forward = () => {
  const status = useSelector((state) => state.stockData.sidebarStatus);
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const fetchData = () => {
      axios.get('http://127.0.0.1:5000/forward')
        .then((res) => {
          setData(res.data); // Corrected this line
        })
        .catch((err) => {
          console.error(err);
        });
    };

    // Fetch data immediately
    fetchData();

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
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  // Calculate totals and sums
  const totals = data.reduce((acc, item) => {
    const nullStatus = (item[5] == null && item[7] == null) ? parseFloat(item[9]) - parseFloat(item[3]) : 0;
    acc.totalCompanies += 1;
    acc.totalProfit += item[5] ? 1 : 0; // Assuming column 5 is Profit 1%
    acc.totalLoss += item[7] ? 1 : 0; // Assuming column 7 is Stop Loss
    acc.totalOpenPrice += parseFloat(item[2]) || 0; // Assuming column 2 is Open Price
    acc.totalClosePrice += parseFloat(item[9]) || 0; // Assuming column 9 is Closing Price
    acc.totalStopPrice += parseFloat(item[7]) || 0; // Assuming column 7 is Stop Loss
    acc.totalEntryVol += parseFloat(item[11]) || 0; // Assuming column 11 is Entry Volume
    acc.totalYesterdayVol += parseFloat(item[12]) || 0; // Assuming column 12 is Yesterday Volume
    acc.totalAvg += parseFloat(item[13]) || 0; // Assuming column 13 is Average

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
    totalClosePrice: 0,
    totalStopPrice: 0,
    totalEntryVol: 0,
    totalYesterdayVol: 0,
    totalAvg: 0,
    nullTotal: 0,
    positiveCount: 0,
    negativeCount: 0
  });

  totals.totalNull = totals.totalCompanies - totals.totalProfit - totals.totalLoss;

  const generatePDF = () => {
    const input = document.getElementById('table-to-pdf');
    html2canvas(input, { scale: 3, useCORS: true, logging: true })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 0.8); // Reduce quality to 0.5
        const pdf = new jsPDF('p', 'mm', 'letter');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('table.pdf');
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
    XLSX.writeFile(wb, 'data.xlsx');
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

  return (
    <>
      <Navbar />
      <main className='main-container'>
        <div className='main-title'>
          <h1>Live Data | Forward</h1>
        </div>
        <div className='inputs'>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>Date</b>
            </InputGroup.Text>
            <Form.Control
              type='date'
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setData({ ...data, date: e.target.value })}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>From-Time</b>
            </InputGroup.Text>
            <Form.Control
              type='time'
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setData({ ...data, from_time: e.target.value })}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>To-Time</b>
            </InputGroup.Text>
            <Form.Control
              type='time'
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setData({ ...data, to_time: e.target.value })}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>Open Price</b>
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setData({ ...data, open_price: e.target.value })}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>Volume</b>
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setData({ ...data, volume: e.target.value })}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>Average</b>
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setData({ ...data, average: e.target.value })}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>Profit</b>
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setData({ ...data, profit: e.target.value })}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>Loss</b>
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setData({ ...data, loss: e.target.value })}
            />
          </InputGroup>
          <Button type='button' variant='danger' style={{ marginBottom: '15px' }}>Submit</Button>
        </div>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"10px"}}>
          <Button type='button' variant='danger' onClick={generatePDF}>Download As PDF</Button>
          <Button type='button' variant='primary' onClick={generateExcel}>Download As Excel</Button>
        </div>
        <br />
        <div id="table-to-pdf" className="square border border-dark">
          <Table bordered hover variant="dark">
            <thead>
              <tr>
                <th>Total Companies</th>
                <th>No.of Profit</th>
                <th>No.of Loss</th>
                <th>No.of Null</th>
                <th>Open_Price Total</th>
                <th>Entry_Price Total</th>
                <th>Profit Total</th>
                <th>Close_Price Total</th>
                <th>Stop_Price Total</th>
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
                <td>{totals.totalProfit}</td>
                <td>{totals.totalLoss}</td>
                <td>{totals.totalNull}</td>
                <td>{totals.totalOpenPrice.toFixed(2)}</td>
                <td></td>
                <td></td>
                <td>{totals.totalClosePrice.toFixed(2)}</td>
                <td>{totals.totalStopPrice.toFixed(2)}</td>
                <td>{totals.totalEntryVol.toFixed(2)}</td>
                <td>{totals.totalYesterdayVol.toFixed(2)}</td>
                <td>{totals.totalAvg.toFixed(2)}</td>
                <td>{totals.nullTotal.toFixed(2)}</td>
                <td>{totals.positiveCount}</td>
                <td>{totals.negativeCount}</td>
              </tr>
            </tbody>
          </Table>
          <Table bordered hover variant="light" className="square border border-dark">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Open Price</th>
                <th>Entry Price</th>
                <th onClick={() => handleSort(4)}>Entry Time</th>
                <th>Profit 1%</th>
                <th onClick={() => handleSort(6)}>Achieved Time</th>
                <th>Stop Loss</th>
                <th onClick={() => handleSort(8)}>Loss Time</th>
                <th onClick={() => handleSort(10)}>Closing Price</th>
                <th>Closing Time</th>
                <th>Entry Volume</th>
                <th>Yesterday Volume</th>
                <th>Average</th>
                <th>Null Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => (
                <tr key={index} className={getRowClass(item)}>
                  <td>{item[1]}</td>
                  <td>{item[2]}</td>
                  <td>{item[3]}</td>
                  <td>{item[4]}</td>
                  <td>{item[5] == null ? "Null" : item[5]}</td>
                  <td>{item[6] == null ? "Null" : item[6]}</td>
                  <td>{item[7] == null ? "Null" : item[7]}</td>
                  <td>{item[8] == null ? "Null" : item[8]}</td>
                  <td>{item[9]}</td>
                  <td>{item[10]}</td>
                  <td>{item[11]}</td>
                  <td>{item[12]}</td>
                  <td>{item[13]}</td>
                  <td>{item.nullStatus.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </main>
    </>
  );
};

export default Forward;
