// utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const USER_KEY = "user_info";

export const saveSession = async (access: string, refresh: string, user: any) => {
  await AsyncStorage.multiSet([
    [ACCESS_KEY, access],
    [REFRESH_KEY, refresh],
    [USER_KEY, JSON.stringify(user)],
  ]);
};

export const getAccessToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(ACCESS_KEY);
};

export const getRefreshToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(REFRESH_KEY);
};

export const getUser = async (): Promise<any | null> => {
  const data = await AsyncStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearSession = async () => {
  await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY, USER_KEY]);
};
