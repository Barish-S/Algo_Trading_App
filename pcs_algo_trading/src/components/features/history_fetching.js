import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Navbar from '../Navbar_Live';
import '../../styles/live.css';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setPageStatus } from '../../redux/reducers/stockSlice';
import Historical_Forward from './history_forward';
import Historical_Reverse from './history_reverse';
import { setLoader } from '../../redux/reducers/stockSlice';

const Historical = () => {
  const globeStatus = useSelector((state) => state.stockData.pageStatus);
  const loader = useSelector((state) => state.stockData.loader);
  const dispatch = useDispatch()
  const [inputData, setInputData] = useState([]);

  useEffect(() => {
    dispatch(setPageStatus("history_forward"))
  }, []);

  const clearTable = () => {
    let formData = new FormData();
    formData.append("request", "submit");
    axios.post('http://127.0.0.1:5000/clear-table',formData)
      .then((res) => {
        console.log("Response from server:", res);
        alert("Table Cleared");
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }
  const getData = () => {
    console.log(inputData)
    let formData = new FormData();
    formData.append("date", inputData.date);
    formData.append("open_price", inputData.open_price);
    formData.append("volume", inputData.volume);
    formData.append("average", inputData.average);
    formData.append("profit", inputData.profit);
    formData.append("loss", inputData.loss);
    dispatch(setLoader(true))
    clearTable();
    axios.post('http://127.0.0.1:5000/start-trading', formData)
      .then((res) => {
        console.log("Response from server:", res);
        dispatch(setLoader(false))
        alert("Success");
      })
      .catch((err) => {
        console.error("Error:", err);
        dispatch(setLoader(false))
        alert('ERROR');
      });
};

  
  return (
    <>
      <Navbar />
      <main className='main-container'>
        <div className='main-title'>
          <h1>Historical | {globeStatus=="history_forward"?"Forward":"Reverse"}</h1>
        </div>
        <div className='inputs'>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>Date</b>
            </InputGroup.Text>
            <Form.Control
              type='text'
              aria-label="Default"
              placeholder='YYYYMMDD'
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setInputData({ ...inputData, date: e.target.value })}
            />
          </InputGroup>
          {/* <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>From-Time</b>
            </InputGroup.Text>
            <Form.Control
              type='time'
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setInputData({ ...inputData, from_time: e.target.value })}
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
              onKeyUp={(e) => setInputData({ ...inputData, to_time: e.target.value })}
            />
          </InputGroup> */}
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>Entry Price %</b>
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setInputData({ ...inputData, open_price: e.target.value })}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>Volume</b>
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setInputData({ ...inputData, volume: e.target.value })}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>Average %</b>
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setInputData({ ...inputData, average: e.target.value })}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>Profit %</b>
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setInputData({ ...inputData, profit: e.target.value })}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>Loss %</b>
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              onKeyUp={(e) => setInputData({ ...inputData, loss: e.target.value })}
            />
          </InputGroup>
          <Button type='button' variant='danger' onClick={()=>getData()} style={{ marginBottom: '15px' }}>Submit</Button>
        </div>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
          {loader==true?<h3>Data On The Way ...</h3>:null}
          </div>
            {globeStatus=="history_forward"?<Historical_Forward/>:<Historical_Reverse/>}
      </main>
    </>
  );
};

export default Historical;
