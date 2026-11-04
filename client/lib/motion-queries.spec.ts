import { describe, expect, it } from "vitest";
import tailwindConfig from "../../tailwind.config";
import { MOTION_QUERIES } from "./motion-queries";

describe("MOTION_QUERIES", () => {
  it("keeps the Tailwind pin: screen in sync with the GSAP desktop query", () => {
    const screens = tailwindConfig.theme.screens as Record<string, string | { raw: string }>;
    expect(screens.pin).toEqual({ raw: MOTION_QUERIES.desktop });
  });
});
