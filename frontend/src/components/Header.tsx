import { Bell, Search, ChevronDown, User } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <header className="main-header">
      <div className="header-left">
        <div className="page-title">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>

      <div className="header-right">
        {/* Search */}
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Search metrics, reports..." />
        </div>

        {/* Year Selector */}
        <div className="year-selector">
          <select defaultValue={currentYear}>
            <option value={currentYear}>FY {currentYear}</option>
            <option value={currentYear - 1}>FY {currentYear - 1}</option>
            <option value={currentYear - 2}>FY {currentYear - 2}</option>
          </select>
        </div>

        {/* Notifications */}
        <button className="icon-btn notification-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        {/* User Menu */}
        <div className="user-menu-wrapper">
          <button 
            className="user-menu-trigger"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              <User size={18} />
            </div>
            <span className="user-name">CFO Admin</span>
            <ChevronDown size={16} />
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <strong>CFO Admin</strong>
                <span>cfo@company.com</span>
              </div>
              <div className="dropdown-divider"></div>
              <a href="/settings" className="dropdown-item">Profile Settings</a>
              <a href="/settings#company" className="dropdown-item">Company Settings</a>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item danger">Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

