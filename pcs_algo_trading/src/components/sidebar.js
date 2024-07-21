import React from 'react'
import 
{BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill}
 from 'react-icons/bs'
 import { setSidebarStatus } from '../redux/reducers/stockSlice'
 import { useDispatch ,useSelector} from 'react-redux';
 import { Link } from "react-router-dom";


const Sidebar=({openSidebarToggle, OpenSidebar})=> {
    let dispatch = useDispatch()
    const status = useSelector((state)=> state.stockData.sidebarStatus)

    function change(){
        alert("jhu")
    }
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <h1>PCS Algorithmic Trading</h1>
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>
        <ul className='sidebar-list'>
            <li className='sidebar-list-item' onClick={()=>dispatch(setSidebarStatus("company_list"))}>
                <Link >
                    <BsGrid1X2Fill className='icon'/> All Company List
                </Link>
            </li>
            <li className='sidebar-list-item' onClick={()=>dispatch(setSidebarStatus("filtered_data"))}>
                <a >
                    <BsGrid1X2Fill className='icon'/> Filtered Data (L1)
                </a>
            </li>
            <li className='sidebar-list-item' onClick={()=>dispatch(setSidebarStatus("average"))}>
                <a>
                    <BsGrid1X2Fill className='icon'/> Minutes AVG Data (L2)
                </a>
            </li>
            <li className='sidebar-list-item' onClick={()=>dispatch(setSidebarStatus("cumulative"))}>
                <a>
                    <BsGrid1X2Fill className='icon'/> Cumulative Data (L3)
                </a>
            </li>
        </ul>
    </aside>
  )
}

export default Sidebar