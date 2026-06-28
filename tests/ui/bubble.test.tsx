import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { BubbleGroup, Bubble, BubbleContent, BubbleReactions } from "@/components/ui/bubble"

describe("BubbleGroup component", () => {
  it("renders with data-slot='bubble-group'", () => {
    render(<BubbleGroup>Content</BubbleGroup>)
    expect(document.querySelector("[data-slot='bubble-group']")).toBeInTheDocument()
  })

  it("renders children", () => {
    render(<BubbleGroup>Group content</BubbleGroup>)
    expect(screen.getByText("Group content")).toBeInTheDocument()
  })

  it("applies flex flex-col gap classes", () => {
    const { container } = render(<BubbleGroup>Group</BubbleGroup>)
    const el = container.querySelector("[data-slot='bubble-group']") as HTMLElement
    expect(el.className).toContain("flex")
    expect(el.className).toContain("flex-col")
  })

  it("merges custom className", () => {
    const { container } = render(<BubbleGroup className="custom-group">Group</BubbleGroup>)
    const el = container.querySelector("[data-slot='bubble-group']") as HTMLElement
    expect(el.className).toContain("custom-group")
  })
})

describe("Bubble component", () => {
  it("renders with data-slot='bubble'", () => {
    render(<Bubble>Bubble content</Bubble>)
    expect(document.querySelector("[data-slot='bubble']")).toBeInTheDocument()
  })

  it("renders with default data-variant='default'", () => {
    render(<Bubble>Bubble</Bubble>)
    expect(document.querySelector("[data-slot='bubble']")).toHaveAttribute("data-variant", "default")
  })

  it("renders with data-variant='secondary' when variant is secondary", () => {
    render(<Bubble variant="secondary">Bubble</Bubble>)
    expect(document.querySelector("[data-slot='bubble']")).toHaveAttribute("data-variant", "secondary")
  })

  it("renders with data-variant='muted' when variant is muted", () => {
    render(<Bubble variant="muted">Bubble</Bubble>)
    expect(document.querySelector("[data-slot='bubble']")).toHaveAttribute("data-variant", "muted")
  })

  it("renders with data-variant='tinted' when variant is tinted", () => {
    render(<Bubble variant="tinted">Bubble</Bubble>)
    expect(document.querySelector("[data-slot='bubble']")).toHaveAttribute("data-variant", "tinted")
  })

  it("renders with data-variant='outline' when variant is outline", () => {
    render(<Bubble variant="outline">Bubble</Bubble>)
    expect(document.querySelector("[data-slot='bubble']")).toHaveAttribute("data-variant", "outline")
  })

  it("renders with data-variant='ghost' when variant is ghost", () => {
    render(<Bubble variant="ghost">Bubble</Bubble>)
    expect(document.querySelector("[data-slot='bubble']")).toHaveAttribute("data-variant", "ghost")
  })

  it("renders with data-variant='destructive' when variant is destructive", () => {
    render(<Bubble variant="destructive">Bubble</Bubble>)
    expect(document.querySelector("[data-slot='bubble']")).toHaveAttribute("data-variant", "destructive")
  })

  it("renders with default data-align='start'", () => {
    render(<Bubble>Bubble</Bubble>)
    expect(document.querySelector("[data-slot='bubble']")).toHaveAttribute("data-align", "start")
  })

  it("renders with data-align='end' when align is end", () => {
    render(<Bubble align="end">Bubble</Bubble>)
    expect(document.querySelector("[data-slot='bubble']")).toHaveAttribute("data-align", "end")
  })

  it("applies max-w-[80%] class", () => {
    const { container } = render(<Bubble>Bubble</Bubble>)
    const el = container.querySelector("[data-slot='bubble']") as HTMLElement
    expect(el.className).toContain("max-w-[80%]")
  })

  it("renders children", () => {
    render(<Bubble>Hello world</Bubble>)
    expect(screen.getByText("Hello world")).toBeInTheDocument()
  })

  it("merges custom className", () => {
    const { container } = render(<Bubble className="custom-bubble">Bubble</Bubble>)
    const el = container.querySelector("[data-slot='bubble']") as HTMLElement
    expect(el.className).toContain("custom-bubble")
  })
})

