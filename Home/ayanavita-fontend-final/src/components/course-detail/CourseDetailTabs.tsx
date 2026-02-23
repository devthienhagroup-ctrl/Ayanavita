// src/components/course-detail/CourseDetailTabs.tsx
import React from "react";

export type CourseDetailTab = "overview" | "curriculum" | "reviews" | "faq";

export function CourseDetailTabs({
  tab,
  onChange,
}: {
  tab: CourseDetailTab;
  onChange: (t: CourseDetailTab) => void;
}) {
  const btn = (key: CourseDetailTab, label: React.ReactNode, icon: string) => {
    const active = tab === key;
    return (
      <button
        type="button"
        className={`btn ${active ? "btn-primary" : ""}`}
        onClick={() => onChange(key)}
      >
        <i className={`fa-solid ${icon} mr-2`} />
        {label}
      </button>
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {btn("overview", "Tổng quan", "fa-circle-info")}
      {btn("curriculum", "Curriculum", "fa-list-check")}
      {btn("reviews", "Reviews", "fa-comments")}
      {btn("faq", "FAQ", "fa-circle-question")}
    </div>
  );
}
