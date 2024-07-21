import React from 'react'
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';



const All_Companies=()=> {

    const [data, setData] = useState([]);
    const status = useSelector((state)=> state.stockData.sidebarStatus)
  
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
            <h1>Company List</h1>
        </div>
        <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>No</th>
          <th>Symbol</th>
          <th>Company Name</th>
        </tr>
      </thead>
      <tbody>
        {data.map((data)=>{
          return (
            <tr>
              <td>{data.tkr}</td>
              <td>{data.td}</td>
              <td>{data.td}</td>
            </tr>
          )
        })}
      </tbody>
    </Table>

    </main>
  )
}

export default All_Companies