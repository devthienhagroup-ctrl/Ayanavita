// src/data/services.list.data.ts
export type ServiceListItem = {
  id: string; // "SV-01"
  name: string;
  cat: "skin" | "body" | "health" | "package";
  goal: Array<"relax" | "acne" | "bright" | "restore" | "pain">;
  dur: number; // minutes
  price: number; // VND
  rating: number; // 4.7...
  booked: number; // popularity
  img: string;
  tag: string;
};

export const SERVICE_LIST: ServiceListItem[] = [
  {
    id: "SV-01",
    name: "Chăm sóc da chuyên sâu",
    cat: "skin",
    goal: ["restore", "bright"],
    dur: 75,
    price: 590000,
    rating: 4.9,
    booked: 1320,
    img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=70",
    tag: "Best seller",
  },
  {
    id: "SV-02",
    name: "Liệu trình giảm mụn",
    cat: "skin",
    goal: ["acne", "restore"],
    dur: 90,
    price: 790000,
    rating: 4.8,
    booked: 980,
    img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=70",
    tag: "Phác đồ",
  },
  {
    id: "SV-03",
    name: "Massage thư giãn toàn thân",
    cat: "body",
    goal: ["relax"],
    dur: 60,
    price: 450000,
    rating: 4.7,
    booked: 1640,
    img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=70",
    tag: "Relax",
  },
  {
    id: "SV-04",
    name: "Gội đầu dưỡng sinh",
    cat: "health",
    goal: ["relax", "pain"],
    dur: 60,
    price: 320000,
    rating: 4.8,
    booked: 2100,
    img: "https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?auto=format&fit=crop&w=1200&q=70",
    tag: "Hot",
  },
  {
    id: "SV-05",
    name: "Trị liệu vai gáy",
    cat: "health",
    goal: ["pain", "relax"],
    dur: 45,
    price: 350000,
    rating: 4.6,
    booked: 860,
    img: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=70",
    tag: "Office",
  },
  {
    id: "SV-06",
    name: "Gói 5 buổi phục hồi da",
    cat: "package",
    goal: ["restore"],
    dur: 100,
    price: 2990000,
    rating: 4.9,
    booked: 420,
    img: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=70",
    tag: "Combo",
  },
  {
    id: "SV-07",
    name: "Peel nhẹ sáng da",
    cat: "skin",
    goal: ["bright"],
    dur: 50,
    price: 520000,
    rating: 4.7,
    booked: 510,
    img: "https://images.unsplash.com/photo-1556228578-9e6f345f2fa9?auto=format&fit=crop&w=1200&q=70",
    tag: "Glow",
  },
  {
    id: "SV-08",
    name: "Detox cơ thể",
    cat: "body",
    goal: ["restore", "relax"],
    dur: 95,
    price: 890000,
    rating: 4.8,
    booked: 260,
    img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=70",
    tag: "Premium",
  },
];
