// src/services/useBookingSlots.ts
import { useCallback, useMemo, useState } from "react";
import { bookingApi } from "../api/booking.api";

export type Slot = { t: string; available: boolean; occupied?: number };

export function useBookingSlots() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [capacity, setCapacity] = useState(0);
  const [durationMin, setDurationMin] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async (params?: { branchId?: number; serviceId?: number; date?: string }) => {
    if (!params?.branchId || !params?.serviceId || !params?.date) {
      setSlots([]);
      setCapacity(0);
      setDurationMin(0);
      setSelected(null);
      return;
    }

    setLoading(true);
    try {
      const data = await bookingApi.slotSuggestions({
        branchId: params.branchId,
        serviceId: params.serviceId,
        date: params.date,
      });
      const nextSlots = (data?.slots || []).map((s) => ({ t: s.time, available: !!s.available, occupied: s.occupied }));
      setSlots(nextSlots);
      setCapacity(Number(data?.capacity || 0));
      setDurationMin(Number(data?.durationMin || 0));
      setSelected((prev) => (nextSlots.some((s) => s.t === prev && s.available) ? prev : null));
    } finally {
      setLoading(false);
    }
  }, []);

  const pick = useCallback((t: string) => setSelected(t), []);
  const clearPick = useCallback(() => setSelected(null), []);
  const selectedSlot = useMemo(() => selected, [selected]);

  return { slots, selectedSlot, pick, refresh, clearPick, capacity, durationMin, loading };
}
