import React from "react";

export type EnrollmentGateReason =
  | "NO_ENROLLMENT"
  | "PENDING_PAYMENT"
  | "CANCELLED"
  | "UNAUTHORIZED"
  | "ERROR";

export type EnrollmentGateState = {
  loading?: boolean;

  /** true = được xem lesson/progress */
  allowed: boolean;

  /** lý do bị chặn (khi allowed=false) */
  reason?: EnrollmentGateReason;

  /** thông tin enrollment nếu có */
  enrollment?: {
    courseId: string;
    status: "ACTIVE" | "PENDING" | "CANCELLED";
  } | null;

  /** thông tin order nếu có */
  order?: {
    id: string;
    status: "PENDING" | "PAID" | "FAILED";
    amount?: number | null;
    createdAt?: string | null;
  } | null;

  /** admin bypass (nếu bạn có role) */
  isAdminBypass?: boolean;

  /** message tuỳ biến */
  message?: string | null;
};

type Props = {
  courseTitle?: string;
  state: EnrollmentGateState;

  /** CTA tạo order/enroll */
  onEnroll?: () => Promise<void> | void;

  /** Refresh lại trạng thái enrollment/order */
  onRefresh?: () => Promise<void> | void;

  /** nếu bị 401 thì gọi login */
  onLogin?: () => void;

  /** (tuỳ chọn) admin mark paid nhanh */
  onMarkPaid?: () => Promise<void> | void;

  /** (tuỳ chọn) hủy enrollment */
  onCancelEnrollment?: () => Promise<void> | void;
};

function moneyVND(n: number) {
  try {
    return "₫ " + new Intl.NumberFormat("vi-VN").format(n);
  } catch {
    return `₫ ${n}`;
  }
}

