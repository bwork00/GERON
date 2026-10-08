import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { TrainingProvider } from './context/TrainingContext';
import { AppLayout } from './components/layout/AppLayout';

export function App() {
  return (
    <AuthProvider>
      <TrainingProvider>
        <AppLayout />
      </TrainingProvider>
    </AuthProvider>
  );
}

export default App;
