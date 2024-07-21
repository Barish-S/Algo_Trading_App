import React from 'react'
import {BsJustify} from 'react-icons/bs'
 import { Link } from 'react-router-dom'
 import { Button } from 'react-bootstrap'

function Header({OpenSidebar}) {
  return (
    <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='icon' onClick={OpenSidebar}/>
        </div>
        <div className='header-right'>
        <Button variant="outline-dark"><Link style={{textDecoration:"none",color:"inherit"}} to={'/'}>Live Data</Link></Button>
        </div>
    </header>
  )
}

export default Header