import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/stores/auth';
import { ToastManager } from '@/stores/toast';
import { AppShell } from '@/components/layout/AppShell';
import { lazy, Suspense, type ReactNode } from 'react';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Community = lazy(() => import('@/pages/Community'));
const Rewards = lazy(() => import('@/pages/Rewards'));
const Transactions = lazy(() => import('@/pages/Transactions'));
const Profile = lazy(() => import('@/pages/Profile'));
const Friends = lazy(() => import('@/pages/Friends'));
const AtmLocation = lazy(() => import('@/pages/AtmLocation'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Admin = lazy(() => import('@/pages/Admin'));

function PageLoader() {
  return (
    <div className="flex h-96 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <ToastManager>
        <Routes>
          <Route path="/login" element={<PublicRoute><Suspense fallback={<PageLoader />}><Login /></Suspense></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Suspense fallback={<PageLoader />}><Register /></Suspense></PublicRoute>} />
          <Route element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
            <Route path="/" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
            <Route path="/community" element={<Suspense fallback={<PageLoader />}><Community /></Suspense>} />
            <Route path="/rewards" element={<Suspense fallback={<PageLoader />}><Rewards /></Suspense>} />
            <Route path="/transactions" element={<Suspense fallback={<PageLoader />}><Transactions /></Suspense>} />
            <Route path="/profile" element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>} />
            <Route path="/friends" element={<Suspense fallback={<PageLoader />}><Friends /></Suspense>} />
            <Route path="/atm-location" element={<Suspense fallback={<PageLoader />}><AtmLocation /></Suspense>} />
            <Route path="/admin" element={<AdminRoute><Suspense fallback={<PageLoader />}><Admin /></Suspense></AdminRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastManager>
    </AuthProvider>
  );
}

export default App;
