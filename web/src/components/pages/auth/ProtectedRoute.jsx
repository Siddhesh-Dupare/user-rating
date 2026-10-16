import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, roles }) {
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dashboardPaths = {
    ADMIN: "/admin/dashboard",
    USER: "/user/dashboard",
    STORE_OWNER: "/store-owner/dashboard",
  };

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={dashboardPaths[user.role] || "/login"} replace />;
  }

  return children;
}
