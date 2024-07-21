import React, { useState } from 'react';
import '../styles/live.css'
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo">PCS | Fintech</div>
            <div className={`nav-links`}>
                <Link style={{textDecoration:"none",color:"inherit"}} to={'/historical'}><Button variant="outline-light">Historical Data</Button></Link>
            </div>
        </nav>
    );
};

export default Navbar;
