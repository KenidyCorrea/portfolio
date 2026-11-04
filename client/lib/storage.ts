/** Keys must match public/boot.js */
export const STORAGE_KEYS = {
  theme: "kc:theme",
  locale: "kc:locale",
} as const;

export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** localStorage can throw (private mode, blocked cookies), so access is always guarded. */
export function getBrowserStorage(): KeyValueStorage | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage;
  } catch {
    return null;
  }
}

export function readPreference<T extends string>(
  key: string,
  allowed: readonly T[],
  storage: KeyValueStorage | null = getBrowserStorage(),
): T | null {
  if (!storage) return null;
  try {
    const value = storage.getItem(key);
    return value !== null && (allowed as readonly string[]).includes(value) ? (value as T) : null;
  } catch {
    return null;
  }
}

export function writePreference(key: string, value: string, storage: KeyValueStorage | null = getBrowserStorage()): boolean {
  if (!storage) return false;
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
