import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    DoorOpen,
    Users,
    Receipt,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { APP_NAME } from '../config/constants';
import { useAuthStore } from '../context/authStore';

const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/kamar', label: 'Kamar', icon: DoorOpen },
    { path: '/penghuni', label: 'Penghuni', icon: Users },
    { path: '/tagihan', label: 'Tagihan', icon: Receipt },
    { path: '/pengaturan', label: 'Pengaturan', icon: Settings },
];

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside
            className={`
        fixed left-0 top-0 h-screen z-40
        bg-sidebar-bg text-sidebar-text
        flex flex-col
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-20' : 'w-[260px]'}
      `}
        >
            {/* Floating Toggle Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className={`
          absolute top-6 -right-3.5
          w-7 h-7 
          bg-primary-500 hover:bg-primary-600
          text-white rounded-full
          flex items-center justify-center
          shadow-lg
          transition-all duration-200
          z-50
        `}
            >
                {collapsed ? (
                    <ChevronRight className="h-4 w-4" />
                ) : (
                    <ChevronLeft className="h-4 w-4" />
                )}
            </button>

            {/* Logo Section */}
            <div className={`
        flex items-center h-16 px-4 border-b border-gray-800
        ${collapsed ? 'justify-center' : 'gap-3'}
      `}>
                <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    K
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <h1 className="text-white font-bold text-lg leading-tight">{APP_NAME}</h1>
                        <p className="text-xs text-gray-500">Billing Automation</p>
                    </div>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 py-4 overflow-y-auto">
                <ul className="space-y-1 px-3">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => `
                    flex items-center gap-3 px-3 py-2.5 rounded-lg
                    transition-all duration-200
                    ${collapsed ? 'justify-center' : ''}
                    ${isActive
                                            ? 'bg-primary-500/10 text-primary-500'
                                            : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
                                        }
                  `}
                                >
                                    <Icon className="h-5 w-5 flex-shrink-0" />
                                    {!collapsed && (
                                        <span className="text-sm font-medium">{item.label}</span>
                                    )}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Profile Section */}
            <div className="border-t border-gray-800 p-3">
                <div className={`
          flex items-center gap-3 p-2 rounded-lg
          ${collapsed ? 'justify-center' : ''}
        `}>
                    <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                        {user?.nama_lengkap?.charAt(0) || 'A'}
                    </div>
                    {!collapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">
                                {user?.nama_lengkap || 'Admin'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.username || 'admin@kosflow.com'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className={`
            w-full mt-2 flex items-center gap-3 px-3 py-2.5 rounded-lg
            text-sidebar-text hover:bg-sidebar-hover hover:text-white
            transition-all duration-200
            ${collapsed ? 'justify-center' : ''}
          `}
                >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span className="text-sm font-medium">Keluar</span>}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
