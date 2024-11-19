import { render, screen, fireEvent } from "@testing-library/react";
import SignUpForm from "../SignUpForm";

// Mock functions for the submit and toggleForm props
const mockSubmit = jest.fn();
const mockToggleForm = jest.fn();

describe("SignUpForm Component", () => {
  beforeEach(() => {
    // Render the SignUpForm component before each test
    render(<SignUpForm submit={mockSubmit} toggleForm={mockToggleForm} />);
  });

  it("renders correctly", () => {
    // Check if all elements are rendered
    expect(screen.getByText("My Stickies Sign Up")).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Create Account")).toBeInTheDocument();
  });

  it("updates input fields when typed into", () => {
    // Select name, email, and password inputs
    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/E-mail/i);
    const passwordInput = screen.getByLabelText(/Password/i);

    // Simulate user typing into inputs
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Check if the values were updated correctly
    expect(nameInput.value).toBe("John Doe");
    expect(emailInput.value).toBe("john@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  it("calls the submit function with form data on form submission", () => {
    // Select inputs and submit button
    const nameInput = screen.getByTestId("sign-up-name");
    const emailInput = screen.getByTestId("sign-up-email");
    const passwordInput = screen.getByTestId("sign-up-password");
    const submitButton = screen.getByTestId("sign-up-user-button");

    // Simulate user input
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Simulate form submission
    fireEvent.click(submitButton);
    expect(submitButton.textContent).toBe("Create Account");

    // Check if the submit function was called with the form data
    expect(mockSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });
  });

  it("calls toggleForm function when 'Login' button is clicked", () => {
    // Select the "Login" button
    const loginButton = screen.getByTestId("login-user-button");;
    expect(loginButton.textContent).toBe("Login");
    // Simulate button click
    fireEvent.click(loginButton);

    // Check if the toggleForm function was called with the correct argument
    expect(mockToggleForm).toHaveBeenCalledWith(true);
  });
});
