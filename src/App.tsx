import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Navbar from './components/Navbar';
import InfoPage from './pages/InfoPage';
import MedalsPage from './pages/MedalsPage';
import HistoryPage from './pages/HistoryPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfilePage from './pages/ProfilePage';
import './styles/background.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen">
          <div className="animated-background">
            <div className="geometric-shapes">
              <div className="shape shape-1" />
              <div className="shape shape-2" />
              <div className="shape shape-3" />
            </div>
            <div className="animated-grid" />
          </div>
          <Navbar />
          <main className="pt-20 relative z-10">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />
              <Route path="/info" element={
                <ProtectedRoute>
                  <InfoPage />
                </ProtectedRoute>
              } />
              <Route path="/medals" element={
                <ProtectedRoute>
                  <MedalsPage />
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;