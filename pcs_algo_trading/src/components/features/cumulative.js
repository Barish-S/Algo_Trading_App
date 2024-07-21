import React from 'react'
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';



const Cumulatives=()=> {

  const status = useSelector((state)=> state.stockData.sidebarStatus)
  const [data, setData] = useState([]);

  
    useEffect(() => {
      // // Fetch data from the backend
      // axios.get('http://localhost:5000/get_stock_data')
      //   .then(response => {
      //     setData(response.data);
      //   })
      //   .catch(error => {
      //     console.error('Error fetching data:', error);
      //   });
    },[]);

  return (
    <main className='main-container'>
        <div className='main-title'>
            <h1>Cumulatives Of High Price & Volumes</h1>
            <h4>Formula : <b>(1st Minute +...n)/n</b></h4>
        </div>
        <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>No</th>
          <th>Company</th>
          <th>Time</th>
          <th>Cumulative Of High_Price</th>
          <th>Cumulative Of Volume</th>
        </tr>
      </thead>
      <tbody>
        {data.map((data)=>{
          return (
            <tr>
              <td>{data.tkr}</td>
              <td>{data.td}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>

    </main>
  )
}

export default Cumulatives