describe("BubbleContent component", () => {
  it("renders with data-slot='bubble-content'", () => {
    render(<BubbleContent>Content</BubbleContent>)
    expect(document.querySelector("[data-slot='bubble-content']")).toBeInTheDocument()
  })

  it("renders children", () => {
    render(<BubbleContent>Message text</BubbleContent>)
    expect(screen.getByText("Message text")).toBeInTheDocument()
  })

  it("applies rounded-lg class by default", () => {
    const { container } = render(<BubbleContent>Content</BubbleContent>)
    const el = container.querySelector("[data-slot='bubble-content']") as HTMLElement
    expect(el.className).toContain("rounded-lg")
  })

  it("applies overflow-hidden class", () => {
    const { container } = render(<BubbleContent>Content</BubbleContent>)
    const el = container.querySelector("[data-slot='bubble-content']") as HTMLElement
    expect(el.className).toContain("overflow-hidden")
  })

  it("merges custom className", () => {
    const { container } = render(<BubbleContent className="custom-content">Content</BubbleContent>)
    const el = container.querySelector("[data-slot='bubble-content']") as HTMLElement
    expect(el.className).toContain("custom-content")
  })

  it("renders as a div by default", () => {
    const { container } = render(<BubbleContent>Content</BubbleContent>)
    const el = container.querySelector("[data-slot='bubble-content']")
    expect(el?.tagName.toLowerCase()).toBe("div")
  })

  it("renders as a button when render prop is given", () => {
    render(<BubbleContent render={<button />}>Clickable</BubbleContent>)
    const el = document.querySelector("[data-slot='bubble-content']")
    expect(el?.tagName.toLowerCase()).toBe("button")
  })
})

describe("BubbleReactions component", () => {
  it("renders with data-slot='bubble-reactions'", () => {
    render(<BubbleReactions>👍</BubbleReactions>)
    expect(document.querySelector("[data-slot='bubble-reactions']")).toBeInTheDocument()
  })

  it("renders with default data-side='bottom'", () => {
    render(<BubbleReactions>👍</BubbleReactions>)
    expect(document.querySelector("[data-slot='bubble-reactions']")).toHaveAttribute("data-side", "bottom")
  })

  it("renders with data-side='top' when side is top", () => {
    render(<BubbleReactions side="top">👍</BubbleReactions>)
    expect(document.querySelector("[data-slot='bubble-reactions']")).toHaveAttribute("data-side", "top")
  })

  it("renders with default data-align='end'", () => {
    render(<BubbleReactions>👍</BubbleReactions>)
    expect(document.querySelector("[data-slot='bubble-reactions']")).toHaveAttribute("data-align", "end")
  })

  it("renders with data-align='start' when align is start", () => {
    render(<BubbleReactions align="start">👍</BubbleReactions>)
    expect(document.querySelector("[data-slot='bubble-reactions']")).toHaveAttribute("data-align", "start")
  })

  it("applies absolute and z-10 classes", () => {
    const { container } = render(<BubbleReactions>👍</BubbleReactions>)
    const el = container.querySelector("[data-slot='bubble-reactions']") as HTMLElement
    expect(el.className).toContain("absolute")
    expect(el.className).toContain("z-10")
  })

  it("renders children", () => {
    render(<BubbleReactions>🔥 2</BubbleReactions>)
    expect(screen.getByText("🔥 2")).toBeInTheDocument()
  })

  it("merges custom className", () => {
    const { container } = render(<BubbleReactions className="custom-reactions">👍</BubbleReactions>)
    const el = container.querySelector("[data-slot='bubble-reactions']") as HTMLElement
    expect(el.className).toContain("custom-reactions")
  })

  it("applies bottom positioning class when side is bottom", () => {
    const { container } = render(<BubbleReactions side="bottom">👍</BubbleReactions>)
    const el = container.querySelector("[data-slot='bubble-reactions']") as HTMLElement
    expect(el.className).toContain("bottom-0")
  })

  it("applies top positioning class when side is top", () => {
    const { container } = render(<BubbleReactions side="top">👍</BubbleReactions>)
    const el = container.querySelector("[data-slot='bubble-reactions']") as HTMLElement
    expect(el.className).toContain("top-0")
  })
})

describe("Bubble composition", () => {
  it("renders a complete chat bubble", () => {
    render(
      <Bubble variant="default" align="start">
        <BubbleContent>Hello, how are you?</BubbleContent>
      </Bubble>
    )
    expect(screen.getByText("Hello, how are you?")).toBeInTheDocument()
  })

  it("renders a chat bubble group with multiple bubbles", () => {
    render(
      <BubbleGroup>
        <Bubble>
          <BubbleContent>First message</BubbleContent>
        </Bubble>
        <Bubble>
          <BubbleContent>Second message</BubbleContent>
        </Bubble>
      </BubbleGroup>
    )
    expect(screen.getByText("First message")).toBeInTheDocument()
    expect(screen.getByText("Second message")).toBeInTheDocument()
  })
})