function Pill({
  tone,
  children,
}: {
  tone: "brand" | "success" | "warning" | "muted" | "danger";
  children: React.ReactNode;
}) {
  const cls =
    tone === "brand"
      ? "border-indigo-200 bg-indigo-50 text-indigo-700"
      : tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "warning"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : tone === "danger"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-extrabold ${cls}`}
    >
      {children}
    </span>
  );
}

function Icon({
  name,
}: {
  name: "lock" | "info" | "warn" | "check" | "login" | "cart";
}) {
  const base = "h-5 w-5";
  switch (name) {
    case "lock":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none">
          <path
            d="M7 10V8a5 5 0 0 1 10 0v2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M6 10h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      );
    case "info":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 11v6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 7h.01"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );
    case "warn":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none">
          <path
            d="M10.3 4.2 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M12 9v4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 17h.01"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );
    case "check":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none">
          <path
            d="M20 6 9 17l-5-5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "login":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none">
          <path
            d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M10 17l5-5-5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 12H3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "cart":
      return (
        <svg className={base} viewBox="0 0 24 24" fill="none">
          <path
            d="M6 6h15l-2 9H7L6 6Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M6 6 5 3H2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      );
    default:
      return null;
  }
}

export function EnrollmentGatePanel({
  courseTitle,
  state,
  onEnroll,
  onRefresh,
  onLogin,
  onMarkPaid,
  onCancelEnrollment,
}: Props) {
  const loading = !!state.loading;

  // Nếu allowed thì bạn có thể không render panel (tùy nơi dùng)
  if (state.allowed) return null;

  const title = courseTitle ?? "Khóa học";
  const reason = state.reason ?? "NO_ENROLLMENT";

  const is401 = reason === "UNAUTHORIZED";

  const headerTone =
    reason === "PENDING_PAYMENT"
      ? "warning"
      : reason === "CANCELLED"
      ? "muted"
      : reason === "UNAUTHORIZED"
      ? "warning"
      : reason === "ERROR"
      ? "danger"
      : "brand";

  const headerIcon =
    reason === "PENDING_PAYMENT"
      ? "warn"
      : reason === "UNAUTHORIZED"
      ? "login"
      : reason === "ERROR"
      ? "warn"
      : "lock";

  const headline =
    reason === "PENDING_PAYMENT"
      ? "Bạn cần thanh toán để mở khóa khóa học"
      : reason === "CANCELLED"
      ? "Enrollment đã bị hủy"
      : reason === "UNAUTHORIZED"
      ? "Bạn cần đăng nhập để tiếp tục"
      : reason === "ERROR"
      ? "Không tải được trạng thái enrollment"
      : "Khóa học đang bị khóa";

  const desc =
    state.message ??
    (reason === "PENDING_PAYMENT"
      ? "Đơn hàng đang ở trạng thái PENDING. Sau khi thanh toán, hệ thống sẽ kích hoạt Enrollment ACTIVE."
      : reason === "CANCELLED"
      ? "Bạn có thể enroll lại để tiếp tục học."
      : reason === "UNAUTHORIZED"
      ? "Phiên đăng nhập hết hạn hoặc chưa đăng nhập."
      : reason === "ERROR"
      ? "Hãy thử Refresh. Nếu vẫn lỗi, kiểm tra backend /auth/me và enrollment endpoints."
      : "Bạn cần Enrollment ACTIVE để xem bài học và ghi nhận progress.");

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(2,6,23,0.06)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
              headerTone === "brand"
                ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                : headerTone === "warning"
                ? "bg-gradient-to-br from-amber-400 to-yellow-300 text-slate-900"
                : headerTone === "danger"
                ? "bg-gradient-to-br from-rose-500 to-orange-400 text-white"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            <Icon name={headerIcon as any} />
          </div>

          <div className="min-w-0">
            <div className="text-xs font-extrabold text-slate-500">ENROLLMENT GATE</div>
            <div className="mt-1 text-lg font-extrabold text-slate-900">{headline}</div>
            <div className="mt-1 text-sm text-slate-600">
              Khóa học: <span className="font-extrabold">{title}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {reason === "PENDING_PAYMENT" && <Pill tone="warning">PENDING</Pill>}
          {reason === "NO_ENROLLMENT" && <Pill tone="brand">LOCKED</Pill>}
          {reason === "CANCELLED" && <Pill tone="muted">CANCELLED</Pill>}
          {reason === "UNAUTHORIZED" && <Pill tone="warning">LOGIN</Pill>}
          {reason === "ERROR" && <Pill tone="danger">ERROR</Pill>}
          {state.isAdminBypass && <Pill tone="success">ADMIN BYPASS</Pill>}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        {desc}
      </div>

      {/* Order info */}
      {state.order && (
        <div className="mt-4 grid gap-2 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-extrabold text-slate-900">Order</div>
            <div className="flex flex-wrap gap-2">
              {state.order.status === "PAID" && <Pill tone="success">PAID</Pill>}
              {state.order.status === "PENDING" && <Pill tone="warning">PENDING</Pill>}
              {state.order.status === "FAILED" && <Pill tone="danger">FAILED</Pill>}
            </div>
          </div>
          <div className="text-sm text-slate-700">
            <div>
              <span className="font-extrabold">ID:</span> {state.order.id}
            </div>
            {typeof state.order.amount === "number" && (
              <div>
                <span className="font-extrabold">Amount:</span> {moneyVND(state.order.amount)}
              </div>
            )}
            {state.order.createdAt && (
              <div>
                <span className="font-extrabold">Created:</span>{" "}
                {new Date(state.order.createdAt).toLocaleString("vi-VN")}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {is401 ? (
          <button
            type="button"
            onClick={onLogin}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-300 px-4 py-3 text-sm font-extrabold text-slate-900 shadow-[0_12px_24px_rgba(245,158,11,0.18)] hover:brightness-[1.03]"
            disabled={loading}
          >
            <Icon name="login" />
            Đăng nhập
          </button>
        ) : (
          <button
            type="button"
            onClick={onEnroll}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 px-4 py-3 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(79,70,229,0.20)] hover:brightness-[1.05]"
            disabled={loading || !onEnroll}
            title={!onEnroll ? "Chưa gắn handler onEnroll" : undefined}
          >
            <Icon name="cart" />
            Enroll / Tạo đơn hàng
          </button>
        )}

        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-extrabold text-slate-900 hover:bg-slate-50"
          disabled={loading || !onRefresh}
          title={!onRefresh ? "Chưa gắn handler onRefresh" : undefined}
        >
          <Icon name="info" />
          Refresh
        </button>

        {state.isAdminBypass && onMarkPaid && (
          <button
            type="button"
            onClick={onMarkPaid}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 px-4 py-3 text-sm font-extrabold text-white hover:brightness-[1.04]"
            disabled={loading}
            title="Admin: mark paid"
          >
            <Icon name="check" />
            Mark Paid
          </button>
        )}

        {onCancelEnrollment && (
          <button
            type="button"
            onClick={onCancelEnrollment}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-extrabold text-rose-700 hover:bg-rose-100"
            disabled={loading}
          >
            <Icon name="lock" />
            Hủy enrollment
          </button>
        )}
      </div>

      {loading && (
        <div className="mt-3 text-xs font-extrabold text-slate-500">
          Đang kiểm tra quyền truy cập…
        </div>
      )}
    </div>
  );
}
