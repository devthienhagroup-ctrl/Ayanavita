import { http } from "./http";

export type MeRes = { id: string; email?: string; role?: string };

export const authApi = {
  async me(): Promise<MeRes> {
    const { data } = await http.get("/auth/me");
    return data;
  },
};
