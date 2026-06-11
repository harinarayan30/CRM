import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mic2, LayoutDashboard, UploadCloud, BarChart2,
  LogOut, Menu, X, Moon, Sun, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload', icon: UploadCloud },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
];

export default function Navbar({ darkMode, setDarkMode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-card/80 backdrop-blur-xl border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/40 group-hover:shadow-primary-700/50 transition-all duration-300">
                <Mic2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gradient hidden sm:block">Humera</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
                const active = location.pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                      ${active
                        ? 'bg-primary-600/20 text-primary-400 shadow-inner'
                        : 'text-dark-muted hover:text-dark-text hover:bg-white/5'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <button
                id="dark-mode-toggle"
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl text-dark-muted hover:text-dark-text hover:bg-white/5 transition-all"
                title="Toggle theme"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* User menu */}
              {user && (
                <div className="hidden md:flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-dark-text">{user.name}</p>
                    <p className="text-xs text-dark-muted">{user.email}</p>
                  </div>
                  <button
                    id="logout-btn"
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-dark-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-xl text-dark-muted hover:text-dark-text hover:bg-white/5"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-y-0 right-0 z-40 w-72 bg-dark-card border-l border-dark-border shadow-2xl md:hidden"
          >
            <div className="p-6 pt-20 flex flex-col h-full">
              <div className="flex-1 space-y-1">
                {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
                  const active = location.pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                        ${active
                          ? 'bg-primary-600/20 text-primary-400'
                          : 'text-dark-muted hover:text-dark-text hover:bg-white/5'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </Link>
                  );
                })}
              </div>

              {user && (
                <div className="border-t border-dark-border pt-4">
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-dark-text">{user.name}</p>
                    <p className="text-xs text-dark-muted">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
