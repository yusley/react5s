import { Navigate, Outlet } from 'react-router-dom';
import { useContext} from "react";
import AuthContext from './AuthService/AuthContext';
import useAxios from './useAxios';

function PrivateRoute() {
    const { user } = useContext(AuthContext);
    return user ? <Outlet /> : <Navigate to="/login" replace />;
  }


function LoginPrivateRoute() {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/" replace /> : <Outlet />;
}

const AdminPrivateRoute = () => {

  const { authTokens, user} = useContext(AuthContext);

  return user ? authTokens.user.is_admin ? <Outlet /> : <Navigate to="/proibido" replace/> : <Navigate to="/login" replace />;

}

const SuperAdminPrivateRoute = () => {
  const { authTokens, user} = useContext(AuthContext);
  return user ? authTokens.user.is_superuser ? <Outlet /> : <Navigate to="/proibido" replace/> : <Navigate to="/login" replace />;
}


export {PrivateRoute, LoginPrivateRoute, AdminPrivateRoute, SuperAdminPrivateRoute};