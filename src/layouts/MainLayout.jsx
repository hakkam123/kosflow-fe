import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-bg-main">
            {/* Sidebar - Fixed position */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="ml-[260px] transition-all duration-300 min-h-screen">
                {/* Page content from router outlet */}
                <div className="p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
