import { MMKV } from "react-native-mmkv";
import { StateStorage } from "zustand/middleware";

export const createStorage = (id: string): StateStorage => {
    const storage = new MMKV({
        id,
    });

    const zustandMMKV: StateStorage = {
        setItem: (name, value) => {
            return storage.set(name, value);
        },
        getItem: (name) => {
            const value = storage.getString(name);
            return value ?? null;
        },
        removeItem: (name) => {
            return storage.delete(name);
        },
    };

    return zustandMMKV;
};
