import React from 'react';
import { Bell, Search } from 'lucide-react';

const Navbar = ({ title, subtitle }) => {
    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
            <div>
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                {subtitle && (
                    <p className="text-sm text-gray-500">{subtitle}</p>
                )}
            </div>

            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Cari..."
                        className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full"></span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
