import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  Attachment,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
} from "@/components/ui/attachment"

describe("Attachment component", () => {
  it("renders with data-slot='attachment'", () => {
    render(<Attachment>Content</Attachment>)
    expect(document.querySelector("[data-slot='attachment']")).toBeInTheDocument()
  })

  it("renders with default data-state='done'", () => {
    render(<Attachment>Content</Attachment>)
    expect(document.querySelector("[data-slot='attachment']")).toHaveAttribute("data-state", "done")
  })

  it("renders with data-state='idle'", () => {
    render(<Attachment state="idle">Content</Attachment>)
    expect(document.querySelector("[data-slot='attachment']")).toHaveAttribute("data-state", "idle")
  })

  it("renders with data-state='uploading'", () => {
    render(<Attachment state="uploading">Content</Attachment>)
    expect(document.querySelector("[data-slot='attachment']")).toHaveAttribute("data-state", "uploading")
  })

  it("renders with data-state='processing'", () => {
    render(<Attachment state="processing">Content</Attachment>)
    expect(document.querySelector("[data-slot='attachment']")).toHaveAttribute("data-state", "processing")
  })

  it("renders with data-state='error'", () => {
    render(<Attachment state="error">Content</Attachment>)
    expect(document.querySelector("[data-slot='attachment']")).toHaveAttribute("data-state", "error")
  })

  it("renders with default data-size='default'", () => {
    render(<Attachment>Content</Attachment>)
    expect(document.querySelector("[data-slot='attachment']")).toHaveAttribute("data-size", "default")
  })

  it("renders with data-size='sm'", () => {
    render(<Attachment size="sm">Content</Attachment>)
    expect(document.querySelector("[data-slot='attachment']")).toHaveAttribute("data-size", "sm")
  })

  it("renders with data-size='xs'", () => {
    render(<Attachment size="xs">Content</Attachment>)
    expect(document.querySelector("[data-slot='attachment']")).toHaveAttribute("data-size", "xs")
  })

  it("renders with default data-orientation='horizontal'", () => {
    render(<Attachment>Content</Attachment>)
    expect(document.querySelector("[data-slot='attachment']")).toHaveAttribute(
      "data-orientation",
      "horizontal"
    )
  })

  it("renders with data-orientation='vertical'", () => {
    render(<Attachment orientation="vertical">Content</Attachment>)
    expect(document.querySelector("[data-slot='attachment']")).toHaveAttribute(
      "data-orientation",
      "vertical"
    )
  })

  it("applies rounded-lg and border classes", () => {
    const { container } = render(<Attachment>Content</Attachment>)
    const el = container.querySelector("[data-slot='attachment']") as HTMLElement
    expect(el.className).toContain("rounded-lg")
    expect(el.className).toContain("border")
  })

  it("renders children", () => {
    render(<Attachment>Attachment content</Attachment>)
    expect(screen.getByText("Attachment content")).toBeInTheDocument()
  })

  it("merges custom className", () => {
    const { container } = render(<Attachment className="custom-attachment">Content</Attachment>)
    const el = container.querySelector("[data-slot='attachment']") as HTMLElement
    expect(el.className).toContain("custom-attachment")
  })
})

describe("AttachmentMedia component", () => {
  it("renders with data-slot='attachment-media'", () => {
    render(
      <Attachment>
        <AttachmentMedia>Icon</AttachmentMedia>
      </Attachment>
    )
    expect(document.querySelector("[data-slot='attachment-media']")).toBeInTheDocument()
  })

  it("renders with default data-variant='icon'", () => {
    render(
      <Attachment>
        <AttachmentMedia>Icon</AttachmentMedia>
      </Attachment>
    )
    expect(document.querySelector("[data-slot='attachment-media']")).toHaveAttribute(
      "data-variant",
      "icon"
    )
  })

  it("renders with data-variant='image' when variant is image", () => {
    render(
      <Attachment>
        <AttachmentMedia variant="image">
          <img src="test.jpg" alt="test" />
        </AttachmentMedia>
      </Attachment>
    )
    expect(document.querySelector("[data-slot='attachment-media']")).toHaveAttribute(
      "data-variant",
      "image"
    )
  })

  it("applies aspect-square and rounded-md classes", () => {
    const { container } = render(
      <Attachment>
        <AttachmentMedia>Icon</AttachmentMedia>
      </Attachment>
    )
    const el = container.querySelector("[data-slot='attachment-media']") as HTMLElement
    expect(el.className).toContain("aspect-square")
    expect(el.className).toContain("rounded-md")
  })

  it("merges custom className", () => {
    const { container } = render(
      <Attachment>
        <AttachmentMedia className="custom-media">Icon</AttachmentMedia>
      </Attachment>
    )
    const el = container.querySelector("[data-slot='attachment-media']") as HTMLElement
    expect(el.className).toContain("custom-media")
  })
})

