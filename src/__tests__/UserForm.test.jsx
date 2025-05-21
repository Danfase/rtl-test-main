import { render } from "@testing-library/react"
import { UserForm } from "../components/UserForm"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"

test("text should be visible after input and pressing on submit button", () => {
    render(<UserForm />)
    const input = screen.getByPlaceholderText("Input your name")
    const button = screen.getByText("Submit")
  
    userEvent.type(input, "Jonh")
    userEvent.click(button)
    const text = screen.getByText("Jonh")
    expect(text).toBeInTheDocument()
})