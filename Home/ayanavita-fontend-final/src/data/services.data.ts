// src/data/services.data.ts

export type ServiceCat = "skin" | "body" | "health" | "package";
export type ServiceGoal = "relax" | "acne" | "bright" | "restore" | "pain";

export type AudienceChip = {
  label: string;
  iconClass: string; // FontAwesome class
  iconColorClass?: string; // tailwind text-*
};

export type Service = {
  // Shared (list + detail)
  id: string; // e.g. "SV-01"
  name: string;
  cat: ServiceCat;
  goal: ServiceGoal[];
  duration: number; // minutes
  price: number;
  rating: number;
  booked: number;
  img: string; // list thumbnail
  tag: string;

  // Detail-only
  heroImage: string;
  benefits: string[];
  process: string[];
  audienceChips: AudienceChip[];
  note?: string;
};

export const SERVICES: Service[] = [
  {
    id: "SV-01",
    name: "Chăm sóc da chuyên sâu",
    cat: "skin",
    goal: ["restore", "bright"],
    duration: 75,
    price: 590000,
    rating: 4.9,
    booked: 1320,
    img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=70",
    tag: "Best seller",

    heroImage:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=70",
    benefits: [
      "Làm sạch – tẩy tế bào chết nhẹ, giảm bít tắc.",
      "Phục hồi hàng rào da, tăng độ ẩm và đàn hồi.",
      "Hỗ trợ sáng da, đều màu theo phác đồ.",
    ],
    process: [
      "Khai thác tình trạng da & mục tiêu.",
      "Làm sạch + cân bằng pH.",
      "Tẩy tế bào chết nhẹ / làm mềm sừng.",
      "Đắp mask – massage thư giãn.",
      "Serum phục hồi + khoá ẩm.",
      "Hướng dẫn chăm sóc tại nhà.",
    ],
    audienceChips: [
      {
        label: "Da nhạy cảm",
        iconClass: "fa-solid fa-face-smile",
        iconColorClass: "text-amber-600",
      },
      {
        label: "Thiếu ẩm",
        iconClass: "fa-solid fa-droplet",
        iconColorClass: "text-indigo-600",
      },
      {
        label: "Da yếu sau treatment",
        iconClass: "fa-solid fa-bolt",
        iconColorClass: "text-rose-600",
      },
    ],
    note: "Không khuyến nghị khi da đang viêm cấp/đang tổn thương hở (demo nội dung).",
  },

  {
    id: "SV-02",
    name: "Liệu trình giảm mụn",
    cat: "skin",
    goal: ["acne", "restore"],
    duration: 90,
    price: 790000,
    rating: 4.8,
    booked: 980,
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=70",
    tag: "Phác đồ",

    heroImage:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=70",
    benefits: [
      "Giảm viêm – giảm bít tắc theo phác đồ.",
      "Hạn chế tái phát nhờ làm sạch và cân bằng.",
      "Tư vấn routine tại nhà theo tình trạng.",
    ],
    process: [
      "Soi da + đánh giá tình trạng mụn.",
      "Làm sạch – cân bằng – làm mềm sừng.",
      "Lấy nhân mụn (nếu phù hợp) + sát khuẩn.",
      "Serum giảm viêm + mask làm dịu.",
      "Hướng dẫn chăm sóc & lịch tái khám.",
    ],
    audienceChips: [
      { label: "Da dầu", iconClass: "fa-solid fa-droplet", iconColorClass: "text-indigo-600" },
      { label: "Mụn ẩn", iconClass: "fa-solid fa-circle", iconColorClass: "text-amber-600" },
      { label: "Mụn viêm nhẹ", iconClass: "fa-solid fa-bolt", iconColorClass: "text-rose-600" },
    ],
    note: "Nếu mụn viêm nặng, sẽ cần tư vấn bác sĩ/điều trị kết hợp (demo nội dung).",
  },

  {
    id: "SV-03",
    name: "Massage thư giãn toàn thân",
    cat: "body",
    goal: ["relax"],
    duration: 60,
    price: 450000,
    rating: 4.7,
    booked: 1640,
    img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=70",
    tag: "Relax",

    heroImage:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1600&q=70",
    benefits: [
      "Giảm căng thẳng, thư giãn cơ thể.",
      "Cải thiện tuần hoàn, ngủ sâu hơn.",
      "Giảm mỏi vai gáy – lưng nhẹ.",
    ],
    process: [
      "Thăm hỏi tình trạng cơ thể.",
      "Làm ấm – khởi động cơ.",
      "Massage toàn thân theo kỹ thuật thư giãn.",
      "Kéo giãn nhẹ + hồi phục.",
    ],
    audienceChips: [
      { label: "Stress", iconClass: "fa-solid fa-heart", iconColorClass: "text-rose-600" },
      { label: "Mất ngủ", iconClass: "fa-solid fa-moon", iconColorClass: "text-indigo-600" },
      { label: "Mỏi cơ", iconClass: "fa-solid fa-dumbbell", iconColorClass: "text-amber-600" },
    ],
  },

  {
    id: "SV-04",
    name: "Gội đầu dưỡng sinh",
    cat: "health",
    goal: ["relax", "pain"],
    duration: 60,
    price: 320000,
    rating: 4.8,
    booked: 2100,
    img: "https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?auto=format&fit=crop&w=1200&q=70",
    tag: "Hot",

    heroImage:
      "https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?auto=format&fit=crop&w=1600&q=70",
    benefits: [
      "Thư giãn da đầu – giảm căng thẳng.",
      "Giảm mỏi cổ vai gáy nhẹ.",
      "Cảm giác sạch – thơm – dễ chịu.",
    ],
    process: [
      "Làm ẩm – xoa bóp da đầu.",
      "Gội – ủ – xả thảo mộc (demo).",
      "Massage vùng cổ vai gáy.",
      "Sấy nhẹ – dưỡng tóc.",
    ],
    audienceChips: [
      { label: "Thư giãn", iconClass: "fa-solid fa-spa", iconColorClass: "text-indigo-600" },
      { label: "Giảm mỏi", iconClass: "fa-solid fa-hand", iconColorClass: "text-amber-600" },
      { label: "Detox", iconClass: "fa-solid fa-leaf", iconColorClass: "text-emerald-600" },
    ],
  },

  {
    id: "SV-05",
    name: "Trị liệu vai gáy",
    cat: "health",
    goal: ["pain", "relax"],
    duration: 45,
    price: 350000,
    rating: 4.6,
    booked: 860,
    img: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=70",
    tag: "Office",

    heroImage:
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1600&q=70",
    benefits: [
      "Giảm đau nhức vai gáy – lưng trên.",
      "Tăng linh hoạt vùng cổ vai.",
      "Phù hợp dân văn phòng ngồi lâu.",
    ],
    process: [
      "Check điểm đau – vùng căng cứng.",
      "Làm nóng cơ – thả lỏng.",
      "Ấn huyệt + kéo giãn nhẹ.",
      "Hướng dẫn bài tập tại nhà (demo).",
    ],
    audienceChips: [
      { label: "Văn phòng", iconClass: "fa-solid fa-briefcase", iconColorClass: "text-slate-600" },
      { label: "Đau mỏi", iconClass: "fa-solid fa-bolt", iconColorClass: "text-rose-600" },
      { label: "Giãn cơ", iconClass: "fa-solid fa-person-running", iconColorClass: "text-amber-600" },
    ],
  },

  {
    id: "SV-06",
    name: "Gói 5 buổi phục hồi da",
    cat: "package",
    goal: ["restore"],
    duration: 100,
    price: 2990000,
    rating: 4.9,
    booked: 420,
    img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=70",
    tag: "Combo",

    heroImage:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1600&q=70",
    benefits: [
      "Tiết kiệm chi phí so với mua lẻ.",
      "Theo sát tiến trình phục hồi da.",
      "Tối ưu hiệu quả theo lịch trình.",
    ],
    process: [
      "Buổi 1: Soi da – lập kế hoạch.",
      "Buổi 2–4: Treatment nhẹ theo tình trạng.",
      "Buổi 5: Tổng kết – routine duy trì.",
    ],
    audienceChips: [
      { label: "Combo", iconClass: "fa-solid fa-box", iconColorClass: "text-amber-600" },
      { label: "Phục hồi", iconClass: "fa-solid fa-shield-heart", iconColorClass: "text-emerald-600" },
      { label: "Lộ trình", iconClass: "fa-solid fa-route", iconColorClass: "text-indigo-600" },
    ],
  },

  {
    id: "SV-07",
    name: "Peel nhẹ sáng da",
    cat: "skin",
    goal: ["bright"],
    duration: 50,
    price: 520000,
    rating: 4.7,
    booked: 510,
    img: "https://images.unsplash.com/photo-1556228578-9e6f345f2fa9?auto=format&fit=crop&w=1200&q=70",
    tag: "Glow",

    heroImage:
      "https://images.unsplash.com/photo-1556228578-9e6f345f2fa9?auto=format&fit=crop&w=1600&q=70",
    benefits: [
      "Hỗ trợ sáng da – đều màu.",
      "Giảm xỉn màu do tế bào chết.",
      "Làm mịn bề mặt da.",
    ],
    process: [
      "Làm sạch – chuẩn bị da.",
      "Peel nhẹ theo thời gian phù hợp.",
      "Trung hoà – làm dịu – phục hồi.",
      "Hướng dẫn chống nắng & dưỡng ẩm.",
    ],
    audienceChips: [
      { label: "Glow", iconClass: "fa-solid fa-star", iconColorClass: "text-amber-600" },
      { label: "Đều màu", iconClass: "fa-solid fa-palette", iconColorClass: "text-indigo-600" },
      { label: "Mịn da", iconClass: "fa-solid fa-face-smile", iconColorClass: "text-emerald-600" },
    ],
  },

  {
    id: "SV-08",
    name: "Detox cơ thể",
    cat: "body",
    goal: ["restore", "relax"],
    duration: 95,
    price: 890000,
    rating: 4.8,
    booked: 260,
    img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=70",
    tag: "Premium",

    heroImage:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=70",
    benefits: [
      "Giảm nặng mỏi, thư giãn cơ thể.",
      "Hỗ trợ tuần hoàn – cảm giác nhẹ người.",
      "Trải nghiệm premium theo chuẩn spa.",
    ],
    process: [
      "Warm-up – ủ ấm.",
      "Massage thải độc (demo).",
      "Kéo giãn – hồi phục.",
      "Tea/refresh (demo).",
    ],
    audienceChips: [
      { label: "Premium", iconClass: "fa-solid fa-crown", iconColorClass: "text-amber-600" },
      { label: "Thư giãn", iconClass: "fa-solid fa-spa", iconColorClass: "text-indigo-600" },
      { label: "Restore", iconClass: "fa-solid fa-shield-heart", iconColorClass: "text-emerald-600" },
    ],
  },
];

export const BRANCHES = ["AYANAVITA • Q.1", "AYANAVITA • Q.7", "AYANAVITA • Thủ Đức"];

export const SLOTS = ["09:00", "10:30", "13:30", "15:00", "19:00"];

export const REVIEWS = [
  { name: "Ngọc A.", rating: 5.0, text: "Da dịu hơn rõ rệt, quy trình nhẹ nhàng, tư vấn kỹ." },
  { name: "Hạnh B.", rating: 4.8, text: "Không gian sạch, chuyên viên làm cẩn thận. Sẽ quay lại." },
];

export function getServiceById(id?: string | null) {
  if (!id) return SERVICES[0];
  const normalized = String(id).toUpperCase();
  return SERVICES.find((s) => s.id === normalized) || SERVICES[0];
}
