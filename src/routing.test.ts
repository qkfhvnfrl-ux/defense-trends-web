import { describe, expect, it } from "vitest";
import { normalizeRoute, routeHref } from "./routing";

describe("routing helpers", () => {
  it("keeps root-hosted routes unchanged", () => {
    expect(normalizeRoute("/", "/")).toBe("/");
    expect(normalizeRoute("/development", "/")).toBe("/development");
    expect(routeHref("/development", "/")).toBe("/development");
  });

  it("normalizes GitHub Pages base paths", () => {
    expect(normalizeRoute("/defense-trends-web/", "/defense-trends-web/")).toBe("/");
    expect(normalizeRoute("/defense-trends-web/development", "/defense-trends-web/")).toBe("/development");
    expect(normalizeRoute("/defense-trends-web", "/defense-trends-web/")).toBe("/");
    expect(routeHref("/development", "/defense-trends-web/")).toBe("/defense-trends-web/development");
  });
});
