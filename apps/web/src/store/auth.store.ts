import { create } from "zustand";
import type { UserDTO } from "@haritha/shared-types";

interface AuthState {
  user: UserDTO | null;
  accessToken: string | null;
  isBootstrapping: boolean;
  setSession: (user: UserDTO, accessToken: string) => void;
  updateUser: (user: UserDTO) => void;
  setAccessToken: (accessToken: string | null) => void;
  setBootstrapping: (value: boolean) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isBootstrapping: true,
  setSession: (user, accessToken) => set({ user, accessToken }),
  updateUser: (user) => set({ user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setBootstrapping: (isBootstrapping) => set({ isBootstrapping }),
  clearSession: () => set({ user: null, accessToken: null }),
}));
