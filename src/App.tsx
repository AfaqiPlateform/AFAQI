import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Home';
import Platform from './pages/Platform';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Simulateur from './pages/Simulateur';
import AppShell from './components/AppShell';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import FullPageLoader from './components/FullPageLoader';

function AppContent() {
  const { authReady } = useAuth();

  if (!authReady) {
    return <FullPageLoader />;
  }

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Authenticated routes — wrapped in AppShell (sidebar + navbar) */}
        <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="/platform" element={<Platform />} />
          <Route path="/simulateur" element={<Simulateur />} />
          <Route path="/profile/*" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
