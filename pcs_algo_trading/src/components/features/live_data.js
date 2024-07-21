import React from 'react'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import '../../styles/live.css'
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// const odbc = require('odbc');

const Live=()=> {

    const status = useSelector((state)=> state.stockData.sidebarStatus)
    const [data, setData] = useState({});
    const connectionString = 'DRIVER={MySQL ODBC 8.0 ANSI Driver};SERVER=193.203.184.38 ;DATABASE=trade_data;UID=pcs_fintech;PWD=t1#:V8=k;';
    useEffect(() => {
      // const fetchData = async () => {
      //     try {
      //         const connection = await odbc.connect(connectionString);
      //         connection.query('SELECT * FROM modification_data', (error, rows) => {
      //             if (error) {
      //                 console.error('Query error:', error);
      //             } else {
      //                 console.log('Query results:', rows);
      //                 setData(rows);
      //             }
      //             connection.close((error) => {
      //                 if (error) {
      //                     console.error('Connection close error:', error);
      //                 }
      //             });
      //         });
      //     } catch (error) {
      //         console.error('ODBC connection error:', error);
      //     }
      // };
      // fetchData();
  }, [])

  return (
    <main className='main-container'>
        <div className='main-title'>
            <h1>Live Data</h1>
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
          onKeyUp={(e)=>setData({...data,date:e.target.value})}
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
          onKeyUp={(e)=>setData({...data,from_time:e.target.value})}
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
          onKeyUp={(e)=>setData({...data,to_time:e.target.value})}
        />
      </InputGroup>
        <InputGroup className="mb-3">
        <InputGroup.Text id="inputGroup-sizing-default">
          <b>Open Price</b>
        </InputGroup.Text>
        <Form.Control
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          onKeyUp={(e)=>setData({...data,open_price:e.target.value})}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text id="inputGroup-sizing-default">
          <b>Volume</b>
        </InputGroup.Text>
        <Form.Control
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          onKeyUp={(e)=>setData({...data,volume:e.target.value})}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text id="inputGroup-sizing-default">
          <b>Average</b>
        </InputGroup.Text>
        <Form.Control
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          onKeyUp={(e)=>setData({...data,average:e.target.value})}
        />
      </InputGroup>
      <InputGroup className="mb-3">
        <InputGroup.Text id="inputGroup-sizing-default">
          <b>Profit</b>
        </InputGroup.Text>
        <Form.Control
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          onKeyUp={(e)=>setData({...data,profit:e.target.value})}
        />
      </InputGroup> <InputGroup className="mb-3">
        <InputGroup.Text id="inputGroup-sizing-default">
          <b>Loss</b>
        </InputGroup.Text>
        <Form.Control
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          onKeyUp={(e)=>setData({...data,loss:e.target.value})}
        />
      </InputGroup>
      <Button type='button' variant='danger' style={{marginBottom:'15px'}}>Submit</Button>
        </div><br></br>
        <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>Company Name</th>
          <th>Open Price</th>
          <th>Entry Price</th>
          <th>Entry Time</th>
          <th>Profit 1%</th>
          <th>Acheived Time</th>
          <th>Stop Loss</th>
          <th>Loss Time</th>
          <th>Closing Price</th>
          <th>Closing Time</th>
          <th>Entry Volume</th>
          <th>Yesterday Volume</th>
          <th>Average</th>


        </tr>
      </thead>
      <tbody>
        {/* {data.map((data,index)=>{
          return (
            <tr key={index}>
              <td>{data.company_name}</td>
              <td>{data.open_price}</td>
              <td>{data.entry_price}</td>
              <td>{data.entry_time}</td>
              <td>{data.profit_one_percentage}</td>
              <td>{data.acheived_time}</td>
              <td>{data.stop_loss}</td>
              <td>{data.stop_loss_time}</td>
              <td>{data.closing_price}</td>
              <td>{data.closing_time}</td>
              <td>{data.entry_volume}</td>
              <td>{data.yesterday_volume}</td>
              <td>{data.average}</td>
            </tr>
          )
        })} */}
      </tbody>
    </Table>
    </main>
  )
}

export default Live