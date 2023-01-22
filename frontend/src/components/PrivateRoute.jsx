import { useAuthStatus } from '../hooks/useAuthStatus';
import { Navigate, Outlet } from 'react-router';
import Spinner from '../components/SpinnerFixed';

const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) {
    return <Spinner />;
  }

  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
