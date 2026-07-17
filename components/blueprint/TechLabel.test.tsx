import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TechLabel } from "./TechLabel";

describe("TechLabel", () => {
  it("renders its children", () => {
    render(<TechLabel>SECTION_01</TechLabel>);
    expect(screen.getByText("SECTION_01")).toBeInTheDocument();
  });

  it("renders as the requested element", () => {
    render(<TechLabel as="p">Body label</TechLabel>);
    expect(screen.getByText("Body label").tagName).toBe("P");
  });

  it("merges custom class names", () => {
    render(<TechLabel className="custom-token">Tagged</TechLabel>);
    expect(screen.getByText("Tagged")).toHaveClass("custom-token");
  });
});
