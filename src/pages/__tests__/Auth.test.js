import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import config from "../../config/config";
import { useUserProfile } from "../../context/UserContext";
import { checkEmail, login, signUp } from "../../services/Api";
import { errorReason } from "../../util/inputValidation";
import Auth from "../Auth";

// Mock setUser function before other mocks
const mockSetUser = jest.fn();
const mockNavigate = jest.fn();

// Mock the api calls
jest.mock("../../services/Api", () => ({
  login: jest.fn(),
  signUp: jest.fn(),
  checkEmail: jest.fn(),
}));

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: "/" }),
}));

//jsdom (used in Jest tests) doesn't support scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock UserContext
jest.mock("../../context/UserContext", () => ({
  UserProvider: ({ children }) => children,
  useUserProfile: jest.fn(),
}));

describe("Auth Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserProfile.mockReturnValue({
      user: { email: "mocktest@example.com" },
      setUser: mockSetUser,
    });
    render(<Auth />);
  });

  // Your existing test cases updated to use imported mocks
  it("renders the LoginForm by default", () => {
    expect(screen.getByText(/My Stickies Login/i)).toBeInTheDocument();
  });

  it("renders the SignUpForm when toggled", () => {
    const signUpFormButton = screen.getByTestId("signup-user-form-button");
    fireEvent.click(signUpFormButton);
    expect(screen.getByText(/My Stickies Sign Up/i)).toBeInTheDocument();
  });

  it("navigates to /notes on successful Sign Up", async () => {
    
    checkEmail.mockResolvedValueOnce({
      status: "SUCCESS",
      message: "OTP sent successfully",
    });

    signUp.mockResolvedValueOnce({
      status: "SUCCESS",
      message: "User Created",
    });

    const mockFormData = {
      name: "Test User",
      email: "test@example.com",
      password: "NewPassword123$",
      otp: "1234",
    };

    // Open Sign Up Form
    const signUpFormButton = screen.getByTestId("signup-user-form-button");
    fireEvent.click(signUpFormButton);

    // Step 1: Enter and submit email for OTP
    await waitFor(() => screen.getByTestId("signup-email"));
    const emailInput = screen.getByTestId("signup-email");

    fireEvent.change(emailInput, { target: { value: mockFormData.email } });

    const sendOtpButton = screen.getByTestId("signup-send-otp-button");
    fireEvent.click(sendOtpButton);

    // Wait for OTP form to appear and enter OTP
    await waitFor(() => screen.getByTestId("otp-input-0"));

    // Step 2: Enter OTP, name, and password
    // Find each OTP input by specific test-id and enter value
    for (let i = 0; i < config.otpLength; i++) {
      const input = screen.getByTestId(`otp-input-${i}`).querySelector("input");
      fireEvent.change(input, { target: { value: mockFormData.otp[i] } });
    }

    //enter name and password
    const nameInput = screen.getByTestId("signup-name");
    const passwordInput = screen.getByTestId("signup-password");
    fireEvent.change(nameInput, {
      target: { value: mockFormData.name },
    });
    expect(nameInput).toHaveValue(mockFormData.name);
    fireEvent.change(passwordInput, {
      target: { value: mockFormData.password },
    });
    expect(passwordInput).toHaveValue(mockFormData.password);

    // mock the successful sign up
    const signupButton = screen.getByTestId("signup-submit-otp-button");
    fireEvent.click(signupButton);

    // Verify navigation
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
      expect(screen.getByText(errorReason.EMAIL_INVALID)).toBeInTheDocument()
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
      expect(screen.getByText(errorReason.PASSWORD_INVALID)).toBeInTheDocument()
    );
  });
});
