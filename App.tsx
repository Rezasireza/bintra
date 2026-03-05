import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/layout/navbar';
import Footer from './components/layout/footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import HubungiKami from './pages/HubungiKami';
import InformasiPPDB from './pages/InformasiPPDB';
import Beasiswa from './pages/Beasiswa';
import ArticleDetail from './pages/ArticleDetail';
import PlaceholderPage from './pages/PlaceholderPage';
import PortalELearningComingSoon from './pages/PortalELearningComingSoon';

// Admin Pages
import { AdminGuard } from './src/admin/AdminGuard';
import { AdminLayout } from './src/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { LandingSettingsEditor } from './pages/admin/LandingSettingsEditor';
import { Articles } from './pages/admin/Articles';
import { ArticleEdit } from './pages/admin/ArticleEdit';
import { MyProfile } from './pages/admin/MyProfile';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout wrapper for pages that need Nav and Footer
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

import { checkSupabaseConnection } from './src/supabase';

const App: React.FC = () => {
  useEffect(() => {
    if (import.meta.env.DEV) {
      checkSupabaseConnection();
    }
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/about" element={<MainLayout><About /></MainLayout>} />
          <Route path="/hubungi-kami" element={<MainLayout><HubungiKami /></MainLayout>} />
          <Route path="/informasi-ppdb" element={<MainLayout><InformasiPPDB /></MainLayout>} />
          <Route path="/beasiswa" element={<MainLayout><Beasiswa /></MainLayout>} />

          {/* Article Routes */}
          <Route path="/artikel/:slug" element={<MainLayout><ArticleDetail /></MainLayout>} />

          {/* Placeholder Routes */}
          <Route path="/portal" element={<PlaceholderPage />} />
          <Route path="/portal-e-learning-coming-soon" element={<PortalELearningComingSoon />} />

          {/* Auth & Public forms */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Secure Admin Routes */}
          <Route path="/admin" element={<AdminGuard />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="settings" element={<LandingSettingsEditor />} />
              <Route path="articles" element={<Articles />} />
              <Route path="articles/new" element={<ArticleEdit />} />
              <Route path="articles/edit/:id" element={<ArticleEdit />} />
              <Route path="my-profile" element={<MyProfile />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
};

export default App;