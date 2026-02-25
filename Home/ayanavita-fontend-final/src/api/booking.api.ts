import { http } from "./http";

export type BookingBranch = {
  id: number;
  code: string;
  name: string;
  address: string;
  phone?: string | null;
};

export type BookingService = {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  category?: string | null;
  goals: string[];
  durationMin: number;
  price: number;
  ratingAvg: number;
  bookedCount: number;
  tag?: string | null;
  icon?: string | null;
  imageUrl?: string | null;
  heroImageUrl?: string | null;
  branchIds: number[];
};

export type BookingSpecialist = {
  id: number;
  code: string;
  name: string;
  level: string;
  bio?: string | null;
  branchIds: number[];
  serviceIds: number[];
};

export const bookingApi = {
  branches: async (params?: { serviceId?: number }): Promise<BookingBranch[]> =>
    (await http.get("/booking/branches", { params })).data,
  services: async (params?: { branchId?: number }): Promise<BookingService[]> => {
    const { data } = await http.get("/booking/services", { params });
    return Array.isArray(data) ? data : (data?.items ?? []);
  },
  specialists: async (): Promise<BookingSpecialist[]> =>
    (await http.get("/booking/specialists")).data,
  slotSuggestions: async (params: { branchId: number; serviceId: number; date: string }) =>
    (await http.get("/booking/slot-suggestions", { params })).data as {
      durationMin: number;
      capacity: number;
      slots: { time: string; available: boolean; occupied: number }[];
    },
};
