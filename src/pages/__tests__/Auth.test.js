import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import { login, signUp } from "../../services/Api"; // Mock this service
import Auth from "../Auth";

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

describe("Auth Component", () => {
  beforeEach(() => {
    // Mock useNavigate in the beforeEach so it's available before rendering the component
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);
    render(<Auth />);
  });

  it("renders the LoginForm by default", () => {
    expect(screen.getByText(/My Stickies Login/i)).toBeInTheDocument();
  });

  it("renders the SignUpForm when toggled", () => {
    const createAccountButton = screen.getByTestId("sign-up-user-button");
    fireEvent.click(createAccountButton);
    expect(screen.getByText(/My Stickies Sign Up/i)).toBeInTheDocument();
  });

  it("calls login service on form submit and shows error if login fails", async () => {
    login.mockResolvedValueOnce({
      status: "ERROR",
      message: "Invalid credentials",
    });

    const submitButton = screen.getByTestId("login-user-button");
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    );
  });

  it("calls signUp service on form submit and shows success message on successful signup", async () => {
    signUp.mockResolvedValueOnce({
      status: "SUCCESS",
      message: "Account created successfully",
    });

    const createAccountButton = screen.getByTestId("sign-up-user-button");
    fireEvent.click(createAccountButton);

    const submitButton = screen.getByText(/create account/i);
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(
        screen.getByText(/account created successfully/i)
      ).toBeInTheDocument()
    );
  });

  it("navigates to /notes on successful login/signup", async () => {
    const mockData = { email: "test@test.com", password: "password123" };

    login.mockResolvedValueOnce({
      status: "SUCCESS",
      message: "Logged in successfully",
    });

    // Ensure useNavigate is mocked properly inside beforeEach
    const navigate = useNavigate();

    const loginButton = screen.getByTestId("login-user-button");
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(
        "/notes",
        expect.objectContaining({ replace: true })
      );
    });
  });

  it("displays the error message if login/signup fails", async () => {
    login.mockResolvedValueOnce({
      status: "ERROR",
      message: "Unable to login",
    });

    const loginButton = screen.getByTestId("login-user-button");
    fireEvent.click(loginButton);

    await waitFor(() =>
      expect(screen.getByText(/Unable to login/i)).toBeInTheDocument()
    );
  });

  it("displays the info message after successful login/signup", async () => {
    login.mockResolvedValueOnce({
      status: "SUCCESS",
      message: "Login Successful",
    });

    const loginButton = screen.getByTestId("login-user-button");
    fireEvent.click(loginButton);

    await waitFor(() =>
      expect(screen.getByText(/Login Successful/i)).toBeInTheDocument()
    );
  });
});
