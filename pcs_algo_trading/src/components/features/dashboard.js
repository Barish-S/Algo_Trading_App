import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { setAllData } from '../../redux/reducers/stockSlice';
import Navbar from '../Navbar_Live';
const Statistics = () => {
  const [filteredData, setFilteredData] = useState([]);
  const { symbol , component } = useParams();
  const dispatch = useDispatch();
  const company = useSelector((state) => state.stockData.datas);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (component=="forward"){
        const res = await axios.get('http://127.0.0.1:5000/forward');
        dispatch(setAllData(res.data));
        }else if (component=="reverse"){
          const res = await axios.get('http://127.0.0.1:5000/reverse');
          dispatch(setAllData(res.data));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (company.length > 0) {
      const data = company.filter((data) => data[1] === symbol);
      setFilteredData(data);
    }
  }, [company, symbol]);

  const chartData = [
    { name: 'Opening Price', value: 12709 },
    { name: 'Highest Price', value: 12966.8 },
    { name: 'Closing Price', value: 12836.5 },
    { name: 'Average Price', value: 12799.4 },
  ];

  const tableData1 = [
    { ticker: 'NIFTY-1', segmentId: 2, kind: 'B', bidPrice: 21957.45, bidQty: 50, askPrice: 21958.8, askQty: 50, time: 1293704493 },
    { ticker: 'NIFTY-2', segmentId: 3, kind: 'A', bidPrice: 22000.45, bidQty: 60, askPrice: 22001.8, askQty: 60, time: 1293704593 },
    { ticker: 'NIFTY-3', segmentId: 4, kind: 'B', bidPrice: 22100.45, bidQty: 70, askPrice: 22101.8, askQty: 70, time: 1293704693 },
    { ticker: 'NIFTY-4', segmentId: 5, kind: 'A', bidPrice: 22200.45, bidQty: 80, askPrice: 22201.8, askQty: 80, time: 1293704793 },
    { ticker: 'NIFTY-5', segmentId: 6, kind: 'B', bidPrice: 22300.45, bidQty: 90, askPrice: 22301.8, askQty: 90, time: 1293704893 },
    { ticker: 'NIFTY-6', segmentId: 6, kind: 'B', bidPrice: 22300.45, bidQty: 90, askPrice: 22301.8, askQty: 90, time: 1293704893 },
  ];

  const tableData2 = [
    { addition_of_bid_qty: 150, addition_of_ask_qty: 150, ask_price_cumulative: 65875.4, bid_price_cumulative: 65872.35, AB_Cum_Difference: 3.05, AB_Cum_Difference_cumulative: 3.05 }
  ];

  return (
    <>
    <Navbar/>
    <Container fluid className="d-flex flex-column align-items-center justify-content-center">
      <Row className="my-4 w-100 text-center">
        <Col>
          <h2>{symbol ? `Statistics for ${symbol}` : 'Statistics Dashboard'}</h2>
        </Col>
      </Row>
      <Row className="w-100">
        <Col md={6}>
          <Card className="mb-4 d-flex flex-column align-items-center justify-content-center" >
            <Card.Body>
              <BarChart
                width={500}
                height={300}
                data={chartData}
                margin={{
                  top: 5, right: 30, left: 20, bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} >
          <Card className="mb-4">
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Ticker</th>
                    <th>Segment ID</th>
                    <th>Kind</th>
                    <th>Bid Price</th>
                    <th>Bid Qty</th>
                    <th>Ask Price</th>
                    <th>Ask Qty</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData1.map((row, index) => (
                    <tr key={index}>
                      <td>{row.ticker}</td>
                      <td>{row.segmentId}</td>
                      <td>{row.kind}</td>
                      <td>{row.bidPrice}</td>
                      <td>{row.bidQty}</td>
                      <td>{row.askPrice}</td>
                      <td>{row.askQty}</td>
                      <td>{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="w-100">
        <Col md={12}>
          <Card className="mb-4">
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Addition of Bid Qty</th>
                    <th>Addition of Ask Qty</th>
                    <th>Ask Price Cumulative</th>
                    <th>Bid Price Cumulative</th>
                    <th>AB Cum Difference</th>
                    <th>AB Cum Difference Cumulative</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData2.map((row, index) => (
                    <tr key={index}>
                      <td>{row.addition_of_bid_qty}</td>
                      <td>{row.addition_of_ask_qty}</td>
                      <td>{row.ask_price_cumulative}</td>
                      <td>{row.bid_price_cumulative}</td>
                      <td>{row.AB_Cum_Difference}</td>
                      <td>{row.AB_Cum_Difference_cumulative}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default Statistics;
