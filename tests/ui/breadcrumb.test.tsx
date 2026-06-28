import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb"

describe("Breadcrumb component", () => {
  it("renders a nav element", () => {
    render(<Breadcrumb>Nav content</Breadcrumb>)
    expect(screen.getByRole("navigation")).toBeInTheDocument()
  })

  it("renders with aria-label='breadcrumb'", () => {
    render(<Breadcrumb>Nav</Breadcrumb>)
    expect(screen.getByRole("navigation")).toHaveAttribute("aria-label", "breadcrumb")
  })

  it("renders with data-slot='breadcrumb'", () => {
    render(<Breadcrumb>Nav</Breadcrumb>)
    expect(screen.getByRole("navigation")).toHaveAttribute("data-slot", "breadcrumb")
  })

  it("merges custom className", () => {
    render(<Breadcrumb className="custom-nav">Nav</Breadcrumb>)
    expect(screen.getByRole("navigation").className).toContain("custom-nav")
  })
})

describe("BreadcrumbList component", () => {
  it("renders as an ordered list", () => {
    render(<BreadcrumbList>List</BreadcrumbList>)
    const list = screen.getByText("List")
    expect(list.tagName.toLowerCase()).toBe("ol")
  })

  it("renders with data-slot='breadcrumb-list'", () => {
    render(<BreadcrumbList>List</BreadcrumbList>)
    expect(screen.getByText("List")).toHaveAttribute("data-slot", "breadcrumb-list")
  })

  it("applies flex and text classes", () => {
    render(<BreadcrumbList>List</BreadcrumbList>)
    const list = screen.getByText("List")
    expect(list.className).toContain("flex")
    expect(list.className).toContain("text-muted-foreground")
  })

  it("merges custom className", () => {
    render(<BreadcrumbList className="custom-list">List</BreadcrumbList>)
    expect(screen.getByText("List").className).toContain("custom-list")
  })
})

describe("BreadcrumbItem component", () => {
  it("renders as a list item", () => {
    render(
      <ol>
        <BreadcrumbItem>Item</BreadcrumbItem>
      </ol>
    )
    const item = screen.getByText("Item")
    expect(item.tagName.toLowerCase()).toBe("li")
  })

  it("renders with data-slot='breadcrumb-item'", () => {
    render(
      <ol>
        <BreadcrumbItem>Item</BreadcrumbItem>
      </ol>
    )
    expect(screen.getByText("Item")).toHaveAttribute("data-slot", "breadcrumb-item")
  })

  it("applies inline-flex class", () => {
    render(
      <ol>
        <BreadcrumbItem>Item</BreadcrumbItem>
      </ol>
    )
    expect(screen.getByText("Item").className).toContain("inline-flex")
  })

  it("merges custom className", () => {
    render(
      <ol>
        <BreadcrumbItem className="custom-item">Item</BreadcrumbItem>
      </ol>
    )
    expect(screen.getByText("Item").className).toContain("custom-item")
  })
})

describe("BreadcrumbLink component", () => {
  it("renders as an anchor element by default", () => {
    render(<BreadcrumbLink href="/home">Home</BreadcrumbLink>)
    const link = screen.getByText("Home")
    expect(link.tagName.toLowerCase()).toBe("a")
  })

  it("renders with href", () => {
    render(<BreadcrumbLink href="/home">Home</BreadcrumbLink>)
    expect(screen.getByText("Home")).toHaveAttribute("href", "/home")
  })

  it("applies hover:text-foreground class", () => {
    render(<BreadcrumbLink href="/home">Home</BreadcrumbLink>)
    expect(screen.getByText("Home").className).toContain("hover:text-foreground")
  })

  it("merges custom className", () => {
    render(<BreadcrumbLink href="/home" className="custom-link">Home</BreadcrumbLink>)
    expect(screen.getByText("Home").className).toContain("custom-link")
  })

  it("renders with custom render element", () => {
    render(<BreadcrumbLink render={<button />}>Button link</BreadcrumbLink>)
    const el = screen.getByText("Button link")
    expect(el.tagName.toLowerCase()).toBe("button")
  })
})

