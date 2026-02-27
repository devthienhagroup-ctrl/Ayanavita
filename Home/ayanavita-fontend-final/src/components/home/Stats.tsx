// src/components/home/Stats.tsx
import React from "react";

type Tone = "amber" | "indigo" | "cyan" | "emerald";

interface ItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  tone: Tone;
}

const Item: React.FC<ItemProps> = ({ icon, value, label, tone }) => {
  const toneMap: Record<Tone, string> = {
    amber: "bg-amber-100 text-amber-700",
    indigo: "bg-indigo-100 text-indigo-700",
    cyan: "bg-cyan-100 text-cyan-700",
    emerald: "bg-emerald-100 text-emerald-700",
  };

  return (
      <div className="rounded-3xl bg-white p-6 text-center ring-1 ring-slate-200 shadow-sm hover:shadow-md transition duration-300">
        <div
            className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl ${toneMap[tone]}`}
        >
          <span className="text-lg">{icon}</span>
        </div>

        <div className="text-3xl font-extrabold text-slate-900">{value}</div>
        <div className="mt-1 text-sm text-slate-600">{label}</div>
      </div>
  );
};

export const Stats: React.FC = () => {
  return (
      <section className="w-full py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Item
                icon={<i className="fa-solid fa-users"></i>}
                value="30K+"
                label="Học viên"
                tone="amber"
            />
            <Item
                icon={<i className="fa-solid fa-book"></i>}
                value="120+"
                label="Khóa học"
                tone="indigo"
            />
            <Item
                icon={<i className="fa-solid fa-graduation-cap"></i>}
                value="50+"
                label="Giảng viên"
                tone="cyan"
            />
            <Item
                icon={<i className="fa-solid fa-star"></i>}
                value="4.8★"
                label="Đánh giá"
                tone="emerald"
            />
          </div>
        </div>
      </section>
  );
};