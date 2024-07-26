import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Live from './features/forward';

const LiveData = () => {
  
  let status=useSelector((state)=>state.stockData.sidebarStatus)

  return (
    <div className="App">
            <Live/>
        </div>
  );
};

export default LiveData;
