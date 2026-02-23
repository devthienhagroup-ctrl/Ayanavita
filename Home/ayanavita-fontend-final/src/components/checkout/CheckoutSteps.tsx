// src/components/checkout/CheckoutSteps.tsx
import React from "react";

export function CheckoutSteps({ step }: { step: 1 | 2 | 3 }) {
  const Step = ({ n, label }: { n: 1 | 2 | 3; label: string }) => (
    <div className={`step ${step >= n ? "active" : ""}`}>
      <span className="dot">{n}</span>
      {label}
    </div>
  );

  return (
    <div className="hidden lg:flex items-center gap-2">
      <Step n={1} label="Thông tin" />
      <Step n={2} label="Thanh toán" />
      <Step n={3} label="Xác nhận" />
    </div>
  );
}
