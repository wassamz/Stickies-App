import { render, screen, fireEvent } from "@testing-library/react";
import SignUpForm from "../SignUpForm";

// Mock functions for the submit and toggleForm props
const mockSubmit = jest.fn();
const mockToggleForm = jest.fn();
const mockError = jest.fn();
const mockInfo = jest.fn();

describe("SignUpForm Component", () => {
  beforeEach(() => {
    // Render the SignUpForm component before each test
    render(
      <SignUpForm
        submit={mockSubmit}
        toggleForm={mockToggleForm}
        errorMessage={mockError}
        infoMessage={mockInfo}
      />
    );
  });

  it("renders correctly", () => {
    // Check if all elements are rendered
    expect(screen.getByText("My Stickies Sign Up")).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText("Back to Login")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("updates input fields when typed into", () => {
    // Select name, email, and password inputs
    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/E-mail/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const mockSubmitData = {
      name: "John Doe",
      email: "john@example.com",
      password: "Password123$",
    };
    // Simulate user input
    fireEvent.change(nameInput, { target: { value: mockSubmitData.name } });
    fireEvent.change(emailInput, { target: { value: mockSubmitData.email } });
    fireEvent.change(passwordInput, {
      target: { value: mockSubmitData.password },
    });

    // Check if the values were updated correctly
    expect(nameInput.value).toBe("John Doe");
    expect(emailInput.value).toBe("john@example.com");
    expect(passwordInput.value).toBe("Password123$");
  });

  it("calls the submit function with form data on form submission", () => {
    // Select inputs and submit button
    const nameInput = screen.getByTestId("sign-up-name");
    const emailInput = screen.getByTestId("sign-up-email");
    const passwordInput = screen.getByTestId("sign-up-password");
    const signUpButton = screen.getByTestId("sign-up-user-button");
    const mockSubmitData = {
      name: "John Doe",
      email: "john@example.com",
      password: "Password123$",
    };
    // Simulate user input
    fireEvent.change(nameInput, { target: { value: mockSubmitData.name } });
    fireEvent.change(emailInput, { target: { value: mockSubmitData.email } });
    fireEvent.change(passwordInput, {
      target: { value: mockSubmitData.password },
    });

    // Simulate form submission
    fireEvent.click(signUpButton);
    expect(signUpButton.textContent).toBe("Sign Up");

    // Check if the submit function was called with the form data
    expect(mockSubmit).toHaveBeenCalledWith(mockSubmitData);
  });

  it("calls toggleForm function when 'Login' button is clicked", () => {
    // Select the "Login" button
    const loginButton = screen.getByTestId("login-user-button");
    expect(loginButton.textContent).toBe("Back to Login");
    // Simulate button click
    fireEvent.click(loginButton);

    // Check if the toggleForm function was called with the correct argument
    expect(mockToggleForm).toHaveBeenCalledWith({
      email: "",
      name: "",
      password: "",
      toggleForm: 0,
    });
  });
});
