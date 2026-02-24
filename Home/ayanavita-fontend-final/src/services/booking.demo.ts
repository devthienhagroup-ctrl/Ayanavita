import { useEffect, useState } from "react";
import { bookingApi } from "../api/booking.api";

export type DemoService = { id: string; name: string; duration: number; price: number; tag: string };
export type DemoStaff = { id: string; name: string; level: string };
export type DemoBranch = { id: string; name: string; address: string };

type CatalogState = {
  services: DemoService[];
  staff: DemoStaff[];
  branches: DemoBranch[];
  loading: boolean;
};

const EMPTY_STATE: CatalogState = { services: [], staff: [], branches: [], loading: true };

export function useBookingCatalog() {
  const [state, setState] = useState<CatalogState>(EMPTY_STATE);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [servicesRes, staffRes, branchesRes] = await Promise.all([
          bookingApi.services(),
          bookingApi.specialists(),
          bookingApi.branches(),
        ]);

        if (!mounted) return;

        const services: DemoService[] = (servicesRes || []).map((s: any) => ({
          id: String(s.id),
          name: s.name,
          duration: Number(s.durationMin ?? 0),
          price: Number(s.price ?? 0),
          tag: "Spa",
        }));

        const staff: DemoStaff[] = (staffRes || []).map((s: any) => ({
          id: String(s.id),
          name: s.name,
          level: s.level,
        }));

        const branches: DemoBranch[] = (branchesRes || []).map((b: any) => ({
          id: String(b.id),
          name: b.name,
          address: b.address,
        }));

        setState({ services, staff, branches, loading: false });
      } catch {
        if (!mounted) return;
        setState({ services: [], staff: [], branches: [], loading: false });
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return state;
}
