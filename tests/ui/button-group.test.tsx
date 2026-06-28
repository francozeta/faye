import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
} from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"

describe("buttonGroupVariants", () => {
  it("returns horizontal orientation classes by default", () => {
    const cls = buttonGroupVariants()
    expect(cls).toContain("flex")
    expect(cls).toContain("w-fit")
  })

  it("returns horizontal orientation variant classes", () => {
    const cls = buttonGroupVariants({ orientation: "horizontal" })
    expect(cls).toContain("flex")
  })

  it("returns vertical orientation variant classes", () => {
    const cls = buttonGroupVariants({ orientation: "vertical" })
    expect(cls).toContain("flex-col")
  })

  it("merges extra className into output", () => {
    const cls = buttonGroupVariants({ className: "custom-group" })
    expect(cls).toContain("custom-group")
  })
})

describe("ButtonGroup component", () => {
  it("renders with role='group'", () => {
    render(
      <ButtonGroup>
        <Button>One</Button>
      </ButtonGroup>
    )
    expect(screen.getByRole("group")).toBeInTheDocument()
  })

  it("renders with data-slot='button-group'", () => {
    render(
      <ButtonGroup>
        <Button>One</Button>
      </ButtonGroup>
    )
    expect(document.querySelector("[data-slot='button-group']")).toBeInTheDocument()
  })

  it("does not set data-orientation when no orientation prop provided", () => {
    render(
      <ButtonGroup>
        <Button>One</Button>
      </ButtonGroup>
    )
    // When orientation prop is not provided (undefined), no data-orientation attribute
    const el = document.querySelector("[data-slot='button-group']")
    expect(el).not.toHaveAttribute("data-orientation")
  })

  it("renders with data-orientation='vertical' when given", () => {
    render(
      <ButtonGroup orientation="vertical">
        <Button>One</Button>
      </ButtonGroup>
    )
    expect(document.querySelector("[data-slot='button-group']")).toHaveAttribute(
      "data-orientation",
      "vertical"
    )
  })

  it("applies flex and w-fit classes", () => {
    const { container } = render(
      <ButtonGroup>
        <Button>One</Button>
      </ButtonGroup>
    )
    const el = container.querySelector("[data-slot='button-group']") as HTMLElement
    expect(el.className).toContain("flex")
    expect(el.className).toContain("w-fit")
  })

  it("applies flex-col class for vertical orientation", () => {
    const { container } = render(
      <ButtonGroup orientation="vertical">
        <Button>One</Button>
      </ButtonGroup>
    )
    const el = container.querySelector("[data-slot='button-group']") as HTMLElement
    expect(el.className).toContain("flex-col")
  })

  it("renders multiple buttons as children", () => {
    render(
      <ButtonGroup>
        <Button>Save</Button>
        <Button>Cancel</Button>
      </ButtonGroup>
    )
    expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument()
  })

  it("merges custom className", () => {
    const { container } = render(
      <ButtonGroup className="custom-btn-group">
        <Button>One</Button>
      </ButtonGroup>
    )
    const el = container.querySelector("[data-slot='button-group']") as HTMLElement
    expect(el.className).toContain("custom-btn-group")
  })

  it("renders as a div element", () => {
    render(
      <ButtonGroup>
        <Button>One</Button>
      </ButtonGroup>
    )
    expect(screen.getByRole("group").tagName.toLowerCase()).toBe("div")
  })
})

describe("ButtonGroupText component", () => {
  it("renders with data-slot='button-group-text'", () => {
    render(<ButtonGroupText>Label</ButtonGroupText>)
    expect(document.querySelector("[data-slot='button-group-text']")).toBeInTheDocument()
  })

  it("renders text content", () => {
    render(<ButtonGroupText>https://</ButtonGroupText>)
    expect(screen.getByText("https://")).toBeInTheDocument()
  })

  it("applies border and bg-muted classes", () => {
    const { container } = render(<ButtonGroupText>Text</ButtonGroupText>)
    const el = container.querySelector("[data-slot='button-group-text']") as HTMLElement
    expect(el.className).toContain("border")
    expect(el.className).toContain("bg-muted")
  })

  it("applies rounded-md class", () => {
    const { container } = render(<ButtonGroupText>Text</ButtonGroupText>)
    const el = container.querySelector("[data-slot='button-group-text']") as HTMLElement
    expect(el.className).toContain("rounded-md")
  })

  it("applies font-medium class", () => {
    const { container } = render(<ButtonGroupText>Text</ButtonGroupText>)
    const el = container.querySelector("[data-slot='button-group-text']") as HTMLElement
    expect(el.className).toContain("font-medium")
  })

  it("merges custom className", () => {
    const { container } = render(<ButtonGroupText className="custom-text">Text</ButtonGroupText>)
    const el = container.querySelector("[data-slot='button-group-text']") as HTMLElement
    expect(el.className).toContain("custom-text")
  })

  it("renders as a div by default", () => {
    render(<ButtonGroupText>Text</ButtonGroupText>)
    const el = document.querySelector("[data-slot='button-group-text']")
    expect(el?.tagName.toLowerCase()).toBe("div")
  })
})

describe("ButtonGroupSeparator component", () => {
  it("renders with data-slot='button-group-separator'", () => {
    render(
      <ButtonGroup>
        <Button>A</Button>
        <ButtonGroupSeparator />
        <Button>B</Button>
      </ButtonGroup>
    )
    expect(document.querySelector("[data-slot='button-group-separator']")).toBeInTheDocument()
  })

  it("applies bg-input class", () => {
    render(
      <ButtonGroup>
        <Button>A</Button>
        <ButtonGroupSeparator />
        <Button>B</Button>
      </ButtonGroup>
    )
    const sep = document.querySelector("[data-slot='button-group-separator']") as HTMLElement
    expect(sep.className).toContain("bg-input")
  })

  it("renders with vertical orientation by default", () => {
    render(
      <ButtonGroup>
        <Button>A</Button>
        <ButtonGroupSeparator />
        <Button>B</Button>
      </ButtonGroup>
    )
    const sep = document.querySelector("[data-slot='button-group-separator']")
    // @base-ui separator renders with data-orientation
    expect(sep).toBeInTheDocument()
  })

  it("merges custom className", () => {
    render(
      <ButtonGroup>
        <Button>A</Button>
        <ButtonGroupSeparator className="custom-sep" />
        <Button>B</Button>
      </ButtonGroup>
    )
    const sep = document.querySelector("[data-slot='button-group-separator']") as HTMLElement
    expect(sep.className).toContain("custom-sep")
  })
})

describe("ButtonGroup full composition", () => {
  it("renders a horizontal button group with separator", () => {
    render(
      <ButtonGroup>
        <Button>Left</Button>
        <ButtonGroupSeparator />
        <Button>Right</Button>
      </ButtonGroup>
    )
    expect(screen.getByRole("group")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /left/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /right/i })).toBeInTheDocument()
  })

  it("renders a group with text prefix and button", () => {
    render(
      <ButtonGroup>
        <ButtonGroupText>https://</ButtonGroupText>
        <Button>Go</Button>
      </ButtonGroup>
    )
    expect(screen.getByText("https://")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /go/i })).toBeInTheDocument()
  })

  it("renders a vertical button group", () => {
    const { container } = render(
      <ButtonGroup orientation="vertical">
        <Button>Top</Button>
        <Button>Bottom</Button>
      </ButtonGroup>
    )
    const el = container.querySelector("[data-slot='button-group']") as HTMLElement
    expect(el.className).toContain("flex-col")
    expect(screen.getByRole("button", { name: /top/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /bottom/i })).toBeInTheDocument()
  })
})