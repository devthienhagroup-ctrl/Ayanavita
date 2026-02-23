// src/services/booking.demo.ts
export type DemoService = { id: string; name: string; duration: number; price: number; tag: string };
export type DemoStaff = { id: string; name: string; level: string };
export type DemoBranch = { id: string; name: string; address: string };

export const DEMO_SERVICES: DemoService[] = [
  { id: "sv1", name: "Chăm sóc da chuyên sâu", duration: 75, price: 690000, tag: "Da" },
  { id: "sv2", name: "Massage trị liệu cổ vai gáy", duration: 60, price: 490000, tag: "Sức khoẻ" },
  { id: "sv3", name: "Gội đầu dưỡng sinh", duration: 45, price: 320000, tag: "Thư giãn" },
  { id: "sv4", name: "Combo: Da + Massage", duration: 120, price: 1050000, tag: "Combo" },
];

export const DEMO_STAFF: DemoStaff[] = [
  { id: "st1", name: "Chuyên viên Linh", level: "Senior" },
  { id: "st2", name: "Chuyên viên Trang", level: "Expert" },
  { id: "st3", name: "Chuyên viên Mai", level: "Senior" },
  { id: "st4", name: "Chuyên viên Nam", level: "Therapist" },
];

export const DEMO_BRANCHES: DemoBranch[] = [
  { id: "b1", name: "AYANAVITA • Quận 1 (HCM)", address: "Số 12, đường A, Q1" },
  { id: "b2", name: "AYANAVITA • Cầu Giấy (HN)", address: "Số 88, đường B, Cầu Giấy" },
  { id: "b3", name: "AYANAVITA • Hải Châu (ĐN)", address: "Số 25, đường C, Hải Châu" },
];
