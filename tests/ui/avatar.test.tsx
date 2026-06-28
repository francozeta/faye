import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
} from "@/components/ui/avatar"

describe("Avatar component", () => {
  it("renders with data-slot='avatar'", () => {
    render(<Avatar />)
    expect(document.querySelector("[data-slot='avatar']")).toBeInTheDocument()
  })

  it("renders with default size data-size='default'", () => {
    render(<Avatar />)
    expect(document.querySelector("[data-slot='avatar']")).toHaveAttribute("data-size", "default")
  })

  it("renders with data-size='sm' when size is sm", () => {
    render(<Avatar size="sm" />)
    expect(document.querySelector("[data-slot='avatar']")).toHaveAttribute("data-size", "sm")
  })

  it("renders with data-size='lg' when size is lg", () => {
    render(<Avatar size="lg" />)
    expect(document.querySelector("[data-slot='avatar']")).toHaveAttribute("data-size", "lg")
  })

  it("applies rounded-full class", () => {
    const { container } = render(<Avatar />)
    const el = container.querySelector("[data-slot='avatar']") as HTMLElement
    expect(el.className).toContain("rounded-full")
  })

  it("applies size-8 class for default size", () => {
    const { container } = render(<Avatar />)
    const el = container.querySelector("[data-slot='avatar']") as HTMLElement
    expect(el.className).toContain("size-8")
  })

  it("merges custom className", () => {
    const { container } = render(<Avatar className="custom-avatar" />)
    const el = container.querySelector("[data-slot='avatar']") as HTMLElement
    expect(el.className).toContain("custom-avatar")
  })

  it("renders children", () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByText("AB")).toBeInTheDocument()
  })
})

describe("AvatarFallback component", () => {
  it("renders with data-slot='avatar-fallback'", () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    expect(document.querySelector("[data-slot='avatar-fallback']")).toBeInTheDocument()
  })

  it("renders fallback text", () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    expect(screen.getByText("JD")).toBeInTheDocument()
  })

  it("applies bg-muted class", () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    const fallback = document.querySelector("[data-slot='avatar-fallback']") as HTMLElement
    expect(fallback.className).toContain("bg-muted")
  })

  it("applies rounded-full class", () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    const fallback = document.querySelector("[data-slot='avatar-fallback']") as HTMLElement
    expect(fallback.className).toContain("rounded-full")
  })

  it("merges custom className", () => {
    render(
      <Avatar>
        <AvatarFallback className="custom-fallback">JD</AvatarFallback>
      </Avatar>
    )
    const fallback = document.querySelector("[data-slot='avatar-fallback']") as HTMLElement
    expect(fallback.className).toContain("custom-fallback")
  })
})

describe("AvatarBadge component", () => {
  it("renders with data-slot='avatar-badge'", () => {
    render(
      <Avatar>
        <AvatarBadge />
      </Avatar>
    )
    expect(document.querySelector("[data-slot='avatar-badge']")).toBeInTheDocument()
  })

  it("applies absolute class", () => {
    render(
      <Avatar>
        <AvatarBadge />
      </Avatar>
    )
    const badge = document.querySelector("[data-slot='avatar-badge']") as HTMLElement
    expect(badge.className).toContain("absolute")
  })

  it("applies rounded-full class", () => {
    render(
      <Avatar>
        <AvatarBadge />
      </Avatar>
    )
    const badge = document.querySelector("[data-slot='avatar-badge']") as HTMLElement
    expect(badge.className).toContain("rounded-full")
  })

  it("merges custom className", () => {
    render(
      <Avatar>
        <AvatarBadge className="custom-badge" />
      </Avatar>
    )
    const badge = document.querySelector("[data-slot='avatar-badge']") as HTMLElement
    expect(badge.className).toContain("custom-badge")
  })

  it("renders children content", () => {
    render(
      <Avatar>
        <AvatarBadge>3</AvatarBadge>
      </Avatar>
    )
    expect(screen.getByText("3")).toBeInTheDocument()
  })
})

describe("AvatarGroup component", () => {
  it("renders with data-slot='avatar-group'", () => {
    render(<AvatarGroup />)
    expect(document.querySelector("[data-slot='avatar-group']")).toBeInTheDocument()
  })

  it("applies flex and -space-x-2 classes", () => {
    const { container } = render(<AvatarGroup />)
    const el = container.querySelector("[data-slot='avatar-group']") as HTMLElement
    expect(el.className).toContain("flex")
    expect(el.className).toContain("-space-x-2")
  })

  it("merges custom className", () => {
    const { container } = render(<AvatarGroup className="custom-group" />)
    const el = container.querySelector("[data-slot='avatar-group']") as HTMLElement
    expect(el.className).toContain("custom-group")
  })

  it("renders multiple avatars", () => {
    render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    )
    expect(screen.getByText("A")).toBeInTheDocument()
    expect(screen.getByText("B")).toBeInTheDocument()
  })
})

describe("AvatarGroupCount component", () => {
  it("renders with data-slot='avatar-group-count'", () => {
    render(<AvatarGroupCount>+3</AvatarGroupCount>)
    expect(document.querySelector("[data-slot='avatar-group-count']")).toBeInTheDocument()
  })

  it("renders count text", () => {
    render(<AvatarGroupCount>+5</AvatarGroupCount>)
    expect(screen.getByText("+5")).toBeInTheDocument()
  })

  it("applies size-8 class", () => {
    const { container } = render(<AvatarGroupCount>+3</AvatarGroupCount>)
    const el = container.querySelector("[data-slot='avatar-group-count']") as HTMLElement
    expect(el.className).toContain("size-8")
  })

  it("applies rounded-full class", () => {
    const { container } = render(<AvatarGroupCount>+3</AvatarGroupCount>)
    const el = container.querySelector("[data-slot='avatar-group-count']") as HTMLElement
    expect(el.className).toContain("rounded-full")
  })

  it("merges custom className", () => {
    const { container } = render(<AvatarGroupCount className="custom-count">+3</AvatarGroupCount>)
    const el = container.querySelector("[data-slot='avatar-group-count']") as HTMLElement
    expect(el.className).toContain("custom-count")
  })
})

describe("AvatarImage component", () => {
  // Note: @base-ui Avatar.Image only appears in DOM after successful image load.
  // In jsdom test environment, images don't load, so we verify AvatarFallback
  // is shown instead (which is the correct fallback behavior).

  it("shows fallback when image fails to load in jsdom", () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="User avatar" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    // In jsdom, image never loads so fallback is shown
    expect(screen.getByText("JD")).toBeInTheDocument()
  })

  it("renders fallback instead of image in test environment", () => {
    render(
      <Avatar>
        <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    )
    // The Avatar component shows the fallback when image is not available
    const fallback = document.querySelector("[data-slot='avatar-fallback']")
    expect(fallback).toBeInTheDocument()
  })

  it("AvatarImage component is exported and can be composed with Avatar", () => {
    // Verify the component can be rendered without errors even if image doesn't appear
    expect(() =>
      render(
        <Avatar>
          <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )
    ).not.toThrow()
  })
})