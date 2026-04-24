import React, { useState } from 'react';
import type { Page } from './types';
import LandingPage from './pages/LandingPage';
import AssignmentMaker from './pages/AssignmentMaker';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('landing');

  if (page === 'assignment-maker') {
    return <AssignmentMaker onBack={() => setPage('landing')} />;
  }

  return <LandingPage onNavigate={setPage} currentPage={page} />;
};

export default App;
