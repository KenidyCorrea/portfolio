import { describe, expect, it } from "vitest";
import { readPreference, writePreference, type KeyValueStorage } from "./storage";

function memoryStorage(initial: Record<string, string> = {}): KeyValueStorage & { data: Record<string, string> } {
  const data = { ...initial };
  return {
    data,
    getItem: (key) => (key in data ? data[key] : null),
    setItem: (key, value) => {
      data[key] = value;
    },
  };
}

const throwingStorage: KeyValueStorage = {
  getItem: () => {
    throw new Error("SecurityError");
  },
  setItem: () => {
    throw new Error("QuotaExceededError");
  },
};

const LOCALES = ["pt", "en"] as const;

describe("readPreference", () => {
  it("returns a stored value when it is allowed", () => {
    expect(readPreference("kc:locale", LOCALES, memoryStorage({ "kc:locale": "pt" }))).toBe("pt");
  });

  it("ignores values outside the allow-list", () => {
    expect(readPreference("kc:locale", LOCALES, memoryStorage({ "kc:locale": "<script>" }))).toBeNull();
  });

  it("returns null when storage is unavailable or throws", () => {
    expect(readPreference("kc:locale", LOCALES, null)).toBeNull();
    expect(readPreference("kc:locale", LOCALES, throwingStorage)).toBeNull();
  });
});

describe("writePreference", () => {
  it("stores the value and reports success", () => {
    const storage = memoryStorage();
    expect(writePreference("kc:theme", "light", storage)).toBe(true);
    expect(storage.data["kc:theme"]).toBe("light");
  });

  it("reports failure instead of throwing", () => {
    expect(writePreference("kc:theme", "light", throwingStorage)).toBe(false);
    expect(writePreference("kc:theme", "light", null)).toBe(false);
  });
});
