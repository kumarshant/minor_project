import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function GuestRoute({ children }) {
  const { user } = useAuthStore();

  // Already logged in → go to generate
  if (user) return <Navigate to="/generate" replace />;

  return children;
}
