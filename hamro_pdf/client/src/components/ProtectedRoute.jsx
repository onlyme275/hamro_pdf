import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuthenticated, selectUserLoading } from "@/store/slices/userSlice";

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectUserLoading);
    const location = useLocation();

    if (loading) {
        // Optional: Add a loading spinner here
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        // Redirect to login page with the return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;
