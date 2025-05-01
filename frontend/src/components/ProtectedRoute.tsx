import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const isHydrated = useUserStore(state => state.isHydrated);
  const accessToken = useUserStore(state => state.user.accessToken);

  if (!isHydrated) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
