
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Array<"student" | "faculty" | "warden">;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (roles && user && !roles.includes(user.role as "student" | "faculty" | "warden")) {
    return <Navigate to={user.role === 'student' ? '/student-dashboard' : '/staff-dashboard'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
