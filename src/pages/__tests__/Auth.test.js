import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { UserProvider, useUserProfile } from "../../context/UserContext";
import { login, signUp } from "../../services/Api";
import Auth from "../Auth";
import { errorReason } from "../../util/inputValidation";

// Mock the login and signUp services
jest.mock("../../services/Api", () => ({
  login: jest.fn(),
  signUp: jest.fn(),
}));

// Mock useNavigate from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Mock the UserContext
jest.mock("../../context/UserContext", () => ({
  UserProvider: ({ children }) => <div>{children}</div>, // Simple mock provider
  useUserProfile: jest.fn(() => ({
    user: { email: "test@example.com" },
    setUser: mockSetUser, // Mock the setUser function
  })),
}));
describe("Auth Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock useNavigate in the beforeEach so it's available before rendering the component
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    useUserProfile.mockReturnValue({
      user: { email: "mocktest@example.com" },
      setUser: jest.fn(),
    });

    render(
      <UserProvider>
        <Auth />
      </UserProvider>
    );
  });

  it("renders the LoginForm by default", () => {
    expect(screen.getByText(/My Stickies Login/i)).toBeInTheDocument();
  });

  it("renders the SignUpForm when toggled", () => {
    const signUpFormButton = screen.getByTestId("sign-up-user-form-button");
    fireEvent.click(signUpFormButton);
    expect(screen.getByText(/My Stickies Sign Up/i)).toBeInTheDocument();
  });

  it("calls login service on form submit and shows error if login fails", async () => {
    login.mockResolvedValueOnce({
      status: "ERROR",
      message: errorReason.EMAIL_INVALID,
    });

    const submitButton = screen.getByTestId("login-user-button");
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(
        screen.getByText(errorReason.EMAIL_INVALID)
      ).toBeInTheDocument()
    );
  });

  it("navigates to /notes on successful Sign Up", async () => {
    signUp.mockResolvedValueOnce({
      status: "SUCCESS",
      message: "User Created",
    });

    // Open Sign Up Form
    const signUpFormButton = screen.getByTestId("sign-up-user-form-button");
    fireEvent.click(signUpFormButton);

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

    fireEvent.click(signUpButton);

    // Ensure useNavigate is mocked properly inside beforeEach
    const navigate = useNavigate();

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(
        "/notes",
        expect.objectContaining({ replace: true })
      );
    });
  });

  it("displays the error message if login if email is invalid", async () => {
    login.mockResolvedValueOnce({
      status: "ERROR",
      message: "Unable to login",
    });
    const emailInput = screen.getByTestId("login-email");
    const passwordInput = screen.getByTestId("login-password");
    const loginButton = screen.getByTestId("login-user-button");

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: "example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123$" } });

    fireEvent.click(loginButton);

    await waitFor(() =>
      expect(
        screen.getByText(errorReason.EMAIL_INVALID)
      ).toBeInTheDocument()
    );
  });
  it("displays the error message if login password is invalid", async () => {
    login.mockResolvedValueOnce({
      status: "ERROR",
      message: "Unable to login",
    });
    const emailInput = screen.getByTestId("login-email");
    const passwordInput = screen.getByTestId("login-password");
    const loginButton = screen.getByTestId("login-user-button");

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(loginButton);

    await waitFor(() =>
      expect(
        screen.getByText(errorReason.PASSWORD_INVALID)
      ).toBeInTheDocument()
    );
  });

  it("displays the info message after successful login/signup", async () => {
    login.mockResolvedValueOnce({
      status: "SUCCESS",
      message: "Login Successful",
    });
    const emailInput = screen.getByTestId("login-email");
    const passwordInput = screen.getByTestId("login-password");
    const loginButton = screen.getByTestId("login-user-button");

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123$" } });

    fireEvent.click(loginButton);

    await waitFor(() =>
      expect(screen.getByText(/Login Successful/i)).toBeInTheDocument()
    );
  });
});
