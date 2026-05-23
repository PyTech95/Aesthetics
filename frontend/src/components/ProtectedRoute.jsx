import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user === null) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#FAF9F6]">
        <Loader2 className="h-6 w-6 animate-spin text-[#D4AF37]" strokeWidth={1.5} />
      </div>
    );
  }
  if (user === false) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/portal" replace />;
  }
  return children;
}
