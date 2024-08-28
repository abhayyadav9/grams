import React from 'react'
import { Outlet } from 'react-router-dom'
import LeftSidebar from '../LeftSidebar'

const MainLayout = () => {
  return (   
    <>
    <div className='fixed'>
        <LeftSidebar />
    </div >


    <div className="" style={{marginLeft:"60px"}}>
        <Outlet/>
        </div>


        </>


  )
}

export default MainLayout