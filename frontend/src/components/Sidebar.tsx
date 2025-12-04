import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  Cloud,
  Droplets,
  Users,
  Upload,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Link2,
  TrendingUp,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { path: '/integrations', icon: Link2, label: 'Integrations', badge: 'NEW' },
  { path: '/energy', icon: Zap, label: 'Energy (B1)', badge: 'VSME' },
  { path: '/emissions', icon: Cloud, label: 'Emissions (B2)', badge: 'VSME' },
  { path: '/water', icon: Droplets, label: 'Water (B3)', badge: 'VSME' },
  { path: '/workforce', icon: Users, label: 'Workforce (B6)', badge: 'VSME' },
  { path: '/scope3', icon: TrendingUp, label: 'Scope 3 (BP1)', badge: 'VSME' },
  { path: '/upload', icon: Upload, label: 'Data Upload', badge: 'AI' },
  { path: '/reports', icon: FileText, label: 'Reports', badge: null },
];

export function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 40 40" fill="none">
              <path d="M20 4L36 36H4L20 4Z" fill="currentColor" />
            </svg>
          </div>
          {!collapsed && (
            <div className="logo-text">
              <span className="logo-name">GreenAlgebra</span>
              <span className="logo-tagline">Balancing Profit & Planet</span>
            </div>
          )}
        </div>
        <button 
          className="collapse-btn" 
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          {!collapsed && <span className="nav-section-title">ESG Modules</span>}
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'active' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <item.icon size={20} />
              {!collapsed && (
                <>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className={`nav-badge ${item.badge.toLowerCase()}`}>{item.badge}</span>}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="sidebar-footer">
        <NavLink to="/settings" className="nav-item" title={collapsed ? 'Settings' : undefined}>
          <Settings size={20} />
          {!collapsed && <span className="nav-label">Settings</span>}
        </NavLink>
        
        <button className="nav-item" onClick={toggleTheme} title={collapsed ? 'Toggle theme' : undefined}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          {!collapsed && <span className="nav-label">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
        </button>

        <a href="https://greenalgebra.com/contact" target="_blank" rel="noopener" className="nav-item" title={collapsed ? 'Help' : undefined}>
          <HelpCircle size={20} />
          {!collapsed && <span className="nav-label">Help & Support</span>}
        </a>

        <button className="nav-item logout" title={collapsed ? 'Logout' : undefined}>
          <LogOut size={20} />
          {!collapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

