import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogMedia,
} from "@/components/ui/alert-dialog"

describe("AlertDialog component", () => {
  it("does not show content initially (closed by default)", () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Dialog Title</AlertDialogTitle>
          <AlertDialogDescription>Dialog description.</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    )
    // Trigger should be visible
    expect(screen.getByText("Open")).toBeInTheDocument()
    // @base-ui AlertDialog removes content from DOM when closed
    expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument()
  })

  it("opens content when trigger is clicked", async () => {
    const user = userEvent.setup()
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open Dialog</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm Action</AlertDialogTitle>
          <AlertDialogDescription>Are you sure?</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    )
    await user.click(screen.getByText("Open Dialog"))
    expect(screen.getByText("Confirm Action")).toBeVisible()
    expect(screen.getByText("Are you sure?")).toBeVisible()
  })

  it("renders trigger with data-slot='alert-dialog-trigger'", () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Trigger</AlertDialogTrigger>
      </AlertDialog>
    )
    expect(screen.getByText("Trigger")).toHaveAttribute("data-slot", "alert-dialog-trigger")
  })

  it("can be opened by default using open prop", () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Always Open</AlertDialogTitle>
          <AlertDialogDescription>Description here.</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    )
    expect(screen.getByText("Always Open")).toBeInTheDocument()
  })
})

describe("AlertDialogHeader component", () => {
  it("renders with data-slot='alert-dialog-header'", () => {
    render(<AlertDialogHeader>Header Content</AlertDialogHeader>)
    const header = screen.getByText("Header Content")
    expect(header).toHaveAttribute("data-slot", "alert-dialog-header")
  })

  it("renders children", () => {
    render(<AlertDialogHeader>My Header</AlertDialogHeader>)
    expect(screen.getByText("My Header")).toBeInTheDocument()
  })

  it("merges custom className", () => {
    render(<AlertDialogHeader className="custom-header">Header</AlertDialogHeader>)
    const header = screen.getByText("Header")
    expect(header.className).toContain("custom-header")
  })
})

describe("AlertDialogFooter component", () => {
  it("renders with data-slot='alert-dialog-footer'", () => {
    render(<AlertDialogFooter>Footer Content</AlertDialogFooter>)
    const footer = screen.getByText("Footer Content")
    expect(footer).toHaveAttribute("data-slot", "alert-dialog-footer")
  })

  it("renders children", () => {
    render(<AlertDialogFooter>Footer text</AlertDialogFooter>)
    expect(screen.getByText("Footer text")).toBeInTheDocument()
  })

  it("merges custom className", () => {
    render(<AlertDialogFooter className="custom-footer">Footer</AlertDialogFooter>)
    expect(screen.getByText("Footer").className).toContain("custom-footer")
  })
})

describe("AlertDialogMedia component", () => {
  it("renders with data-slot='alert-dialog-media'", () => {
    render(<AlertDialogMedia>Media</AlertDialogMedia>)
    const media = screen.getByText("Media")
    expect(media).toHaveAttribute("data-slot", "alert-dialog-media")
  })

  it("includes inline-flex class", () => {
    render(<AlertDialogMedia>Icon</AlertDialogMedia>)
    const media = screen.getByText("Icon")
    expect(media.className).toContain("inline-flex")
  })

  it("merges custom className", () => {
    render(<AlertDialogMedia className="custom-media">Media</AlertDialogMedia>)
    expect(screen.getByText("Media").className).toContain("custom-media")
  })
})

describe("AlertDialogAction component", () => {
  it("renders as a button", () => {
    render(<AlertDialogAction>Confirm</AlertDialogAction>)
    const btn = screen.getByRole("button", { name: /confirm/i })
    expect(btn).toBeInTheDocument()
  })

  it("renders with data-slot='alert-dialog-action'", () => {
    render(<AlertDialogAction>Confirm</AlertDialogAction>)
    expect(screen.getByRole("button", { name: /confirm/i })).toHaveAttribute(
      "data-slot",
      "alert-dialog-action"
    )
  })

  it("accepts variant prop", () => {
    render(<AlertDialogAction variant="destructive">Delete</AlertDialogAction>)
    const btn = screen.getByRole("button", { name: /delete/i })
    expect(btn.className).toContain("bg-destructive")
  })

  it("merges custom className", () => {
    render(<AlertDialogAction className="confirm-btn">OK</AlertDialogAction>)
    const btn = screen.getByRole("button", { name: /ok/i })
    expect(btn.className).toContain("confirm-btn")
  })
})

describe("AlertDialog full composition", () => {
  it("renders a complete dialog with all sub-components", async () => {
    const user = userEvent.setup()
    render(
      <AlertDialog>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
    await user.click(screen.getByText("Open"))
    expect(screen.getByText("Delete Item")).toBeInTheDocument()
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument()
    expect(screen.getByText("Cancel")).toBeInTheDocument()
    expect(screen.getByText("Continue")).toBeInTheDocument()
  })

  it("renders sm size variant on content", () => {
    render(
      <AlertDialog open>
        <AlertDialogContent size="sm">
          <AlertDialogTitle>Small Dialog</AlertDialogTitle>
          <AlertDialogDescription>Small size.</AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    )
    const content = document.querySelector("[data-slot='alert-dialog-content']")
    expect(content).toHaveAttribute("data-size", "sm")
  })
})