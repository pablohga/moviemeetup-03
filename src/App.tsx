import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Discover } from './pages/Discover';
import { WatchPartyManagement } from './pages/WatchPartyManagement';
import { Settings } from './pages/Settings';
import { RealtimeInteraction } from './pages/RealtimeInteraction';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route
                path="/watch-party/create"
                element={
                  <ProtectedRoute>
                    <WatchPartyManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/watch-party/:id"
                element={
                  <ProtectedRoute>
                    <RealtimeInteraction />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}