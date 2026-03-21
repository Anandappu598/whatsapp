import React from 'react';
import '../styles/navbar.css';

const Navbar = ({ activeView, setActiveView, themeMode, setThemeMode }) => {
  return (
    <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: 'var(--surface-white)' }}>
      <div className="search-bar-mini" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-main)', padding: '12px 18px', borderRadius: '28px', minWidth: '280px' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" placeholder="Search contacts, campaigns..." style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', width: '100%', color: 'var(--text-dark)' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
        <div className="theme-switch" aria-label="Theme mode switch">
          <button type="button" className={`theme-btn ${themeMode === 'system' ? 'active' : ''}`} onClick={() => setThemeMode('system')} title="System default">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="12" rx="2"></rect><path d="M8 20h8"></path></svg>
          </button>
          <button type="button" className={`theme-btn ${themeMode === 'light' ? 'active' : ''}`} onClick={() => setThemeMode('light')} title="Light mode">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2"></path><path d="M12 21v2"></path><path d="M4.22 4.22l1.42 1.42"></path><path d="M18.36 18.36l1.42 1.42"></path><path d="M1 12h2"></path><path d="M21 12h2"></path><path d="M4.22 19.78l1.42-1.42"></path><path d="M18.36 5.64l1.42-1.42"></path></svg>
          </button>
          <button type="button" className={`theme-btn ${themeMode === 'dark' ? 'active' : ''}`} onClick={() => setThemeMode('dark')} title="Dark mode">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3c0 0 0 0 0 0a7 7 0 0 0 9.79 9.79z"></path></svg>
          </button>
        </div>

        <div style={{ color: 'var(--text-gray)', cursor: 'pointer', position: 'relative' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          <div style={{ width: '6px', height: '6px', background: '#FF3B30', borderRadius: '50%', position: 'absolute', top: '-2px', right: '-2px' }}></div>
        </div>
        <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
      </div>
    </header>
  );
};

export default Navbar;