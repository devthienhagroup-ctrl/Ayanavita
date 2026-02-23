// src/services/useBookings.ts
import { useCallback, useEffect, useState } from "react";
import type { Booking, BookingStatus } from "./booking.storage";
import { clearBookings, loadBookings, saveBookings } from "./booking.storage";

export function useBookings() {
  const [list, setList] = useState<Booking[]>([]);

  useEffect(() => {
    setList(loadBookings());
  }, []);

  const reload = useCallback(() => setList(loadBookings()), []);

  const add = useCallback((b: Booking) => {
    const next = [b, ...loadBookings()];
    saveBookings(next);
    setList(next);
  }, []);

  const setStatus = useCallback((id: string, status: BookingStatus) => {
    const next = loadBookings().map((x) => (x.id === id ? { ...x, status } : x));
    saveBookings(next);
    setList(next);
  }, []);

  const clearAll = useCallback(() => {
    clearBookings();
    setList([]);
  }, []);

  return { list, add, setStatus, clearAll, reload };
}