describe("AttachmentContent component", () => {
  it("renders with data-slot='attachment-content'", () => {
    render(
      <Attachment>
        <AttachmentContent>Content</AttachmentContent>
      </Attachment>
    )
    expect(document.querySelector("[data-slot='attachment-content']")).toBeInTheDocument()
  })

  it("applies flex-1 class", () => {
    const { container } = render(
      <Attachment>
        <AttachmentContent>Content</AttachmentContent>
      </Attachment>
    )
    const el = container.querySelector("[data-slot='attachment-content']") as HTMLElement
    expect(el.className).toContain("flex-1")
  })

  it("renders children", () => {
    render(
      <Attachment>
        <AttachmentContent>File name.pdf</AttachmentContent>
      </Attachment>
    )
    expect(screen.getByText("File name.pdf")).toBeInTheDocument()
  })

  it("merges custom className", () => {
    const { container } = render(
      <Attachment>
        <AttachmentContent className="custom-content">Content</AttachmentContent>
      </Attachment>
    )
    const el = container.querySelector("[data-slot='attachment-content']") as HTMLElement
    expect(el.className).toContain("custom-content")
  })
})

describe("AttachmentTitle component", () => {
  it("renders with data-slot='attachment-title'", () => {
    render(<AttachmentTitle>document.pdf</AttachmentTitle>)
    expect(document.querySelector("[data-slot='attachment-title']")).toBeInTheDocument()
  })

  it("renders title text", () => {
    render(<AttachmentTitle>My File.pdf</AttachmentTitle>)
    expect(screen.getByText("My File.pdf")).toBeInTheDocument()
  })

  it("applies truncate and font-medium classes", () => {
    const { container } = render(<AttachmentTitle>Title</AttachmentTitle>)
    const el = container.querySelector("[data-slot='attachment-title']") as HTMLElement
    expect(el.className).toContain("truncate")
    expect(el.className).toContain("font-medium")
  })

  it("merges custom className", () => {
    const { container } = render(<AttachmentTitle className="custom-title">Title</AttachmentTitle>)
    const el = container.querySelector("[data-slot='attachment-title']") as HTMLElement
    expect(el.className).toContain("custom-title")
  })

  it("renders as a span element", () => {
    render(<AttachmentTitle>Title</AttachmentTitle>)
    const el = document.querySelector("[data-slot='attachment-title']")
    expect(el?.tagName.toLowerCase()).toBe("span")
  })
})

describe("AttachmentDescription component", () => {
  it("renders with data-slot='attachment-description'", () => {
    render(<AttachmentDescription>1.2 MB</AttachmentDescription>)
    expect(document.querySelector("[data-slot='attachment-description']")).toBeInTheDocument()
  })

  it("renders description text", () => {
    render(<AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>)
    expect(screen.getByText("PDF · 2.4 MB")).toBeInTheDocument()
  })

  it("applies text-muted-foreground class", () => {
    const { container } = render(<AttachmentDescription>Size</AttachmentDescription>)
    const el = container.querySelector("[data-slot='attachment-description']") as HTMLElement
    expect(el.className).toContain("text-muted-foreground")
  })

  it("applies truncate class", () => {
    const { container } = render(<AttachmentDescription>Size</AttachmentDescription>)
    const el = container.querySelector("[data-slot='attachment-description']") as HTMLElement
    expect(el.className).toContain("truncate")
  })

  it("merges custom className", () => {
    const { container } = render(
      <AttachmentDescription className="custom-desc">Desc</AttachmentDescription>
    )
    const el = container.querySelector("[data-slot='attachment-description']") as HTMLElement
    expect(el.className).toContain("custom-desc")
  })
})

