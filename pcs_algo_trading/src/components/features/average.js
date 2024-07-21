import React from 'react'
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';



const Averages=()=> {

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
            <h1>Averages Of High Price & Volumes</h1>
            <h4>Formula : <b>(Add_All_HP_in_Same_Day)/No_Of_Days  </b>"Same for Volume Average"</h4>
        </div>
        <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          <th>No</th>
          <th>Company</th>
          <th>Time</th>
          <th>High_Price Average</th>
          <th>Volume Average</th>

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

export default Averages