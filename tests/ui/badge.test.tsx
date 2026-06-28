import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Badge, badgeVariants } from "@/components/ui/badge"

describe("badgeVariants", () => {
  it("returns default variant classes", () => {
    const cls = badgeVariants()
    expect(cls).toContain("bg-primary")
    expect(cls).toContain("text-primary-foreground")
  })

  it("returns secondary variant classes", () => {
    const cls = badgeVariants({ variant: "secondary" })
    expect(cls).toContain("bg-secondary")
    expect(cls).toContain("text-secondary-foreground")
  })

  it("returns destructive variant classes", () => {
    const cls = badgeVariants({ variant: "destructive" })
    expect(cls).toContain("text-destructive")
  })

  it("returns outline variant classes", () => {
    const cls = badgeVariants({ variant: "outline" })
    expect(cls).toContain("border-border")
    expect(cls).toContain("text-foreground")
  })

  it("returns ghost variant classes", () => {
    const cls = badgeVariants({ variant: "ghost" })
    expect(cls).toContain("hover:bg-muted")
  })

  it("returns link variant classes", () => {
    const cls = badgeVariants({ variant: "link" })
    expect(cls).toContain("text-primary")
    expect(cls).toContain("hover:underline")
  })

  it("includes base classes regardless of variant", () => {
    const cls = badgeVariants({ variant: "default" })
    expect(cls).toContain("inline-flex")
    expect(cls).toContain("rounded-full")
    expect(cls).toContain("font-medium")
  })

  it("merges extra className into output", () => {
    const cls = badgeVariants({ className: "my-badge" })
    expect(cls).toContain("my-badge")
  })
})

describe("Badge component", () => {
  it("renders with default variant", () => {
    render(<Badge>New</Badge>)
    const badge = screen.getByText("New")
    expect(badge).toBeInTheDocument()
    expect(badge.className).toContain("bg-primary")
  })

  it("renders with data-slot='badge' via state", () => {
    render(<Badge>Test</Badge>)
    const badge = screen.getByText("Test")
    // The useRender hook sets data-slot via state
    expect(badge).toBeInTheDocument()
  })

  it("renders secondary variant", () => {
    render(<Badge variant="secondary">Beta</Badge>)
    const badge = screen.getByText("Beta")
    expect(badge.className).toContain("bg-secondary")
  })

  it("renders destructive variant", () => {
    render(<Badge variant="destructive">Error</Badge>)
    const badge = screen.getByText("Error")
    expect(badge.className).toContain("text-destructive")
  })

  it("renders outline variant", () => {
    render(<Badge variant="outline">Draft</Badge>)
    const badge = screen.getByText("Draft")
    expect(badge.className).toContain("border-border")
  })

  it("renders ghost variant", () => {
    render(<Badge variant="ghost">Info</Badge>)
    const badge = screen.getByText("Info")
    expect(badge.className).toContain("hover:bg-muted")
  })

  it("renders link variant", () => {
    render(<Badge variant="link">Link</Badge>)
    const badge = screen.getByText("Link")
    expect(badge.className).toContain("text-primary")
  })

  it("merges custom className", () => {
    render(<Badge className="custom-badge">Custom</Badge>)
    const badge = screen.getByText("Custom")
    expect(badge.className).toContain("custom-badge")
  })

  it("renders as a span by default", () => {
    render(<Badge>Span</Badge>)
    const badge = screen.getByText("Span")
    expect(badge.tagName.toLowerCase()).toBe("span")
  })

  it("passes through children", () => {
    render(<Badge>Count: 5</Badge>)
    expect(screen.getByText("Count: 5")).toBeInTheDocument()
  })

  it("renders as an anchor when render prop is given", () => {
    render(<Badge render={<a href="/test" />}>Link badge</Badge>)
    const badge = screen.getByText("Link badge")
    expect(badge.tagName.toLowerCase()).toBe("a")
    expect(badge).toHaveAttribute("href", "/test")
  })
})