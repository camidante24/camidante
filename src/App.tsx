/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {lazy, Suspense, useEffect, type ReactNode} from 'react';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';
import {Navbar} from './components/Navbar';
import {Footer} from './components/Footer';
import {AdminRoute} from './components/AdminRoute';
import {ErrorBoundary} from './components/ErrorBoundary';
import {AuthProvider} from './context/AuthContext';
import NotFound from './pages/NotFound';

const Home = lazy(() => import('./pages/Home'));
const Article = lazy(() => import('./pages/Article'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageFallback = () => (
  <div className="container-custom py-24">
    <p className="text-on-surface-variant font-sans">Cargando...</p>
  </div>
);

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary">
      {!isDashboard && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<ErrorBoundary><Home /></ErrorBoundary>} />
              <Route path="/read/:id" element={<ErrorBoundary><Article /></ErrorBoundary>} />
              <Route path="/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
              <Route
                path="/dashboard"
                element={
                  <AdminRoute>
                    <ErrorBoundary><Dashboard /></ErrorBoundary>
                  </AdminRoute>
                }
              />
              <Route path="/profile" element={<ErrorBoundary><Profile /></ErrorBoundary>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
