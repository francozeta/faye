import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { AspectRatio } from "@/components/ui/aspect-ratio"

describe("AspectRatio component", () => {
  it("renders with data-slot='aspect-ratio'", () => {
    const { container } = render(<AspectRatio ratio={16 / 9}>Content</AspectRatio>)
    const el = container.querySelector("[data-slot='aspect-ratio']")
    expect(el).toBeInTheDocument()
  })

  it("sets --ratio CSS custom property from ratio prop", () => {
    const { container } = render(<AspectRatio ratio={16 / 9}>Content</AspectRatio>)
    const el = container.querySelector("[data-slot='aspect-ratio']") as HTMLElement
    expect(el.style.getPropertyValue("--ratio")).toBe(String(16 / 9))
  })

  it("sets --ratio for 1:1 ratio", () => {
    const { container } = render(<AspectRatio ratio={1}>Square</AspectRatio>)
    const el = container.querySelector("[data-slot='aspect-ratio']") as HTMLElement
    expect(el.style.getPropertyValue("--ratio")).toBe("1")
  })

  it("sets --ratio for 4:3 ratio", () => {
    const { container } = render(<AspectRatio ratio={4 / 3}>4:3</AspectRatio>)
    const el = container.querySelector("[data-slot='aspect-ratio']") as HTMLElement
    expect(el.style.getPropertyValue("--ratio")).toBe(String(4 / 3))
  })

  it("renders children", () => {
    render(<AspectRatio ratio={16 / 9}>Inner content</AspectRatio>)
    expect(screen.getByText("Inner content")).toBeInTheDocument()
  })

  it("applies relative class", () => {
    const { container } = render(<AspectRatio ratio={16 / 9}>Content</AspectRatio>)
    const el = container.querySelector("[data-slot='aspect-ratio']") as HTMLElement
    expect(el.className).toContain("relative")
  })

  it("merges custom className", () => {
    const { container } = render(
      <AspectRatio ratio={16 / 9} className="custom-ratio">
        Content
      </AspectRatio>
    )
    const el = container.querySelector("[data-slot='aspect-ratio']") as HTMLElement
    expect(el.className).toContain("custom-ratio")
  })

  it("renders as a div element", () => {
    const { container } = render(<AspectRatio ratio={16 / 9}>Div</AspectRatio>)
    const el = container.querySelector("[data-slot='aspect-ratio']")
    expect(el?.tagName.toLowerCase()).toBe("div")
  })

  it("passes through additional div props", () => {
    const { container } = render(
      <AspectRatio ratio={2} id="my-ratio" aria-label="video container">
        Content
      </AspectRatio>
    )
    const el = container.querySelector("[data-slot='aspect-ratio']")
    expect(el).toHaveAttribute("id", "my-ratio")
    expect(el).toHaveAttribute("aria-label", "video container")
  })

  it("accepts decimal ratio values", () => {
    const { container } = render(<AspectRatio ratio={2.35}>Widescreen</AspectRatio>)
    const el = container.querySelector("[data-slot='aspect-ratio']") as HTMLElement
    expect(el.style.getPropertyValue("--ratio")).toBe("2.35")
  })
})