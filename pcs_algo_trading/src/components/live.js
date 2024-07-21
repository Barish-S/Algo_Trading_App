import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from './Navbar_Live';
import Live from './features/live_data';


const LiveData = () => {
  
  let status=useSelector((state)=>state.stockData.sidebarStatus)

  useEffect(() => {
    // Fetch data from the backend
    // axios.get('/api/data')
    //   .then(response => {
    //     setData(response.data);
    //   })
    //   .catch(error => {
    //     console.error('Error fetching data:', error);
    //   });
  },[]);

  return (
    <div className="App">
            <Navbar />
            <Live/>
        </div>
  );
};

export default LiveData;
