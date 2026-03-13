import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) {
        setIsAdmin(false);
      } else {
        const email = session.user?.email;
        setIsAdmin(email === "renan.crr@outlook.com");
      }

      setLoading(false);
    };

    checkSession();
  }, []); // ✅ só roda uma vez ao montar o componente

  if (loading) return null;

  if (!isAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return <>{children}</>;
}