import React from 'react'
import Navbar from '../components/Navbar'
import CompanyGrid from '../components/dashboard/CompanyGrid'

const Dashboard = () => {
  return (
    <div className='screen'>
        <Navbar />
        <CompanyGrid />
    </div>
  )
}

export default Dashboard