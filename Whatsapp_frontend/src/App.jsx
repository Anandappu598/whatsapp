import React, { useEffect, useState, useContext } from 'react';
import Dashboard from './pages/dashboard';
import B2BView from './pages/b2b_view';
import B2CView from './pages/b2c_view';
import CreateTemplate from './pages/create_template';
import TemplatesView from './pages/templates_view';
import InboxView from './pages/inbox_view';
import ContactsView from './pages/contacts_view';
import { defaultTemplates } from './data/default_templates';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AuthContainer from './pages/auth/AuthContainer';
import Toast from './components/Toast';
import { logout as logoutApi } from './api';
import './styles/theme.css';

function AppContent() {
  const { authStep, setAuthStep } = useContext(AuthContext);
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('themeMode') || 'system');
  const [templates, setTemplates] = useState(defaultTemplates);
  const [stats, setStats] = useState({
    B2B: {
      campaigns: { active: 0, sent: 0, failed: 0, delivered: 0, received: 0, running: [] },
      individual: { active: 0, sent: 0, failed: 0, delivered: 0, received: 0, running: [] },
    },
    B2C: {
      campaigns: { active: 0, sent: 0, failed: 0, delivered: 0, received: 0, running: [] },
      individual: { active: 0, sent: 0, failed: 0, delivered: 0, received: 0, running: [] },
    },
  });

  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('authToken') !== null;

  const handleLaunch = (count, type, campaignName, templateName, messageBody, selectedContactsList) => {
    setStats((prev) => {
      const category = count > 1 ? 'campaigns' : 'individual';
      const audience = type === 'B2B' ? 'B2B' : 'B2C';

      const newEntry = {
        id: Date.now(),
        name: campaignName || (count > 1 ? 'Bulk Broadcast' : 'Direct Message'),
        template: templateName,
        body: messageBody,
        contacts: selectedContactsList,
        count,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          day: 'numeric',
          month: 'short',
        }),
        audience,
      };

      const failedCount = selectedContactsList.filter((c) => c.status === 'Failed').length;
      const deliveredCount = selectedContactsList.filter((c) => c.status === 'Delivered').length;
      const receivedCount = selectedContactsList.filter((c) => c.status === 'Delivered' || c.status === 'Read').length;

      return {
        ...prev,
        [audience]: {
          ...prev[audience],
          [category]: {
            ...prev[audience][category],
            active: prev[audience][category].active + 1,
            sent: prev[audience][category].sent + (count > 1 ? count : 1),
            failed: prev[audience][category].failed + failedCount,
            delivered: prev[audience][category].delivered + deliveredCount,
            received: prev[audience][category].received + receivedCount,
            running: [newEntry, ...prev[audience][category].running],
          },
        },
      };
    });
  };

  const handleAddTemplate = (newTemplate, setActiveView) => {
    const templateWithMetadata = {
      ...newTemplate,
      id: templates.length + 1,
      status: 'PENDING',
      language: 'en_US',
      updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };

    setTemplates((prev) => [templateWithMetadata, ...prev]);
    setActiveView('templates-list');
  };

  const views = {
    B2BView: <B2BView />,
    B2CView: <B2CView />,
    InboxView: <InboxView />,
    ContactsView: <ContactsView />,
    TemplatesView: (launchHandler, onCreate) => (
      <TemplatesView templates={templates} onCreateClick={onCreate} onLaunch={launchHandler} />
    ),
    CreateTemplate: (onAdd, onCancel) => <CreateTemplate onAddTemplate={onAdd} onCancel={onCancel} />,
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await logoutApi({ refresh: refreshToken });
      } catch {
        // Continue with local logout even if backend token invalidation fails.
      }
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    setAuthStep('login');
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const root = document.documentElement;

    const applyTheme = () => {
      const resolvedTheme = themeMode === 'system' ? (mediaQuery.matches ? 'dark' : 'light') : themeMode;
      root.setAttribute('data-theme', resolvedTheme);
    };

    applyTheme();
    localStorage.setItem('themeMode', themeMode);

    if (themeMode !== 'system') {
      return undefined;
    }

    const handleSystemThemeChange = () => applyTheme();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, [themeMode]);

  // Listen for logout event from API interceptor (when token refresh fails)
  useEffect(() => {
    const handleLogoutEvent = () => {
      handleLogout();
    };

    window.addEventListener('logout', handleLogoutEvent);
    return () => window.removeEventListener('logout', handleLogoutEvent);
  }, []);

  // Show Dashboard if authenticated or authStep is dashboard
  if (isAuthenticated || authStep === 'dashboard') {
    return (
      <Dashboard
        views={views}
        stats={stats}
        handleLaunch={handleLaunch}
        handleAddTemplate={handleAddTemplate}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        onLogout={handleLogout}
      />
    );
  }

  // Show Auth pages
  if (['login', 'signup', 'signup-verify', 'forgot-password', 'password-reset-verify'].includes(authStep)) {
    return <AuthContainer />;
  }

  // Default: Show Dashboard
  return (
    <Dashboard
      views={views}
      stats={stats}
      handleLaunch={handleLaunch}
      handleAddTemplate={handleAddTemplate}
      themeMode={themeMode}
      setThemeMode={setThemeMode}
      onLogout={handleLogout}
    />
  );
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Toast />
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;