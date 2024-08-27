import React from 'react'
import SideBar from '../component/SideBar'
import BodyPage from './BodyPage'
import Cricle from './Circle'

function RootPage() {
  return (
    <>
        <main>
            <SideBar />
            <BodyPage />  
        </main>
        <Cricle />
    </>
    
    
  )
}

export default RootPage