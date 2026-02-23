import { useCallback, useEffect, useMemo, useState } from "react";
import { coursesApi } from "../api/courses.api";

export type GateReason = "OK" | "NO_ENROLLMENT" | "PENDING_PAYMENT" | "CANCELLED" | "UNAUTHORIZED" | "ERROR";

export type GateState = {
  loading: boolean;
  allowed: boolean;
  reason: GateReason;
  message?: string;
  orderId?: string | null;
};

export function useEnrollmentGate(courseId?: string) {
  const [state, setState] = useState<GateState>({
    loading: false,
    allowed: false,
    reason: "NO_ENROLLMENT",
  });

  const refresh = useCallback(async () => {
    if (!courseId) return;

    setState((s) => ({ ...s, loading: true }));

    // Tip: token trong localStorage theo http.ts của bạn
    const token = localStorage.getItem("aya_access_token");
    if (!token) {
      setState({ loading: false, allowed: false, reason: "UNAUTHORIZED", message: "Bạn chưa đăng nhập." });
      return;
    }

    /**
     * Backend bạn có rule:
     * - chỉ được xem lesson/progress khi Enrollment ACTIVE (admin bypass)
     * Trong prototype gate nhanh: thử gọi order (tạo) hoặc dựa endpoint khác nếu bạn có.
     *
     * Ở đây mình chọn cách "nhẹ": thử gọi POST /courses/:id/order để lấy orderId,
     * nếu backend trả 403/401 thì chặn tương ứng.
     *
     * Nếu bạn đã có endpoint GET /me/courses -> mình sẽ đổi sang chuẩn đó (ổn hơn).
     */
    try {
      // nếu bạn không muốn tạo order khi refresh, hãy đổi sang endpoint enrollment list
      const order = await coursesApi.order(courseId);
      // nếu order trả về, tức user có thể tạo order => đang chưa ACTIVE
      setState({
        loading: false,
        allowed: false,
        reason: "PENDING_PAYMENT",
        orderId: order?.id ?? null,
        message: "Bạn cần thanh toán để kích hoạt Enrollment ACTIVE.",
      });
    } catch (e: any) {
      const code = e?.response?.status;

      if (code === 401) {
        setState({ loading: false, allowed: false, reason: "UNAUTHORIZED", message: "Phiên đăng nhập hết hạn." });
        return;
      }
      if (code === 403) {
        setState({ loading: false, allowed: false, reason: "NO_ENROLLMENT", message: "Bạn chưa có quyền học khóa này." });
        return;
      }

      // nếu backend đã active thì thường order endpoint có thể trả lỗi khác; bạn chỉnh theo backend thực tế
      setState({ loading: false, allowed: false, reason: "ERROR", message: "Không kiểm tra được quyền truy cập." });
    }
  }, [courseId]);

  // auto refresh
  useEffect(() => {
    void refresh();
  }, [refresh]);

  const api = useMemo(() => {
    return {
      enrollOrCreateOrder: async () => {
        if (!courseId) return null;
        const o = await coursesApi.order(courseId);
        return o;
      },
    };
  }, [courseId]);

  // ✅ trả thẳng allowed/reason để LessonDetailPage không bị lỗi `.allowed`
  return {
    ...state,
    refresh,
    api,
  };
}
