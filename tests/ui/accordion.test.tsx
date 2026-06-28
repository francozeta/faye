import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

describe("Accordion component", () => {
  it("renders with data-slot='accordion'", () => {
    render(<Accordion />)
    expect(document.querySelector("[data-slot='accordion']")).toBeInTheDocument()
  })

  it("applies flex w-full flex-col classes", () => {
    const { container } = render(<Accordion />)
    const el = container.querySelector("[data-slot='accordion']") as HTMLElement
    expect(el.className).toContain("flex")
    expect(el.className).toContain("w-full")
    expect(el.className).toContain("flex-col")
  })

  it("applies border and rounded-md classes", () => {
    const { container } = render(<Accordion />)
    const el = container.querySelector("[data-slot='accordion']") as HTMLElement
    expect(el.className).toContain("border")
    expect(el.className).toContain("rounded-md")
  })

  it("merges custom className", () => {
    const { container } = render(<Accordion className="custom-accordion" />)
    const el = container.querySelector("[data-slot='accordion']") as HTMLElement
    expect(el.className).toContain("custom-accordion")
  })
})

describe("AccordionItem component", () => {
  it("renders with data-slot='accordion-item'", () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">Item</AccordionItem>
      </Accordion>
    )
    expect(document.querySelector("[data-slot='accordion-item']")).toBeInTheDocument()
  })

  it("merges custom className", () => {
    render(
      <Accordion>
        <AccordionItem value="item-1" className="custom-item">
          Item
        </AccordionItem>
      </Accordion>
    )
    const el = document.querySelector("[data-slot='accordion-item']") as HTMLElement
    expect(el.className).toContain("custom-item")
  })
})

describe("AccordionTrigger component", () => {
  it("renders with data-slot='accordion-trigger'", () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger text</AccordionTrigger>
        </AccordionItem>
      </Accordion>
    )
    expect(document.querySelector("[data-slot='accordion-trigger']")).toBeInTheDocument()
  })

  it("renders trigger text content", () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section Title</AccordionTrigger>
        </AccordionItem>
      </Accordion>
    )
    expect(screen.getByText("Section Title")).toBeInTheDocument()
  })

  it("applies hover:underline class", () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger</AccordionTrigger>
        </AccordionItem>
      </Accordion>
    )
    const trigger = document.querySelector("[data-slot='accordion-trigger']") as HTMLElement
    expect(trigger.className).toContain("hover:underline")
  })

  it("applies font-medium class", () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Trigger</AccordionTrigger>
        </AccordionItem>
      </Accordion>
    )
    const trigger = document.querySelector("[data-slot='accordion-trigger']") as HTMLElement
    expect(trigger.className).toContain("font-medium")
  })

  it("merges custom className", () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger className="custom-trigger">Trigger</AccordionTrigger>
        </AccordionItem>
      </Accordion>
    )
    const trigger = document.querySelector("[data-slot='accordion-trigger']") as HTMLElement
    expect(trigger.className).toContain("custom-trigger")
  })
})

describe("AccordionContent component", () => {
  it("renders panel element in DOM after opening", async () => {
    const user = userEvent.setup()
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Open panel</AccordionTrigger>
          <AccordionContent>Content text</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    await user.click(screen.getByText("Open panel"))
    expect(document.querySelector("[data-slot='accordion-content']")).toBeInTheDocument()
  })

  it("shows content text when item is opened via click", async () => {
    const user = userEvent.setup()
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Open trigger</AccordionTrigger>
          <AccordionContent>Content text here</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    await user.click(screen.getByText("Open trigger"))
    expect(screen.getByText("Content text here")).toBeInTheDocument()
  })

  it("applies overflow-hidden class after opening", async () => {
    const user = userEvent.setup()
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Open for class test</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    await user.click(screen.getByText("Open for class test"))
    const content = document.querySelector("[data-slot='accordion-content']") as HTMLElement
    expect(content.className).toContain("overflow-hidden")
  })

  it("merges custom className on inner div after opening", async () => {
    const user = userEvent.setup()
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Open for className test</AccordionTrigger>
          <AccordionContent className="custom-content">Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    await user.click(screen.getByText("Open for className test"))
    // The className is applied to the inner div inside AccordionContent
    const innerDiv = document.querySelector("[data-slot='accordion-content'] > div") as HTMLElement
    expect(innerDiv?.className).toContain("custom-content")
  })
})

describe("Accordion interaction", () => {
  it("expands an item when trigger is clicked", async () => {
    const user = userEvent.setup()
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Click to expand</AccordionTrigger>
          <AccordionContent>Expanded content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    await user.click(screen.getByText("Click to expand"))
    expect(screen.getByText("Expanded content")).toBeInTheDocument()
  })

  it("renders multiple accordion items", () => {
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    )
    expect(screen.getByText("Section 1")).toBeInTheDocument()
    expect(screen.getByText("Section 2")).toBeInTheDocument()
  })
})