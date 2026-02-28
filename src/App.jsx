import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SongPage from './pages/SongPage';
import VideoPage from './pages/VideoPage';
import AdminDashboard from './admin/AdminDashboard';
import AdminLogin from './admin/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-[#f8c5c0] to-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/song/:id" element={<SongPage />} />
          <Route path="/video/:id" element={<VideoPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
