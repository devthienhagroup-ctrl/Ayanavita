// src/data/orderTracking.data.ts
export type PaymentStatus = "unpaid" | "paid" | "refund";

export type TrackOrder = {
  code: string;
  phone: string;
  name: string;
  addr: string;
  sub: number;
  ship: number;
  total: number;
  paymentStatus: PaymentStatus;
  step: number; // 0..4
  updatedAtISO?: string;
};

export const TRACK_STEPS: Array<{ t: string; d: string }> = [
  { t: "Đã tạo đơn", d: "Đơn hàng được ghi nhận trên hệ thống." },
  { t: "Đang xử lý", d: "Đóng gói sản phẩm và xác nhận tồn kho." },
  { t: "Đang giao", d: "Đơn vị vận chuyển đang giao hàng." },
  { t: "Giao thành công", d: "Khách đã nhận hàng." },
  { t: "Hoàn tất", d: "Kết thúc đơn hàng, có thể đánh giá." },
];

// Fallback demo nếu không tìm thấy trong localStorage
export const DEMO_TRACK_ORDER: TrackOrder = {
  code: "AYA-24001",
  phone: "0900000000",
  name: "Khách hàng Demo",
  addr: "Q.1, TP.HCM",
  sub: 837000,
  ship: 25000,
  total: 862000,
  paymentStatus: "unpaid",
  step: 2,
  updatedAtISO: new Date().toISOString(),
};
