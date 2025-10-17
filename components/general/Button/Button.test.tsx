import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Button } from "./Button"

describe("Button", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText("Click me")).toBeInTheDocument()
  })

  it("renders as button element", () => {
    const { container } = render(<Button>Test Button</Button>)
    const button = container.querySelector("button")
    expect(button).toBeInTheDocument()
  })

  it("applies correct intent classes - light", () => {
    const { container } = render(
      <Button intent="light">
        Light Button
      </Button>
    )
    const button = container.querySelector("button")
    expect(button).toHaveClass("bg-white")
    expect(button).toHaveClass("text-black")
  })

  it("applies correct intent classes - dark", () => {
    const { container } = render(
      <Button intent="dark">
        Dark Button
      </Button>
    )
    const button = container.querySelector("button")
    expect(button).toHaveClass("bg-black")
    expect(button).toHaveClass("text-white")
  })

  it("applies correct intent classes - muted", () => {
    const { container } = render(
      <Button intent="muted">
        Muted Button
      </Button>
    )
    const button = container.querySelector("button")
    expect(button).toHaveClass("bg-[#E6E6E6]")
  })

  it("applies correct size classes - sm", () => {
    const { container } = render(
      <Button size="sm">
        Small
      </Button>
    )
    const button = container.querySelector("button")
    expect(button).toHaveClass("text-sm")
    expect(button).toHaveClass("min-w-20")
  })

  it("applies correct size classes - md", () => {
    const { container } = render(
      <Button size="md">
        Medium
      </Button>
    )
    const button = container.querySelector("button")
    expect(button).toHaveClass("text-base")
    expect(button).toHaveClass("min-w-28")
  })

  it("applies correct size classes - lg", () => {
    const { container } = render(
      <Button size="lg">
        Large
      </Button>
    )
    const button = container.querySelector("button")
    expect(button).toHaveClass("text-lg")
    expect(button).toHaveClass("min-w-32")
  })

  it("applies underline when specified", () => {
    const { container } = render(
      <Button underline={true}>
        Underlined
      </Button>
    )
    const button = container.querySelector("button")
    expect(button).toHaveClass("underline")
  })

  it("handles disabled state", () => {
    const { container } = render(
      <Button disabled>
        Disabled
      </Button>
    )
    const button = container.querySelector("button")
    expect(button).toBeDisabled()
  })
})
