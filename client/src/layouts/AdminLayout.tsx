import React from 'react'
import { Outlet } from 'react-router-dom'


const AdminLayout = () => {
    return (
        <div className="h-screen w-screen">
            <Outlet /> {/* This is where LandingPage will render */}
        </div>
    )
}

export default AdminLayout
