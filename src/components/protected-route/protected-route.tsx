import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthChecked, selectUser } from '../../services/slices/authSlice';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
}

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector((state) => selectIsAuthChecked(state));
  const user = useSelector((state) => selectUser(state));

  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from.pathname} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
