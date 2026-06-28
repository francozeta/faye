import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("cn", () => {
  it("returns a single class unchanged", () => {
    expect(cn("foo")).toBe("foo")
  })

  it("merges multiple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("ignores undefined and null values", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar")
  })

  it("ignores false and empty strings", () => {
    expect(cn("foo", false, "", "bar")).toBe("foo bar")
  })

  it("conditionally includes classes via objects", () => {
    expect(cn({ foo: true, bar: false })).toBe("foo")
  })

  it("handles arrays of class names", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar")
  })

  it("deduplicates conflicting Tailwind classes (last wins)", () => {
    // tailwind-merge resolves conflicts: px-2 overrides px-4
    expect(cn("px-4", "px-2")).toBe("px-2")
  })

  it("keeps non-conflicting Tailwind classes", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2")
  })

  it("merges text color conflicts (last wins)", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
  })

  it("handles an empty call returning empty string", () => {
    expect(cn()).toBe("")
  })

  it("handles all-falsy call returning empty string", () => {
    expect(cn(undefined, null, false, "")).toBe("")
  })

  it("combines conditional object with string", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active")
  })

  it("merges background color conflicts", () => {
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500")
  })

  it("resolves font-size conflicts", () => {
    expect(cn("text-sm", "text-lg")).toBe("text-lg")
  })

  it("handles deeply nested arrays and objects", () => {
    expect(cn(["foo", { bar: true }], "baz")).toBe("foo bar baz")
  })
})