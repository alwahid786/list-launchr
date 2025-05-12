import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AuthGuard = () => {
  const { currentUser, loading } = useAuth();

  // If auth is loading, show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the protected route
  return <Outlet />;
};

export const ProGuard = () => {
  const { currentUser, loading, isPro } = useAuth();

  // If auth is loading, show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If not pro user, redirect to upgrade page
  if (!isPro()) {
    return <Navigate to="/dashboard/upgrade" replace />;
  }

  // If pro user, render the protected route
  return <Outlet />;
};

export default AuthGuard;