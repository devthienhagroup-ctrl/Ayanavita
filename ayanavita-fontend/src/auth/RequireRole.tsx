import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../state/auth.store";

export function RequireRole({
  roles,
  children,
}: {
  roles: Array<"ADMIN" | "USER" | "STAFF" | "MANAGER">;
  children: React.ReactNode;
}) {
  const { status, user } = useAuth();

  if (status === "loading") return <div style={{ padding: 16 }}>Loading...</div>;
  if (status !== "authed" || !user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role as "ADMIN" | "USER" | "STAFF" | "MANAGER")) {
    const fallback = user.role === "STAFF" ? "/admin/spa" : "/courses";
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