describe("BreadcrumbPage component", () => {
  it("renders as a span", () => {
    render(<BreadcrumbPage>Current Page</BreadcrumbPage>)
    const page = screen.getByText("Current Page")
    expect(page.tagName.toLowerCase()).toBe("span")
  })

  it("renders with data-slot='breadcrumb-page'", () => {
    render(<BreadcrumbPage>Page</BreadcrumbPage>)
    expect(screen.getByText("Page")).toHaveAttribute("data-slot", "breadcrumb-page")
  })

  it("renders with role='link'", () => {
    render(<BreadcrumbPage>Page</BreadcrumbPage>)
    expect(screen.getByRole("link", { name: /page/i })).toBeInTheDocument()
  })

  it("renders with aria-current='page'", () => {
    render(<BreadcrumbPage>Page</BreadcrumbPage>)
    expect(screen.getByText("Page")).toHaveAttribute("aria-current", "page")
  })

  it("renders with aria-disabled='true'", () => {
    render(<BreadcrumbPage>Page</BreadcrumbPage>)
    expect(screen.getByText("Page")).toHaveAttribute("aria-disabled", "true")
  })

  it("applies text-foreground class", () => {
    render(<BreadcrumbPage>Page</BreadcrumbPage>)
    expect(screen.getByText("Page").className).toContain("text-foreground")
  })

  it("merges custom className", () => {
    render(<BreadcrumbPage className="custom-page">Page</BreadcrumbPage>)
    expect(screen.getByText("Page").className).toContain("custom-page")
  })
})

describe("BreadcrumbSeparator component", () => {
  it("renders with role='presentation'", () => {
    render(
      <ol>
        <BreadcrumbSeparator />
      </ol>
    )
    expect(document.querySelector("[data-slot='breadcrumb-separator']")).toHaveAttribute(
      "role",
      "presentation"
    )
  })

  it("renders with aria-hidden='true'", () => {
    render(
      <ol>
        <BreadcrumbSeparator />
      </ol>
    )
    expect(document.querySelector("[data-slot='breadcrumb-separator']")).toHaveAttribute(
      "aria-hidden",
      "true"
    )
  })

  it("renders with data-slot='breadcrumb-separator'", () => {
    render(
      <ol>
        <BreadcrumbSeparator />
      </ol>
    )
    expect(document.querySelector("[data-slot='breadcrumb-separator']")).toBeInTheDocument()
  })

  it("renders custom children when provided", () => {
    render(
      <ol>
        <BreadcrumbSeparator>›</BreadcrumbSeparator>
      </ol>
    )
    expect(screen.getByText("›")).toBeInTheDocument()
  })

  it("merges custom className", () => {
    render(
      <ol>
        <BreadcrumbSeparator className="custom-sep" />
      </ol>
    )
    expect(document.querySelector("[data-slot='breadcrumb-separator']")?.className).toContain(
      "custom-sep"
    )
  })
})

describe("BreadcrumbEllipsis component", () => {
  it("renders with role='presentation'", () => {
    render(<BreadcrumbEllipsis />)
    expect(document.querySelector("[data-slot='breadcrumb-ellipsis']")).toHaveAttribute(
      "role",
      "presentation"
    )
  })

  it("renders with aria-hidden='true'", () => {
    render(<BreadcrumbEllipsis />)
    expect(document.querySelector("[data-slot='breadcrumb-ellipsis']")).toHaveAttribute(
      "aria-hidden",
      "true"
    )
  })

  it("renders with data-slot='breadcrumb-ellipsis'", () => {
    render(<BreadcrumbEllipsis />)
    expect(document.querySelector("[data-slot='breadcrumb-ellipsis']")).toBeInTheDocument()
  })

  it("renders sr-only 'More' text for accessibility", () => {
    render(<BreadcrumbEllipsis />)
    expect(screen.getByText("More")).toHaveClass("sr-only")
  })

  it("merges custom className", () => {
    render(<BreadcrumbEllipsis className="custom-ellipsis" />)
    expect(document.querySelector("[data-slot='breadcrumb-ellipsis']")?.className).toContain(
      "custom-ellipsis"
    )
  })
})

describe("Breadcrumb full composition", () => {
  it("renders a complete breadcrumb navigation", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Components</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    expect(screen.getByRole("navigation", { name: /breadcrumb/i })).toBeInTheDocument()
    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Docs")).toBeInTheDocument()
    expect(screen.getByText("Components")).toBeInTheDocument()
  })

  it("renders with ellipsis for truncated paths", () => {
    render(
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Current</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    )
    expect(screen.getByText("More")).toHaveClass("sr-only")
    expect(screen.getByText("Current")).toBeInTheDocument()
  })
})