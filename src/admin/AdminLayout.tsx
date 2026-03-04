import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAdmin } from './AdminGuard';
import { supabase } from '../supabase';
import { Menu, LayoutDashboard, LogOut, Search, CheckCircle2, Settings, User } from 'lucide-react';

export const AdminLayout: React.FC = () => {
    const { user } = useAdmin();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            navigate('/login');
        } catch (err) {
            console.warn('Logout failed', err);
        }
    };

    const navItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { label: 'Landing Settings', path: '/admin/settings', icon: <Settings size={20} /> },
        { label: 'Articles', path: '/admin/articles', icon: <Menu size={20} /> },
        { label: 'My Profile', path: '/admin/my-profile', icon: <User size={20} /> },
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full bg-[#FFF6E5] text-gray-800 border-r border-gold-200/50">
            {/* Brand Header */}
            <div className="h-16 flex items-center px-6 font-bold text-lg text-primary-DEFAULT tracking-widest uppercase border-b border-gold-200/50">
                <span className="bg-gradient-to-br from-gold-600 to-gold-400 bg-clip-text text-transparent">Bina Trampil CMS</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 py-6 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <button
                            key={item.path}
                            onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-gold-500 text-white font-semibold shadow-md shadow-gold-500/20'
                                : 'hover:bg-gold-100 hover:text-gold-700 text-gray-600'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    )
                })}
            </nav>

            {/* Footer / Account */}
            <div className="p-4 border-t border-gold-200/50 bg-[#FDF8EF]/50">
                <div
                    onClick={() => { navigate('/admin/my-profile'); setSidebarOpen(false); }}
                    className="flex items-center gap-3 mb-4 px-2 cursor-pointer hover:bg-gold-50 p-1.5 rounded-lg transition-colors border border-transparent hover:border-gold-100"
                    title="Klik untuk ubah profil"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gold-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm overflow-hidden border border-gold-200">
                        <User size={16} />
                    </div>
                    <div className="flex-1 w-0 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate" title={user?.email}>{user?.email?.split('@')[0]}</p>
                        <p className="text-[10px] text-gray-500 font-medium truncate tracking-wide uppercase">Administrator</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 justify-center py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors border border-transparent hover:border-red-100"
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex bg-[#FDF8EF] text-gray-800 font-sans selection:bg-gold-500/30">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar Drawer */}
            <aside
                className={`fixed top-0 bottom-0 left-0 w-[280px] z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:relative lg:flex-shrink-0 shadow-2xl lg:shadow-none bg-[#FFF6E5]`}
            >
                {sidebarContent}
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                {/* Topbar */}
                <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-10 border-b border-gold-200/40 bg-white/60 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gold-600 rounded-lg transition-colors focus:ring-2 focus:ring-gold-500/40 bg-white shadow-sm border border-gray-100"
                        >
                            <Menu size={20} />
                        </button>
                        <h1 className="text-lg font-bold text-gray-800 tracking-widest hidden sm:block">Dashboard</h1>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="hidden sm:flex items-center bg-white border border-gray-200 rounded-full px-4 py-1.5 focus-within:ring-2 focus-within:ring-gold-500/40 focus-within:border-transparent transition-all shadow-sm">
                            <Search size={16} className="text-gray-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Cari data..."
                                className="bg-transparent border-none outline-none text-sm px-3 w-48 text-gray-700 placeholder:text-gray-400"
                            />
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-700 text-xs font-semibold tracking-wide">
                            <CheckCircle2 size={14} className="shrink-0" />
                            <span className="hidden sm:inline">Connected</span>
                        </div>
                    </div>
                </header>

                {/* Page Outlet */}
                <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
