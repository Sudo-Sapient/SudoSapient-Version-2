import { describe, it, expect } from "vitest";
import { projects, getProject } from "./projects";

const DISCIPLINES = ["AI Product", "AI Automation", "AI Media", "Web & Brand"];

describe("projects data", () => {
  it("has at least one project", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("every project has the required fields", () => {
    for (const p of projects) {
      expect(p.slug, "slug").toBeTruthy();
      expect(p.title, `title for ${p.slug}`).toBeTruthy();
      expect(p.client, `client for ${p.slug}`).toBeTruthy();
      expect(DISCIPLINES, `discipline for ${p.slug}`).toContain(p.discipline);
      expect(typeof p.isPlaceholder, `isPlaceholder for ${p.slug}`).toBe("boolean");
    }
  });

  it("slugs are unique and url-safe", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug, `slug "${slug}" must be url-safe`).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("has at most one featured project", () => {
    expect(projects.filter((p) => p.featured).length).toBeLessThanOrEqual(1);
  });
});

describe("getProject", () => {
  it("returns a project for a known slug", () => {
    const known = projects[0].slug;
    expect(getProject(known)?.slug).toBe(known);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProject("does-not-exist")).toBeUndefined();
  });
});
