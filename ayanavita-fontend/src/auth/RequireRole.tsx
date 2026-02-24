import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../state/auth.store";

export function RequireRole({
  role,
  children,
}: {
  role: "ADMIN" | "USER";
  children: React.ReactNode;
}) {
  const { status, user } = useAuth();

  if (status === "loading") return <div style={{ padding: 16 }}>Loading...</div>;
  if (status !== "authed" || !user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/courses" replace />;

  return <>{children}</>;
}
