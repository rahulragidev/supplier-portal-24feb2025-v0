import { api } from "@workspace/api-client";
import { useStore } from "@workspace/store";
import type { AppUser, NewAppUser, UUID } from "@workspace/types";
import useSWR, { useSWRConfig } from "swr";

const USERS_KEY = "users";

interface UseUsersOptions {
  onSuccess?: (data: AppUser[]) => void;
}

export function useUsers(options: UseUsersOptions = {}) {
  const setUsers = useStore((state) => state.setUsers);

  const {
    data = [],
    error,
    isLoading,
  } = useSWR<AppUser[]>(USERS_KEY, () => api.getUsers(), {
    onSuccess: (data) => {
      setUsers(data);
      options.onSuccess?.(data);
    },
  });

  const { mutate } = useSWRConfig();

  const createUser = async (userData: NewAppUser) => {
    try {
      const newUser = await api.createUser(userData);
      await mutate(USERS_KEY);
      return newUser;
    } catch (err) {
      console.error("Create user error:", err);
      throw new Error("Failed to create user");
    }
  };

  const updateUser = async (uid: UUID, userData: Partial<AppUser>) => {
    try {
      const updatedUser = await api.updateUser(uid, userData);
      await mutate(USERS_KEY);
      return updatedUser;
    } catch (err) {
      console.error("Update user error:", err);
      throw new Error("Failed to update user");
    }
  };

  const deleteUser = async (uid: UUID) => {
    try {
      await api.deleteUser(uid);
      await mutate(USERS_KEY);
    } catch (err) {
      console.error("Delete user error:", err);
      throw new Error("Failed to delete user");
    }
  };

  return {
    users: data,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
  };
}
