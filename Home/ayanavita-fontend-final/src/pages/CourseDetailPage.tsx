// src/pages/CourseDetailPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { SiteHeader } from "../components/layout/SiteHeader";
import { Footer } from "../components/layout/Footer";

import { LMS_COURSES, LMS_VOUCHERS, categoryLabel, type LmsCourse, type LmsLesson } from "../data/lmsCourses.data";
import { computeFinalPrice, findVoucher, moneyVND } from "../services/lmsPricing.utils";
import { courseSeed, imgSeed, personSeed } from "../services/lmsImage.utils";


import { PreviewSidebar } from "../components/course-detail/PreviewSidebar";

import { useOutsideClick, useEscapeKey, useScrollLock } from "../hooks/useUiGuards";
import { CourseDetailTab, CourseDetailTabs } from "../components/course-detail/CourseDetailTabs";
import { CurriculumSection } from "../components/course-detail/CurriculumSection";

type OrderStatus = "NONE" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";
type Order = { id: string; status: OrderStatus; createdAt: string };

function uid(prefix = "ID") {
  return prefix + "-" + Math.random().toString(16).slice(2, 8).toUpperCase();
}

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const nav = useNavigate();

  const [tab, setTab] = useState<CourseDetailTab>("overview");

  const course: LmsCourse = useMemo(() => {
    const hit = LMS_COURSES.find((c) => c.id === courseId);
    return hit || LMS_COURSES[0];
  }, [courseId]);

  // ----- computed aggregates
  const lessons = useMemo(() => (course.modules || []).flatMap((m) => m.lessons || []), [course]);
  const totalMinutes = useMemo(() => lessons.reduce((s, x) => s + Number(x.duration || 0), 0), [lessons]);

  // ----- hero images
  const seed = courseSeed(course);
  const heroImg = useMemo(() => imgSeed("hero-" + seed, 1600, 720), [seed]);
  const thumbImg = useMemo(() => imgSeed("thumb-" + seed, 800, 420), [seed]);

  const instructorAvatar = useMemo(
    () => imgSeed(personSeed(course.instructor?.name || "instructor"), 200, 200),
    [course.instructor?.name]
  );

  // ----- pricing
  const basePrice = Number(course.sales?.basePrice ?? course.price ?? 0);
  const defaultDiscount = Number(course.sales?.defaultDiscount ?? 0);
  const priceNoVoucher = useMemo(() => computeFinalPrice(basePrice, defaultDiscount, null), [basePrice, defaultDiscount]);

  // ----- preview modal (simple)
  const [previewLesson, setPreviewLesson] = useState<LmsLesson | null>(null);

  // ----- checkout state
  const [ckName, setCkName] = useState("");
  const [ckEmail, setCkEmail] = useState("");
  const [ckPhone, setCkPhone] = useState("");
  const [ckVoucher, setCkVoucher] = useState("");
  const [ckAgree, setCkAgree] = useState(false);

  const voucher = useMemo(() => findVoucher(LMS_VOUCHERS, ckVoucher, course.id), [ckVoucher, course.id]);
  const finalPricing = useMemo(
    () => computeFinalPrice(basePrice, defaultDiscount, voucher),
    [basePrice, defaultDiscount, voucher]
  );

  const [order, setOrder] = useState<Order>({ id: "—", status: "NONE", createdAt: "" });

  function setOrderStatus(next: OrderStatus) {
    setOrder((o) => {
      if (!o || o.status === "NONE") return o;
      return { ...o, status: next, createdAt: new Date().toISOString() };
    });
  }

  function createOrder() {
    if (!ckName.trim() || !ckEmail.trim()) {
      window.alert("Vui lòng nhập Họ tên và Email để tạo đơn.");
      return;
    }
    setOrder({ id: uid("OD"), status: "PENDING", createdAt: new Date().toISOString() });
    window.alert("Đã tạo đơn hàng (prototype).");
  }

  function payNow() {
    if (!order || order.status === "NONE") {
      window.alert("Chưa có đơn hàng. Bấm “Tạo đơn hàng” trước.");
      return;
    }
    if (!ckAgree) {
      window.alert("Vui lòng tick đồng ý điều khoản (demo).");
      return;
    }
    setOrderStatus("PAID");
    window.alert("Thanh toán thành công (demo).");
  }

  // ----- course switch dropdown
  function onChangeCourse(nextId: string) {
    // reset page state
    setTab("overview");
    setPreviewLesson(null);
    setOrder({ id: "—", status: "NONE", createdAt: "" });
    // navigate
    nav(`/courses/${nextId}`); // ✅ đổi path nếu router bạn khác
  }

  // allow hash open checkout
  useEffect(() => {
    if (location.hash === "#checkout") {
      // giữ tab overview, chỉ scroll
      const el = document.getElementById("checkout");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }, [course.id]);

  // ===== Preview modal UX
  const previewOpen = !!previewLesson;
  useScrollLock(previewOpen);
  useEscapeKey(() => setPreviewLesson(null), previewOpen);

  const previewRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick(previewRef, () => setPreviewLesson(null), previewOpen);

  // ===== order chip style
  const orderChip = useMemo(() => {
    const st = order.status;
    const icon =
      st === "PENDING" ? "text-amber-500" : st === "PAID" ? "text-emerald-500" : st === "FAILED" ? "text-rose-500" : st === "REFUNDED" ? "text-slate-500" : "text-slate-400";
    const text = st === "NONE" ? "None" : st;
    return { icon, text };
  }, [order.status]);

  return (
    <div className="text-slate-900">
      <SiteHeader />

      <main className="px-4 pb-10">
        <div className="max-w-6xl mx-auto grid gap-4">
          {/* Header tools (sticky-ish like prototype) */}
          <div className="card p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold">
                A
              </div>
              <div>
                <div className="font-extrabold">AYANAVITA</div>
                <div className="text-xs font-extrabold text-slate-500">Course Detail</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                className="btn"
                value={course.id}
                onChange={(e) => onChangeCourse(e.target.value)}
                aria-label="select course"
              >
                {LMS_COURSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.id})
                  </option>
                ))}
              </select>

              <a href="#checkout" className="btn btn-primary">
                <i className="fa-solid fa-credit-card mr-2" />
                Checkout
              </a>
            </div>
          </div>

          {/* HERO */}
          <section className="card overflow-hidden relative">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url("${heroImg}")` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/55 to-transparent" />

            <div className="relative p-6 md:p-8 grid gap-6 lg:grid-cols-12 items-center text-white">
              <div className="lg:col-span-8">
                <div className="text-xs font-extrabold opacity-90">{categoryLabel(course.category)}</div>
                <h1 className="mt-2 text-3xl md:text-4xl font-extrabold leading-tight">{course.title}</h1>
                <div className="mt-3 text-white/90 font-bold">{course.sales?.landing?.hero?.subtitle || course.desc}</div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="chip">
                    <i className="fa-solid fa-star text-amber-400" /> {course.rating}
                  </span>
                  <span className="chip">
                    <i className="fa-solid fa-users text-white" />{" "}
                    {new Intl.NumberFormat("vi-VN").format(course.students)} học viên
                  </span>
                  <span className="chip">
                    <i className="fa-solid fa-clock text-white" /> {totalMinutes} phút
                  </span>
                  <span className="chip">
                    <i className="fa-solid fa-layer-group text-white" /> {course.modules.length} modules
                  </span>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button type="button" className="btn btn-accent" onClick={() => (location.hash = "#checkout")}>
                    <i className="fa-solid fa-bolt mr-2" />
                    Mua ngay
                  </button>
                  <button type="button" className="btn" onClick={() => setTab("curriculum")}>
                    <i className="fa-solid fa-eye mr-2" />
                    Xem preview
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={async () => {
                      const url = `${location.origin}${location.pathname}#course=${encodeURIComponent(course.id)}`;
                      try {
                        await navigator.clipboard.writeText(url);
                        window.alert("Đã copy link: " + url);
                      } catch {
                        window.alert("Không copy được (trình duyệt chặn).");
                      }
                    }}
                  >
                    <i className="fa-solid fa-link mr-2" />
                    Copy link
                  </button>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <img className="h-11 w-11 rounded-full object-cover border-2 border-white/90" src={instructorAvatar} alt="Instructor avatar" />
                  <div>
                    <div className="font-extrabold leading-5">{course.instructor?.name}</div>
                    <div className="text-xs text-white/80 font-bold">{course.instructor?.bio}</div>
                  </div>
                </div>
              </div>

              {/* Pricing card */}
              <div className="lg:col-span-4">
                <div className="card p-5 text-slate-900">
                  <img className="w-full h-40 object-cover rounded-2xl ring-1 ring-slate-200" src={thumbImg} alt="Course thumbnail" />
                  <div className="mt-4 text-xs font-extrabold text-slate-500">Giá hôm nay</div>
                  <div className="mt-1 text-3xl font-extrabold">{moneyVND(priceNoVoucher.price)}</div>
                  <div className="mt-2 text-sm text-slate-600">{priceNoVoucher.note}</div>

                  <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm text-slate-700">
                    <div className="font-extrabold">Bao gồm</div>
                    <ul className="mt-2 space-y-1">
                      <li>• Truy cập trọn đời (demo)</li>
                      <li>• Cập nhật nội dung</li>
                      <li>• Chứng nhận hoàn thành</li>
                      <li>• Hỗ trợ Q&A</li>
                    </ul>
                  </div>

                  <a href="#checkout" className="btn btn-primary w-full text-center mt-3">
                    <i className="fa-solid fa-cart-shopping mr-2" />
                    Đăng ký học
                  </a>

                  <div className="text-xs text-slate-500 text-center mt-2">
                    Giá/giảm lấy từ Sales config (default discount).
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CONTENT GRID */}
          <section className="grid gap-4 lg:grid-cols-12">
            {/* Left */}
            <div className="lg:col-span-8 grid gap-4">
              <div className="card p-5">
                <CourseDetailTabs tab={tab} onChange={setTab} />

                <div className="mt-4">
                  {tab === "overview" ? (
                    <div>
                      <div className="text-lg font-extrabold">Bạn sẽ học được gì</div>
                      <div className="mt-2 text-sm text-slate-700">{course.desc}</div>

                      <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="font-extrabold">Highlights</div>
                        <div className="mt-2 text-sm text-slate-700">{course.sales?.landing?.hero?.highlight || "—"}</div>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <img className="w-full h-40 object-cover rounded-2xl ring-1 ring-slate-200" alt="Gallery 1" src={imgSeed("gallery1-" + seed, 700, 420)} />
                        <img className="w-full h-40 object-cover rounded-2xl ring-1 ring-slate-200" alt="Gallery 2" src={imgSeed("gallery2-" + seed, 700, 420)} />
                        <img className="w-full h-40 object-cover rounded-2xl ring-1 ring-slate-200" alt="Gallery 3" src={imgSeed("gallery3-" + seed, 700, 420)} />
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                          <div className="text-xs font-extrabold text-slate-500">Đối tượng phù hợp</div>
                          <ul className="mt-2 text-sm text-slate-700 space-y-1">
                            <li>• Người mới bắt đầu muốn có lộ trình</li>
                            <li>• Dev cần build LMS thực tế</li>
                            <li>• Chủ khóa học muốn tối ưu bán hàng</li>
                          </ul>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                          <div className="text-xs font-extrabold text-slate-500">Yêu cầu</div>
                          <ul className="mt-2 text-sm text-slate-700 space-y-1">
                            <li>• Laptop + internet</li>
                            <li>• Kiến thức cơ bản (tùy khóa)</li>
                            <li>• Thực hành theo bài</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : null}

                  {tab === "curriculum" ? (
                    <div>
                      <div className="text-lg font-extrabold">Curriculum</div>
                      <div className="mt-2 text-sm text-slate-600">Danh sách module/bài học (có thumbnail + preview).</div>

                      <div className="mt-4">
                        <CurriculumSection course={course} onPreview={(l) => setPreviewLesson(l)} />
                      </div>
                    </div>
                  ) : null}

                  {tab === "reviews" ? (
                    <div>
                      <div className="text-lg font-extrabold">Reviews (demo)</div>
                      <div className="mt-2 text-sm text-slate-600">Lấy từ landing proof + mô phỏng vài review.</div>

                      <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="font-extrabold">{course.sales?.landing?.proof?.text || "—"}</div>
                        <ul className="mt-2 text-sm text-slate-700 list-disc pl-5">
                          {(course.sales?.landing?.proof?.bullets || []).map((x, i) => (
                            <li key={i}>{x}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                          <div className="flex items-center gap-3">
                            <img className="h-11 w-11 rounded-full object-cover border-2 border-white" src={imgSeed("reviewer-minh-" + seed, 200, 200)} alt="Reviewer 1" />
                            <div>
                              <div className="font-extrabold">Minh (Dev)</div>
                              <div className="text-xs text-slate-500 font-bold">5.0 ★</div>
                            </div>
                          </div>
                          <div className="text-sm text-slate-600 mt-3">“Rõ ràng, có checklist, làm được ngay.”</div>
                        </div>

                        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                          <div className="flex items-center gap-3">
                            <img className="h-11 w-11 rounded-full object-cover border-2 border-white" src={imgSeed("reviewer-lan-" + seed, 200, 200)} alt="Reviewer 2" />
                            <div>
                              <div className="font-extrabold">Lan (Creator)</div>
                              <div className="text-xs text-slate-500 font-bold">4.8 ★</div>
                            </div>
                          </div>
                          <div className="text-sm text-slate-600 mt-3">“Phần sales/checkout rất thực chiến.”</div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <img className="w-full h-32 object-cover rounded-2xl ring-1 ring-slate-200" alt="Review image 1" src={imgSeed("reviewimg1-" + seed, 700, 360)} />
                        <img className="w-full h-32 object-cover rounded-2xl ring-1 ring-slate-200" alt="Review image 2" src={imgSeed("reviewimg2-" + seed, 700, 360)} />
                        <img className="w-full h-32 object-cover rounded-2xl ring-1 ring-slate-200" alt="Review image 3" src={imgSeed("reviewimg3-" + seed, 700, 360)} />
                      </div>
                    </div>
                  ) : null}

                  {tab === "faq" ? (
                    <div>
                      <div className="text-lg font-extrabold">FAQ</div>
                      <div className="mt-2 text-sm text-slate-600">Câu hỏi thường gặp (từ landing faq).</div>

                      <div className="mt-4 grid gap-2">
                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                          <div className="font-extrabold">{course.sales?.landing?.faq?.q1 || "—"}</div>
                          <div className="text-sm text-slate-700 mt-1">{course.sales?.landing?.faq?.a1 || "—"}</div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                          <div className="font-extrabold">{course.sales?.landing?.faq?.q2 || "—"}</div>
                          <div className="text-sm text-slate-700 mt-1">{course.sales?.landing?.faq?.a2 || "—"}</div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Checkout */}
              <div id="checkout" className="card p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="text-xs font-extrabold text-slate-500">Checkout</div>
                    <div className="text-2xl font-extrabold">Thanh toán (Prototype)</div>
                    <div className="mt-1 text-sm text-slate-600">
                      Mô phỏng: tạo đơn + đổi trạng thái thanh toán.
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-primary" type="button" onClick={createOrder}>
                      <i className="fa-solid fa-receipt mr-2" />
                      Tạo đơn hàng
                    </button>
                    <button className="btn btn-accent" type="button" onClick={payNow}>
                      <i className="fa-solid fa-credit-card mr-2" />
                      Thanh toán (demo)
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <div className="font-extrabold">Thông tin học viên</div>

                    <div className="mt-3 grid gap-3">
                      <div>
                        <div className="text-xs font-extrabold text-slate-500">Họ và tên</div>
                        <input className="field mt-2" value={ckName} onChange={(e) => setCkName(e.target.value)} placeholder="Nguyễn Văn A" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-500">Email</div>
                        <input className="field mt-2" value={ckEmail} onChange={(e) => setCkEmail(e.target.value)} placeholder="email@example.com" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-500">Số điện thoại (tuỳ chọn)</div>
                        <input className="field mt-2" value={ckPhone} onChange={(e) => setCkPhone(e.target.value)} placeholder="090..." />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-500">Voucher (demo)</div>
                        <input className="field mt-2" value={ckVoucher} onChange={(e) => setCkVoucher(e.target.value)} placeholder="AYA20" />
                        <div className="text-xs text-slate-500 mt-2">Prototype: validate voucher theo rules ở `LMS_VOUCHERS`.</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <div className="font-extrabold">Tóm tắt đơn</div>

                    <div className="mt-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img className="w-16 h-11 rounded-xl object-cover border border-slate-200 bg-slate-200" src={thumbImg} alt="Course thumb" />
                          <div>
                            <div className="font-extrabold">{course.title}</div>
                            <div className="text-xs text-slate-500 mt-1">
                              {categoryLabel(course.category)} • {course.id} • Rating {course.rating}
                            </div>
                          </div>
                        </div>
                        <span className="chip">
                          <i className="fa-solid fa-tag text-emerald-600" />
                          {moneyVND(finalPricing.price)}
                        </span>
                      </div>

                      <div className="mt-3 text-sm text-slate-700">
                        <div className="flex items-center justify-between">
                          <span>Giá niêm yết</span>
                          <b>{moneyVND(basePrice)}</b>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span>Giảm mặc định</span>
                          <b>{Math.max(0, Math.min(100, defaultDiscount))}%</b>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span>Voucher</span>
                          <b>
                            {voucher
                              ? voucher.type === "percent"
                                ? `-${voucher.value}% (${voucher.code})`
                                : `-${moneyVND(voucher.value)} (${voucher.code})`
                              : "—"}
                          </b>
                        </div>
                        <div className="my-3 border-t border-slate-200" />
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold">Tổng thanh toán</span>
                          <b className="text-lg">{moneyVND(finalPricing.price)}</b>
                        </div>
                        <div className="text-xs text-slate-500 mt-2">{finalPricing.note}</div>
                      </div>

                      <label className="mt-4 flex items-center gap-2 text-sm font-extrabold">
                        <input type="checkbox" className="h-4 w-4 rounded border-slate-300" checked={ckAgree} onChange={(e) => setCkAgree(e.target.checked)} />
                        Tôi đồng ý điều khoản (demo)
                      </label>

                      <div className="mt-4 grid gap-2">
                        <button type="button" className="btn" onClick={() => window.alert("Đã tính lại giá (demo).")}>
                          <i className="fa-solid fa-calculator mr-2" />
                          Tính lại giá
                        </button>
                        <button type="button" className="btn btn-primary" onClick={payNow}>
                          <i className="fa-solid fa-lock mr-2" />
                          Thanh toán an toàn (demo)
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                      <div className="font-extrabold">Đơn hàng</div>

                      <div className="mt-2 text-sm text-slate-700">
                        <div className="flex items-center justify-between">
                          <span>Mã đơn</span>
                          <b>{order.id}</b>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span>Trạng thái</span>
                          <span className="chip">
                            <i className={`fa-solid fa-circle ${orderChip.icon}`} />
                            {orderChip.text}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span>Thời gian</span>
                          <span className="text-slate-500">
                            {order.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN") : "—"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button type="button" className="btn" onClick={() => setOrderStatus("PENDING")}>
                          Pending
                        </button>
                        <button type="button" className="btn btn-accent" onClick={() => setOrderStatus("PAID")}>
                          Paid
                        </button>
                        <button type="button" className="btn" onClick={() => setOrderStatus("FAILED")}>
                          Failed
                        </button>
                        <button type="button" className="btn" onClick={() => setOrderStatus("REFUNDED")}>
                          Refunded
                        </button>
                      </div>

                      <div className="mt-3 text-xs text-slate-500">Prototype: trạng thái đơn chỉ lưu trong state.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <aside className="lg:col-span-4 grid gap-4">
              <PreviewSidebar course={course} onPreview={(l) => setPreviewLesson(l)} />

              <div className="card p-5">
                <div className="font-extrabold">CTA nhanh</div>
                <div className="mt-3 grid gap-2">
                  <a href="#checkout" className="btn btn-primary w-full text-center">
                    <i className="fa-solid fa-cart-shopping mr-2" />
                    Đăng ký ngay
                  </a>
                  <button type="button" className="btn w-full" onClick={() => window.alert("Demo: mở chat/tư vấn (sau nối Zalo/FB).")}>
                    <i className="fa-solid fa-message mr-2" />
                    Nhắn tư vấn (demo)
                  </button>
                </div>
                <div className="mt-3 text-xs text-slate-500">Prototype: CTA nối xuống checkout.</div>
              </div>

              <div className="card p-5">
                <div className="font-extrabold">Gợi ý thao tác</div>
                <div className="mt-2 text-sm text-slate-700">
                  • Chọn course ở dropdown.<br />
                  • Xem curriculum & preview.<br />
                  • Cuộn xuống Checkout để tạo đơn và đổi trạng thái thanh toán.
                </div>
              </div>
            </aside>
          </section>

          <div className="text-center text-sm text-slate-500">© 2025 AYANAVITA • Course Detail Prototype</div>
        </div>
      </main>

      <Footer />

      {/* Preview Modal */}
      {previewOpen ? (
        <div className="fixed inset-0 z-[90] bg-black/55 flex items-center justify-center p-4">
          <div ref={previewRef} className="card w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-extrabold text-slate-500">Preview</div>
                <div className="text-lg font-extrabold">{previewLesson?.title}</div>
              </div>
              <button className="btn h-10 w-10 p-0" type="button" onClick={() => setPreviewLesson(null)} aria-label="close">
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            <div className="p-6 grid gap-3">
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 text-sm text-slate-700">
                <div>
                  <b>Course:</b> {course.title}
                </div>
                <div className="mt-1">
                  <b>Type:</b> {String(previewLesson?.type || "").toUpperCase()}
                </div>
                <div className="mt-1">
                  <b>Duration:</b> {previewLesson?.duration ?? 0} phút
                </div>
                <div className="mt-1">
                  <b>Source:</b> {previewLesson?.source || "—"}
                </div>
                {previewLesson?.note ? (
                  <div className="mt-2 text-slate-600">
                    <b>Note:</b> {previewLesson.note}
                  </div>
                ) : null}
              </div>

              <button type="button" className="btn btn-primary" onClick={() => window.alert("Prototype: mở player/reader thật ở bước sau.")}>
                <i className="fa-solid fa-play mr-2" />
                Mở bài học (demo)
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
