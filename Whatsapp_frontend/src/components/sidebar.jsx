import React from 'react';
import '../styles/sidebar.css';

const Sidebar = ({ activeView, setActiveView, broadcastExpanded, setBroadcastExpanded, isCollapsed, setIsCollapsed, onLogout }) => {
  const handleLogoutClick = () => {
    if (typeof onLogout === 'function') {
      onLogout();
      return;
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    window.location.reload();
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-top">
        <div className="company-logo" style={{ marginBottom: '0' }}>
          <img src="/mtm-profile.png" alt="Company logo" className="company-logo-image" />
        </div>
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '>' : '<'}
        </button>
      </div>

      <div className="menu-section">Overview</div>
      
      <div
        className={`menu-item ${activeView === 'overview' ? 'active' : ''}`}
        onClick={() => setActiveView('overview')}
        style={{ cursor: 'pointer' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        <span className="menu-label">Dashboard</span>
      </div>

      <div
        className={`menu-item ${activeView === 'inbox' ? 'active' : ''}`}
        onClick={() => setActiveView('inbox')}
        style={{ cursor: 'pointer' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1-9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        <span className="menu-label">Inbox</span>
      </div>

      {/* BROADCAST SECTION */}
      <div
        className={`menu-item ${(activeView === 'templates-list' || activeView === 'create-template' || activeView.includes('campaign')) ? 'active' : ''}`}
        onClick={() => setBroadcastExpanded(!broadcastExpanded)}
        style={{ cursor: 'pointer', justifyContent: isCollapsed ? 'center' : 'space-between' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"></path><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          <span className="menu-label">Broadcast</span>
        </div>
        {!isCollapsed && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: broadcastExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}><polyline points="6 9 12 15 18 9"></polyline></svg>
        )}
      </div>

      {broadcastExpanded && !isCollapsed && (
        <div className="submenu" style={{ paddingLeft: '16px' }}>
          <div className={`menu-item ${activeView === 'templates-list' ? 'active' : ''}`} onClick={() => setActiveView('templates-list')} style={{ cursor: 'pointer', padding: '8px 12px', fontSize: '13px' }}>Templates</div>
          <div className={`menu-item ${activeView === 'create-template' ? 'active' : ''}`} onClick={() => setActiveView('create-template')} style={{ cursor: 'pointer', padding: '8px 12px', fontSize: '13px' }}>Create Template</div>
          <div className={`menu-item ${activeView === 'campaign-history' ? 'active' : ''}`} onClick={() => setActiveView('campaign-history')} style={{ cursor: 'pointer', padding: '8px 12px', fontSize: '13px' }}>Campaign History</div>
          <div className={`menu-item ${activeView === 'campaign-scheduled' ? 'active' : ''}`} onClick={() => setActiveView('campaign-scheduled')} style={{ cursor: 'pointer', padding: '8px 12px', fontSize: '13px' }}>Campaign Scheduled</div>
        </div>
      )}

      <div className={`menu-item ${activeView === 'chatbots' ? 'active' : ''}`} onClick={() => setActiveView('chatbots')} style={{ cursor: 'pointer' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path></svg>
        <span className="menu-label">Chatbots</span>
      </div>

      <div className={`menu-item ${activeView === 'contacts' ? 'active' : ''}`} onClick={() => setActiveView('contacts')} style={{ cursor: 'pointer' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
        <span className="menu-label">Contacts</span>
      </div>

      <div className="sidebar-footer">
        <button
          type="button"
          className="menu-item logout-button"
          onClick={handleLogoutClick}
          aria-label="Log out"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          <span className="menu-label">Logout</span>
        </button>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">P</div>
          {!isCollapsed && <div className="sidebar-user-name">PugalShree</div>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;