import type { Review } from "./reviews.types";
import { loadReviews, saveReviews } from "./reviews.storage";

const seed: Review[] = [
  {
    id: "RV-001",
    name: "Minh Anh",
    anonymous: false,
    category: "service",
    item: "Facial Luxury 90 phút",
    branch: "Q.1",
    rating: 5,
    text: "Kỹ thuật viên rất chuyên nghiệp, da sáng và ẩm rõ rệt sau liệu trình. Không gian sạch, mùi tinh dầu dễ chịu. Sẽ quay lại.",
    img: "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?auto=format&fit=crop&w=1400&q=80",
    verified: true,
    helpful: 12,
    createdAt: "2025-12-02T09:20:00.000Z",
    reply: {
      by: "AYANAVITA",
      text: "Cảm ơn chị Minh Anh. Bên em rất vui vì chị hài lòng. Hẹn chị lịch tái khám da sau 7–10 ngày để tối ưu kết quả nhé.",
    },
  },
  {
    id: "RV-002",
    name: "Hải Nam",
    anonymous: false,
    category: "service",
    item: "Massage trị liệu vai gáy",
    branch: "Hà Nội",
    rating: 4,
    text: "Giảm căng cơ tốt, nhân viên tư vấn kỹ. Nếu có thêm trà thảo mộc sau liệu trình thì tuyệt hơn.",
    img: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1400&q=80",
    verified: true,
    helpful: 7,
    createdAt: "2025-11-18T11:05:00.000Z",
  },
  {
    id: "RV-003",
    name: "Khách hàng",
    anonymous: true,
    category: "product",
    item: "Serum phục hồi AYA",
    branch: "",
    rating: 5,
    text: "Dùng 2 tuần thấy da đỡ kích ứng và mịn hơn, thấm nhanh không bết. Mình sẽ mua lại.",
    img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1400&q=80",
    verified: false,
    helpful: 5,
    createdAt: "2025-11-05T16:40:00.000Z",
  },
  {
    id: "RV-004",
    name: "Lan Phương",
    anonymous: false,
    category: "product",
    item: "Kem chống nắng AYA",
    branch: "",
    rating: 3,
    text: "Kết cấu ổn, nâng tone nhẹ. Với da dầu mình hơi bóng nếu dùng nhiều. Mong có phiên bản oil-control.",
    img: "https://images.unsplash.com/photo-1585238342028-4e5a9f4d6c4f?auto=format&fit=crop&w=1400&q=80",
    verified: true,
    helpful: 2,
    createdAt: "2025-10-21T08:10:00.000Z",
  },
];

export function ensureSeed() {
  const existing = loadReviews();
  if (existing.length) return;
  saveReviews(seed);
}
