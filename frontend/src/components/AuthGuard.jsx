import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { LoadingSpinner } from './ui';

const AuthGuard = () => {
  const { currentUser, loading } = useAuth();

  // If auth is loading, show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
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
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If user doesn't have Pro access, redirect to upgrade page
  if (!isPro()) {
    return <Navigate to="/dashboard/upgrade" replace />;
  }

  // User has Pro access, allow them to proceed
  return <Outlet />;
};

export default AuthGuard;