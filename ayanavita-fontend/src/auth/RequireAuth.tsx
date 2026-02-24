import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../state/auth.store";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  if (status === "loading") return <div style={{ padding: 16 }}>Loading...</div>;
  if (status !== "authed") return <Navigate to="/login" replace />;
  return <>{children}</>;
}
