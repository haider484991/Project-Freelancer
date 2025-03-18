import React from 'react';
import { useRouter } from 'next/router';
import { useAppSelector } from '../hooks/useRedux';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  React.useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!isAuthenticated && !loading) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show nothing while loading or redirecting
  if (loading || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute; 