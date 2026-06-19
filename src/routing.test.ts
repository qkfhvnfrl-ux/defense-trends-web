import { describe, expect, it } from "vitest";
import { normalizeRoute, routeHref } from "./routing";

describe("routing helpers", () => {
  it("keeps root-hosted routes unchanged", () => {
    expect(normalizeRoute("/", "/")).toBe("/");
    expect(normalizeRoute("/insights", "/")).toBe("/insights");
    expect(routeHref("/insights", "/")).toBe("/insights");
  });

  it("normalizes GitHub Pages base paths", () => {
    expect(normalizeRoute("/defense-trends-web/", "/defense-trends-web/")).toBe("/");
    expect(normalizeRoute("/defense-trends-web/insights", "/defense-trends-web/")).toBe("/insights");
    expect(normalizeRoute("/defense-trends-web", "/defense-trends-web/")).toBe("/");
    expect(routeHref("/insights", "/defense-trends-web/")).toBe("/defense-trends-web/insights");
  });
});
