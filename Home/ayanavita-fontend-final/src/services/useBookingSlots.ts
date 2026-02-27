// src/services/useBookingSlots.ts
import { useCallback, useMemo, useState } from "react";

export type Slot = { t: string; available: boolean };

const BASE = ["09:00", "10:00", "11:00", "13:30", "14:30", "15:30", "16:30", "18:30", "19:30"];

function gen(): Slot[] {
  return BASE.map((t) => ({ t, available: Math.random() > 0.25 }));
}

export function useBookingSlots() {
  const [slots, setSlots] = useState<Slot[]>(() => gen());
  const [selected, setSelected] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setSlots(gen());
    setSelected(null);
  }, []);

  const pick = useCallback((t: string) => setSelected(t), []);

  const selectedSlot = useMemo(() => selected, [selected]);

  return { slots, selectedSlot, pick, refresh, clearPick: () => setSelected(null) };
}
