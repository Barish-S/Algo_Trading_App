import React, { useState } from 'react';
import '../styles/live.css'
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { setPageStatus } from '../redux/reducers/stockSlice';
import { useDispatch } from 'react-redux';

const Navbar = () => {
    const dispatch=useDispatch()
    return (
        <nav className="navbar">
            <div className="logo">PCS | Fintech</div>
            <div className={`nav-links`}>
                <Link style={{textDecoration:"none",color:"inherit"}} to={'/historical'}><Button variant="outline-light">Historical Data</Button></Link>
                <Link style={{textDecoration:"none",color:"inherit"}} to={'/forward'}><Button variant="outline-light">Live Forward Data</Button></Link>
                <Link style={{textDecoration:"none",color:"inherit"}} to={'/reverse'}><Button variant="outline-light">Live Reverse Data</Button></Link>
            </div>
        </nav>
    );
};

export default Navbar;
