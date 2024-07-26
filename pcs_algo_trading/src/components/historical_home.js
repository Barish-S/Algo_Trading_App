import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/dashboard.css'
import Header from './header';
import Sidebar from './sidebar';
import { useSelector } from 'react-redux';
import Filtered_Data from './features/filtered_data';
import All_Companies from './features/all_companies';
import Cumulatives from './features/cumulative';
import Averages from './features/average';
import Live from './features/forward';

const Dashboard = () => {

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

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar}/>
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
      {status=="company_list"?<All_Companies />:null}
      {status=="filtered_data"?<Filtered_Data />:null}
      {status=="average"?<Averages />:null}
      {status=="cumulative"?<Cumulatives />:null}
    </div>
  );
};

export default Dashboard;
