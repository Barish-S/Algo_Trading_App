import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { setAllData } from '../../redux/reducers/stockSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, linearGradient, defs, stop } from 'recharts';

const Statistics = () => {
  const [filteredData, setFilteredData] = useState([]);
  const { symbol } = useParams();
  const dispatch = useDispatch();
  const company = useSelector((state) => state.stockData.datas);

  useEffect(() => {
    const fetchData = () => {
      axios.get('http://127.0.0.1:5000/forward')
        .then((res) => {
          dispatch(setAllData(res.data));
        })
        .catch((err) => {
          console.error(err);
        });
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (company.length > 0) {
      const data = company.filter((data) => data[1] === symbol);
      setFilteredData(data);
    }
  }, [company, symbol]);

  // Prepare data for the chart
  const chartData = filteredData.map((item) => ({
    time: item[4], // assuming item[4] is the time
    open: item[2], // assuming item[2] is the open price
    high: item[3], // assuming item[3] is the high price
    low: item[5], // assuming item[5] is the low price
    close: item[6], // assuming item[6] is the close price
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <defs>
          <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff7300" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#ff7300" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="close" stroke="#8884d8" fillOpacity={1} fill="url(#colorClose)" />
        <Line type="monotone" dataKey="high" stroke="#82ca9d" fillOpacity={1} fill="url(#colorHigh)" />
        <Line type="monotone" dataKey="low" stroke="#ff7300" fillOpacity={1} fill="url(#colorLow)" />
        <Area type="monotone" dataKey="close" stroke="#8884d8" fill="url(#colorClose)" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Statistics;
