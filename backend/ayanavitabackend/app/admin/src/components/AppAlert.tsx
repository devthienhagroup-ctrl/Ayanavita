import React from "react";

type AlertKind = "info" | "success" | "warning" | "error";

export function AppAlert({
  kind = "info",
  title,
  message,
}: {
  kind?: AlertKind;
  title: string;
  message: string;
}) {
  return (
    <div className={`app-alert app-alert-${kind}`} role="alert">
      <div className="app-alert-title">{title}</div>
      <div className="app-alert-message">{message}</div>
    </div>
  );
}
