import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { createStorage } from "./zustand-mmkv";

import { User } from "@/types";

export interface UserState {
    token: string | null;
    user: User | null;
}

export interface UserAction {
    signIn(token: string, user: User): void;
    logout(): void;
}

const storage = createStorage("user-storage");

export const useUserStore = create<UserState & UserAction>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            signIn: (token, user) => set({ token, user }),
            logout: () => set({ token: null, user: null }),
        }),
        {
            name: "user-storage",
            storage: createJSONStorage(() => storage),
        },
    ),
);
