import type { AppUser } from "@workspace/database/types";
import { create } from "zustand";

export interface StoreState {
  users: AppUser[];
  setUsers: (users: AppUser[]) => void;
  addUser: (user: AppUser) => void;
  updateUser: (uid: string, userData: Partial<AppUser>) => void;
  deleteUser: (uid: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  users: [],

  setUsers: (users) => set({ users }),

  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),

  updateUser: (uid, userData) =>
    set((state) => ({
      users: state.users.map((user) => (user.uid === uid ? { ...user, ...userData } : user)),
    })),

  deleteUser: (uid) =>
    set((state) => ({
      users: state.users.filter((user) => user.uid !== uid),
    })),
}));
