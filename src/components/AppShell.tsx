import { useState } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ChatbotWidget from './ChatbotWidget';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  Compass,
  Bell,
  Settings,
  LogOut,
  Users,
  Menu,
  Calculator,
} from 'lucide-react';

const navItems = [
  { id: 'platform', label: 'Explorer', icon: LayoutDashboard, href: '/platform' },
  { id: 'map', label: 'Carte', icon: Compass, href: '/platform?view=map' },
  { id: 'simulateur', label: 'Simulateur', icon: Calculator, href: '/simulateur' },
  { id: 'profile', label: 'Profil', icon: Users, href: '/profile' },
];

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const currentPath = location.pathname;

  const getActiveNav = () => {
    if (currentPath.startsWith('/profile')) return 'profile';
    if (currentPath.startsWith('/simulateur')) return 'simulateur';
    return 'platform';
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ═══ LEFT SIDEBAR ═══ */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-[#004235] text-white
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-[68px]' : 'w-60'}
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div
          className={`flex items-center h-16 px-4 border-b border-white/10 ${
            sidebarCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {!sidebarCollapsed ? (
            <Link
              to="/"
              className="text-xl font-bold tracking-tight hover:text-[#cda86b] transition-colors"
            >
              Afaqi
            </Link>
          ) : (
            <Link
              to="/"
              className="text-xl font-bold hover:text-[#cda86b] transition-colors"
            >
              A
            </Link>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/10 transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = getActiveNav() === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.href);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? 'bg-white/15 text-white'
                      : 'text-white/60 hover:bg-white/10 hover:text-white'
                  }
                  ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 p-2 space-y-1">
          <button
            onClick={() => navigate('/profile')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            title={sidebarCollapsed ? 'Paramètres' : undefined}
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Paramètres</span>}
          </button>
          <button
            onClick={() => navigate('/')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-red-300 transition-colors ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
            title={sidebarCollapsed ? 'Retour' : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Retour à l'accueil</span>}
          </button>
        </div>
      </aside>

      {/* ═══ MAIN AREA ═══ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0 z-20">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Page title */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">
              {currentPath.startsWith('/profile')
                ? 'Mon Profil'
                : currentPath.startsWith('/simulateur')
                ? 'Simulateur'
                : 'Explorer'}
            </h2>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-50">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#cda86b] rounded-full" />
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-[#004235] flex items-center justify-center text-white text-sm font-semibold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>

      {/* Chatbot FAB */}
      <div className="fixed z-50 bottom-6 right-6" style={{ pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto' }}>
          <ChatbotWidget />
        </div>
      </div>
    </div>
  );
}
