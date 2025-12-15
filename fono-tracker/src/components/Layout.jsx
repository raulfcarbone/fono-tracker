import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Users, LayoutDashboard, Settings, Activity, Calendar, Sparkles, Gamepad2 } from 'lucide-react';
import clsx from 'clsx';

function NavItem({ to, icon, children }) {
    const location = useLocation();
    const isActive = location.pathname.startsWith(to);
    const IconComponent = icon;

    return (
        <Link
            to={to}
            className={clsx(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                    ? "bg-teal-50 text-teal-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
        >
            <IconComponent size={20} />
            <span>{children}</span>
        </Link>
    );
}

export function Layout() {
    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-slate-100 flex flex-col">
                <div className="p-6">
                    <div className="flex items-center space-x-2 text-teal-600">
                        <Activity className="h-8 w-8" />
                        <span className="text-xl font-bold tracking-tight">FonoTracker</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <NavItem to="/dashboard" icon={LayoutDashboard}>Dashboard</NavItem>
                    <NavItem to="/calendar" icon={Calendar}>Agenda</NavItem>
                    <NavItem to="/activities" icon={Sparkles}>Actividades</NavItem>
                    <NavItem to="/actividades-interactivas" icon={Gamepad2}>Actividades interactivas</NavItem>
                    <NavItem to="/patients" icon={Users}>Pacientes</NavItem>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <NavItem to="/settings" icon={Settings}>Configuración</NavItem>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-slate-50/50">
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
