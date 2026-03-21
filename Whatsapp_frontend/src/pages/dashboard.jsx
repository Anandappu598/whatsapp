import React, { useState } from 'react';
import Sidebar from '../components/sidebar';
import Navbar from '../components/navbar';
import AnalyticsWidget from './analytics_widget';
import ActivityDetailView from './activity_detail_view';

const Dashboard = ({ views, stats, handleLaunch, handleAddTemplate, themeMode, setThemeMode, onLogout }) => {
  const [activeView, setActiveView] = useState('overview');
  const [detailedView, setDetailedView] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [broadcastExpanded, setBroadcastExpanded] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Helper for Global Stats
  const getGlobalStats = () => {
    const combine = (key, subKey) => stats.B2B[key][subKey] + stats.B2C[key][subKey];
    const combineLists = (key) => [...stats.B2B[key].running, ...stats.B2C[key].running].sort((a, b) => b.id - a.id);
    return {
      campaigns: { active: combine('campaigns', 'active'), sent: combine('campaigns', 'sent'), failed: combine('campaigns', 'failed'), delivered: combine('campaigns', 'delivered'), received: combine('campaigns', 'received'), running: combineLists('campaigns') },
      individual: { active: combine('individual', 'active'), sent: combine('individual', 'sent'), failed: combine('individual', 'failed'), delivered: combine('individual', 'delivered'), received: combine('individual', 'received'), running: combineLists('individual') }
    };
  };

  const closeDetailView = () => {
    setDetailedView(null);
    setSelectedActivity(null);
  };

  const renderPrimaryView = () => {
    if (activeView === 'overview') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '0', background: 'var(--bg-main)', padding: '4px', borderRadius: '24px' }}>
              <div 
                className="header-tab active"
                style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '700', color: 'var(--brand-purple)', cursor: 'pointer', transition: 'all 0.2s', background: 'var(--surface-white)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                All
              </div>
              <div 
                className="header-tab"
                onClick={() => setActiveView('b2b')}
                style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '700', color: 'var(--text-gray)', cursor: 'pointer', transition: 'all 0.2s', background: 'transparent' }}
              >
                B2B Clients
              </div>
              <div 
                className="header-tab"
                onClick={() => setActiveView('b2c')}
                style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '700', color: 'var(--text-gray)', cursor: 'pointer', transition: 'all 0.2s', background: 'transparent' }}
              >
                B2C Students
              </div>
            </div>
          </div>
          <AnalyticsWidget data={getGlobalStats()} setDetailedView={setDetailedView} />
        </div>
      );
    }

    if (activeView === 'b2b') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '0', background: 'var(--bg-main)', padding: '4px', borderRadius: '24px' }}>
              <div 
                className="header-tab"
                onClick={() => setActiveView('overview')}
                style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '700', color: 'var(--text-gray)', cursor: 'pointer', transition: 'all 0.2s', background: 'transparent' }}
              >
                All
              </div>
              <div 
                className="header-tab active"
                style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '700', color: 'var(--brand-purple)', cursor: 'pointer', transition: 'all 0.2s', background: 'var(--surface-white)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                B2B Clients
              </div>
              <div 
                className="header-tab"
                onClick={() => setActiveView('b2c')}
                style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '700', color: 'var(--text-gray)', cursor: 'pointer', transition: 'all 0.2s', background: 'transparent' }}
              >
                B2C Students
              </div>
            </div>
          </div>
          <AnalyticsWidget data={stats.B2B} titlePrefix="B2B" setDetailedView={setDetailedView} />
          {views.B2BView}
        </div>
      );
    }

    if (activeView === 'b2c') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '0', background: 'var(--bg-main)', padding: '4px', borderRadius: '24px' }}>
              <div 
                className="header-tab"
                onClick={() => setActiveView('overview')}
                style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '700', color: 'var(--text-gray)', cursor: 'pointer', transition: 'all 0.2s', background: 'transparent' }}
              >
                All
              </div>
              <div 
                className="header-tab"
                onClick={() => setActiveView('b2b')}
                style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '700', color: 'var(--text-gray)', cursor: 'pointer', transition: 'all 0.2s', background: 'transparent' }}
              >
                B2B Clients
              </div>
              <div 
                className="header-tab active"
                style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '700', color: 'var(--brand-purple)', cursor: 'pointer', transition: 'all 0.2s', background: 'var(--surface-white)', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                B2C Students
              </div>
            </div>
          </div>
          <AnalyticsWidget data={stats.B2C} titlePrefix="B2C" setDetailedView={setDetailedView} />
          {views.B2CView}
        </div>
      );
    }

    if (activeView === 'templates-list' && typeof views.TemplatesView === 'function') {
      return views.TemplatesView(handleLaunch, () => setActiveView('create-template'));
    }

    if (activeView === 'create-template' && typeof views.CreateTemplate === 'function') {
      return views.CreateTemplate(
        (temp) => handleAddTemplate(temp, setActiveView),
        () => setActiveView('templates-list')
      );
    }

    if (activeView === 'inbox') {
      return views.InboxView;
    }

    if (activeView === 'contacts') {
      return views.ContactsView;
    }

    return (
      <div style={{ padding: '40px', textAlign: 'center', background: 'var(--surface-white)', borderRadius: '24px', marginTop: '16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800' }}>{activeView.toUpperCase()}</h2>
        <p>Section coming soon...</p>
      </div>
    );
  };

  const detailData =
    activeView === 'b2b'
      ? stats.B2B
      : activeView === 'b2c'
        ? stats.B2C
        : getGlobalStats();

  return (
    <div className="app-wrapper">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        broadcastExpanded={broadcastExpanded}
        setBroadcastExpanded={setBroadcastExpanded}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onLogout={onLogout}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Navbar activeView={activeView} setActiveView={setActiveView} themeMode={themeMode} setThemeMode={setThemeMode} />

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 16px 16px' }}>
          {renderPrimaryView()}
        </div>
      </div>

      {detailedView && (
        <ActivityDetailView
          type={detailedView}
          data={detailData}
          selectedActivity={selectedActivity}
          setSelectedActivity={setSelectedActivity}
          onClose={closeDetailView}
        />
      )}
    </div>
  );
};

export default Dashboard;