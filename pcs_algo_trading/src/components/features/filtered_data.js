import React from 'react'
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';



const Filtered_Data=()=> {

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
            <h1>Filtered Data</h1>
            <h4>Formula : <b>(Last_Day_CP &lt; 300 and &gt; 1050)</b></h4>
        </div>
        <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>No</th>
          <th>Company</th>
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

export default Filtered_Data