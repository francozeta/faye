import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Alert, AlertTitle, AlertDescription, AlertAction } from "@/components/ui/alert"

describe("Alert component", () => {
  it("renders with role='alert'", () => {
    render(<Alert>Content</Alert>)
    expect(screen.getByRole("alert")).toBeInTheDocument()
  })

  it("renders with data-slot='alert'", () => {
    render(<Alert>Content</Alert>)
    expect(screen.getByRole("alert")).toHaveAttribute("data-slot", "alert")
  })

  it("renders with default variant class bg-card", () => {
    render(<Alert>Content</Alert>)
    const alert = screen.getByRole("alert")
    expect(alert.className).toContain("bg-card")
  })

  it("renders with destructive variant class text-destructive", () => {
    render(<Alert variant="destructive">Danger</Alert>)
    const alert = screen.getByRole("alert")
    expect(alert.className).toContain("text-destructive")
  })

  it("merges custom className", () => {
    render(<Alert className="my-alert">Custom</Alert>)
    const alert = screen.getByRole("alert")
    expect(alert.className).toContain("my-alert")
  })

  it("renders children", () => {
    render(<Alert>Alert content here</Alert>)
    expect(screen.getByText("Alert content here")).toBeInTheDocument()
  })

  it("renders as a div element", () => {
    render(<Alert>Div test</Alert>)
    const alert = screen.getByRole("alert")
    expect(alert.tagName.toLowerCase()).toBe("div")
  })

  it("includes base layout classes", () => {
    render(<Alert>Base</Alert>)
    const alert = screen.getByRole("alert")
    expect(alert.className).toContain("rounded-lg")
    expect(alert.className).toContain("border")
  })
})

describe("AlertTitle component", () => {
  it("renders with data-slot='alert-title'", () => {
    render(<AlertTitle>Title text</AlertTitle>)
    const title = screen.getByText("Title text")
    expect(title).toHaveAttribute("data-slot", "alert-title")
  })

  it("renders title text", () => {
    render(<AlertTitle>My Alert Title</AlertTitle>)
    expect(screen.getByText("My Alert Title")).toBeInTheDocument()
  })

  it("applies font-medium class", () => {
    render(<AlertTitle>Title</AlertTitle>)
    const title = screen.getByText("Title")
    expect(title.className).toContain("font-medium")
  })

  it("merges custom className", () => {
    render(<AlertTitle className="custom-title">Title</AlertTitle>)
    const title = screen.getByText("Title")
    expect(title.className).toContain("custom-title")
  })
})

describe("AlertDescription component", () => {
  it("renders with data-slot='alert-description'", () => {
    render(<AlertDescription>Description text</AlertDescription>)
    const desc = screen.getByText("Description text")
    expect(desc).toHaveAttribute("data-slot", "alert-description")
  })

  it("renders description text", () => {
    render(<AlertDescription>Alert details here</AlertDescription>)
    expect(screen.getByText("Alert details here")).toBeInTheDocument()
  })

  it("applies text-muted-foreground class", () => {
    render(<AlertDescription>Desc</AlertDescription>)
    const desc = screen.getByText("Desc")
    expect(desc.className).toContain("text-muted-foreground")
  })

  it("merges custom className", () => {
    render(<AlertDescription className="custom-desc">Desc</AlertDescription>)
    const desc = screen.getByText("Desc")
    expect(desc.className).toContain("custom-desc")
  })
})

describe("AlertAction component", () => {
  it("renders with data-slot='alert-action'", () => {
    render(<AlertAction>Action</AlertAction>)
    const action = screen.getByText("Action")
    expect(action).toHaveAttribute("data-slot", "alert-action")
  })

  it("renders children", () => {
    render(<AlertAction>Dismiss</AlertAction>)
    expect(screen.getByText("Dismiss")).toBeInTheDocument()
  })

  it("applies absolute positioning classes", () => {
    render(<AlertAction>Act</AlertAction>)
    const action = screen.getByText("Act")
    expect(action.className).toContain("absolute")
  })

  it("merges custom className", () => {
    render(<AlertAction className="custom-action">Act</AlertAction>)
    const action = screen.getByText("Act")
    expect(action.className).toContain("custom-action")
  })
})

describe("Alert composition", () => {
  it("renders title and description together", () => {
    render(
      <Alert>
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>
    )
    expect(screen.getByText("Warning")).toBeInTheDocument()
    expect(screen.getByText("Something went wrong.")).toBeInTheDocument()
  })

  it("renders full alert with action", () => {
    render(
      <Alert>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>An error occurred.</AlertDescription>
        <AlertAction>Retry</AlertAction>
      </Alert>
    )
    expect(screen.getByText("Error")).toBeInTheDocument()
    expect(screen.getByText("An error occurred.")).toBeInTheDocument()
    expect(screen.getByText("Retry")).toBeInTheDocument()
  })
})