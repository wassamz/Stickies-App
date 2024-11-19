import { render, screen, fireEvent } from "@testing-library/react";
import LoginForm from "../LoginForm";

// Mock functions to use in place of the actual submit and toggleForm props
const mockSubmit = jest.fn();
const mockToggleForm = jest.fn();

describe("LoginForm Component", () => {
  beforeEach(() => {
    // Render the LoginForm component before each test
    render(<LoginForm submit={mockSubmit} toggleForm={mockToggleForm} />);
  });

  it("renders correctly", () => {
    // Check if all elements are rendered
    expect(screen.getByText("My Stickies Login")).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText("Create Account")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("updates input fields when typed into", () => {
    // Select email and password inputs
    const emailInput = screen.getByLabelText(/E-mail/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    // Simulate user typing
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Check if the values were updated correctly
    expect(emailInput.value).toBe("user@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("calls the submit function with form data on form submission", () => {
    // Select email and password inputs
    const emailInput = screen.getByTestId("login-email");
    const passwordInput = screen.getByTestId("login-password");
    const submitButton = screen.getByTestId("login-user-button");

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Simulate form submission
    fireEvent.click(submitButton);
    expect(submitButton.textContent).toBe("Login");
    // Check if the submit function was called with the form data
    expect(mockSubmit).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "password123",
    });
  });

  it("calls toggleForm function when 'Create Account' button is clicked", () => {
    // Select the "Create Account" button
    const createAccountButton = screen.getByTestId("sign-up-user-button");
    expect(createAccountButton.textContent).toBe("Create Account");
    // Simulate button click
    fireEvent.click(createAccountButton);

    // Check if the toggleForm function was called with the correct argument
    expect(mockToggleForm).toHaveBeenCalledWith(true);
  });
});