describe("AttachmentActions component", () => {
  it("renders with data-slot='attachment-actions'", () => {
    render(<AttachmentActions>Actions</AttachmentActions>)
    expect(document.querySelector("[data-slot='attachment-actions']")).toBeInTheDocument()
  })

  it("applies z-20 class", () => {
    const { container } = render(<AttachmentActions>Actions</AttachmentActions>)
    const el = container.querySelector("[data-slot='attachment-actions']") as HTMLElement
    expect(el.className).toContain("z-20")
  })

  it("renders children", () => {
    render(<AttachmentActions>Delete button</AttachmentActions>)
    expect(screen.getByText("Delete button")).toBeInTheDocument()
  })

  it("merges custom className", () => {
    const { container } = render(<AttachmentActions className="custom-actions">Actions</AttachmentActions>)
    const el = container.querySelector("[data-slot='attachment-actions']") as HTMLElement
    expect(el.className).toContain("custom-actions")
  })
})

describe("AttachmentAction component", () => {
  it("renders with data-slot='attachment-action'", () => {
    render(<AttachmentAction>X</AttachmentAction>)
    expect(document.querySelector("[data-slot='attachment-action']")).toBeInTheDocument()
  })

  it("renders as a button element", () => {
    render(<AttachmentAction>X</AttachmentAction>)
    expect(screen.getByRole("button", { name: /x/i })).toBeInTheDocument()
  })

  it("uses ghost variant by default", () => {
    render(<AttachmentAction>X</AttachmentAction>)
    const btn = screen.getByRole("button", { name: /x/i })
    expect(btn.className).toContain("hover:bg-muted")
  })

  it("uses icon-xs size by default", () => {
    render(<AttachmentAction>X</AttachmentAction>)
    const btn = screen.getByRole("button", { name: /x/i })
    expect(btn.className).toContain("size-5")
  })

  it("merges custom className", () => {
    render(<AttachmentAction className="custom-action">X</AttachmentAction>)
    const btn = screen.getByRole("button", { name: /x/i })
    expect(btn.className).toContain("custom-action")
  })
})

describe("AttachmentGroup component", () => {
  it("renders with data-slot='attachment-group'", () => {
    render(<AttachmentGroup>Group</AttachmentGroup>)
    expect(document.querySelector("[data-slot='attachment-group']")).toBeInTheDocument()
  })

  it("applies overflow-x-auto class", () => {
    const { container } = render(<AttachmentGroup>Group</AttachmentGroup>)
    const el = container.querySelector("[data-slot='attachment-group']") as HTMLElement
    expect(el.className).toContain("overflow-x-auto")
  })

  it("applies flex class", () => {
    const { container } = render(<AttachmentGroup>Group</AttachmentGroup>)
    const el = container.querySelector("[data-slot='attachment-group']") as HTMLElement
    expect(el.className).toContain("flex")
  })

  it("renders children", () => {
    render(<AttachmentGroup>Attachment items</AttachmentGroup>)
    expect(screen.getByText("Attachment items")).toBeInTheDocument()
  })

  it("merges custom className", () => {
    const { container } = render(<AttachmentGroup className="custom-group">Group</AttachmentGroup>)
    const el = container.querySelector("[data-slot='attachment-group']") as HTMLElement
    expect(el.className).toContain("custom-group")
  })
})

describe("Attachment full composition", () => {
  it("renders a complete attachment with media, content, title, description, and actions", () => {
    render(
      <Attachment state="done">
        <AttachmentMedia>📄</AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>report.pdf</AttachmentTitle>
          <AttachmentDescription>PDF · 2.1 MB</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction>✕</AttachmentAction>
        </AttachmentActions>
      </Attachment>
    )
    expect(screen.getByText("report.pdf")).toBeInTheDocument()
    expect(screen.getByText("PDF · 2.1 MB")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /✕/i })).toBeInTheDocument()
  })

  it("renders error state attachment with correct data-state", () => {
    render(
      <Attachment state="error">
        <AttachmentContent>
          <AttachmentTitle>failed-upload.jpg</AttachmentTitle>
          <AttachmentDescription>Upload failed</AttachmentDescription>
        </AttachmentContent>
      </Attachment>
    )
    const attachment = document.querySelector("[data-slot='attachment']")
    expect(attachment).toHaveAttribute("data-state", "error")
    expect(screen.getByText("Upload failed")).toBeInTheDocument()
  })
})