import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Button, buttonVariants } from "@/components/ui/button"

describe("buttonVariants", () => {
  it("returns default variant classes when no options given", () => {
    const cls = buttonVariants()
    expect(cls).toContain("bg-primary")
    expect(cls).toContain("text-primary-foreground")
  })

  it("returns outline variant classes", () => {
    const cls = buttonVariants({ variant: "outline" })
    expect(cls).toContain("border-border")
  })

  it("returns ghost variant classes", () => {
    const cls = buttonVariants({ variant: "ghost" })
    expect(cls).toContain("hover:bg-muted")
  })

  it("returns secondary variant classes", () => {
    const cls = buttonVariants({ variant: "secondary" })
    expect(cls).toContain("bg-secondary")
    expect(cls).toContain("text-secondary-foreground")
  })

  it("returns destructive variant classes", () => {
    const cls = buttonVariants({ variant: "destructive" })
    expect(cls).toContain("bg-destructive")
    expect(cls).toContain("text-destructive")
  })

  it("returns link variant classes", () => {
    const cls = buttonVariants({ variant: "link" })
    expect(cls).toContain("text-primary")
    expect(cls).toContain("hover:underline")
  })

  it("returns default size classes", () => {
    const cls = buttonVariants({ size: "default" })
    expect(cls).toContain("h-7")
  })

  it("returns xs size classes", () => {
    const cls = buttonVariants({ size: "xs" })
    expect(cls).toContain("h-5")
  })

  it("returns sm size classes", () => {
    const cls = buttonVariants({ size: "sm" })
    expect(cls).toContain("h-6")
  })

  it("returns lg size classes", () => {
    const cls = buttonVariants({ size: "lg" })
    expect(cls).toContain("h-8")
  })

  it("returns icon size classes", () => {
    const cls = buttonVariants({ size: "icon" })
    expect(cls).toContain("size-7")
  })

  it("returns icon-xs size classes", () => {
    const cls = buttonVariants({ size: "icon-xs" })
    expect(cls).toContain("size-5")
  })

  it("returns icon-sm size classes", () => {
    const cls = buttonVariants({ size: "icon-sm" })
    expect(cls).toContain("size-6")
  })

  it("returns icon-lg size classes", () => {
    const cls = buttonVariants({ size: "icon-lg" })
    expect(cls).toContain("size-8")
  })

  it("merges extra className into output", () => {
    const cls = buttonVariants({ className: "custom-class" })
    expect(cls).toContain("custom-class")
  })

  it("appends extra className to the variant output", () => {
    const cls = buttonVariants({ variant: "default", className: "bg-red-500" })
    // className is appended after variant classes
    expect(cls).toContain("bg-red-500")
  })
})

describe("Button component", () => {
  it("renders a button element", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument()
  })

  it("renders with data-slot='button'", () => {
    render(<Button>Test</Button>)
    const btn = screen.getByRole("button", { name: /test/i })
    expect(btn).toHaveAttribute("data-slot", "button")
  })

  it("passes through children", () => {
    render(<Button>Hello World</Button>)
    expect(screen.getByText("Hello World")).toBeInTheDocument()
  })

  it("applies default variant className by default", () => {
    render(<Button>Default</Button>)
    const btn = screen.getByRole("button", { name: /default/i })
    expect(btn.className).toContain("bg-primary")
  })

  it("applies ghost variant className", () => {
    render(<Button variant="ghost">Ghost</Button>)
    const btn = screen.getByRole("button", { name: /ghost/i })
    expect(btn.className).toContain("hover:bg-muted")
  })

  it("applies outline variant className", () => {
    render(<Button variant="outline">Outline</Button>)
    const btn = screen.getByRole("button", { name: /outline/i })
    expect(btn.className).toContain("border-border")
  })

  it("applies destructive variant className", () => {
    render(<Button variant="destructive">Destructive</Button>)
    const btn = screen.getByRole("button", { name: /destructive/i })
    expect(btn.className).toContain("bg-destructive")
  })

  it("applies secondary variant className", () => {
    render(<Button variant="secondary">Secondary</Button>)
    const btn = screen.getByRole("button", { name: /secondary/i })
    expect(btn.className).toContain("bg-secondary")
  })

  it("applies lg size className", () => {
    render(<Button size="lg">Large</Button>)
    const btn = screen.getByRole("button", { name: /large/i })
    expect(btn.className).toContain("h-8")
  })

  it("applies sm size className", () => {
    render(<Button size="sm">Small</Button>)
    const btn = screen.getByRole("button", { name: /small/i })
    expect(btn.className).toContain("h-6")
  })

  it("applies icon size className", () => {
    render(<Button size="icon">I</Button>)
    const btn = screen.getByRole("button", { name: /i/i })
    expect(btn.className).toContain("size-7")
  })

  it("merges custom className with variant classes", () => {
    render(<Button className="my-custom-class">Custom</Button>)
    const btn = screen.getByRole("button", { name: /custom/i })
    expect(btn.className).toContain("my-custom-class")
  })

  it("can be disabled", () => {
    render(<Button disabled>Disabled</Button>)
    const btn = screen.getByRole("button", { name: /disabled/i })
    expect(btn).toBeDisabled()
  })

  it("passes arbitrary html attributes", () => {
    render(<Button aria-label="submit form">Submit</Button>)
    const btn = screen.getByRole("button", { name: /submit form/i })
    expect(btn).toBeInTheDocument()
  })
})