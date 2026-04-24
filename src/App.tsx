import React, { useEffect, useState } from 'react';
import type { Page } from './types';
import LandingPage from './pages/LandingPage';
import AssignmentMaker from './pages/AssignmentMaker';
import CreateWorkspace from './pages/CreateWorkspace';
import AdminPage from './pages/AdminPage';

const getPageFromPath = (): Page => {
  const path = window.location.pathname.toLowerCase();
  if (path.startsWith('/assignment-maker')) return 'assignment-maker';
  if (path.startsWith('/create')) return 'create';
  if (path.startsWith('/admin')) return 'admin';
  return 'landing';
};

const App: React.FC = () => {
  const [page, setPage] = useState<Page>(getPageFromPath);

  useEffect(() => {
    const handlePopState = () => setPage(getPageFromPath());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (page === 'landing' && window.location.pathname !== '/') {
      window.history.replaceState(null, '', '/');
    }
    if (page === 'assignment-maker' && !window.location.pathname.startsWith('/assignment-maker')) {
      window.history.replaceState(null, '', '/assignment-maker');
    }
    if (page === 'create' && !window.location.pathname.startsWith('/create/')) {
      window.history.replaceState(null, '', '/create/chat');
    }
    if (page === 'admin' && !window.location.pathname.startsWith('/admin')) {
      window.history.replaceState(null, '', '/admin');
    }
  }, [page]);

  if (page === 'assignment-maker') {
    return <AssignmentMaker onBack={() => setPage('landing')} />;
  }

  if (page === 'create') {
    return (
      <CreateWorkspace
        onBack={() => setPage('landing')}
        onOpenAssignment={() => setPage('assignment-maker')}
      />
    );
  }

  if (page === 'admin') {
    return <AdminPage onBack={() => setPage('landing')} />;
  }

  return <LandingPage onNavigate={setPage} currentPage={page} />;
};

export default App;
