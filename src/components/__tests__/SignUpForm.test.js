import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { checkEmail, signUp } from "../../services/Api";
import { statusCode } from "../../util/auth";
import { errorReason } from "../../util/inputValidation";
import SignUpForm from "../SignUpForm";

jest.mock("../../util/auth", () => ({
  showForm: jest.fn(),
  statusCode: { SUCCESS: "SUCCESS", ERROR: "ERROR" },
}));

jest.mock("../../services/Api", () => ({
  checkEmail: jest.fn(),
  signUp: jest.fn(),
}));

jest.mock("../OTP", () => (props) => {
  return (
    <div data-testid="otp-input">
      {Array.from({ length: props.length }).map((_, index) => (
        <input
          key={index}
          data-testid={`otp-input-${index}`}
          value={props.value[index] || ""}
          onChange={(e) => {
            const newValue = e.target.value;
            const otpArray = props.value.split("");
            otpArray[index] = newValue;
            props.onChange(otpArray.join(""));
          }}
        />
      ))}
    </div>
  );
});

const mockSubmit = jest.fn();
const mockToggleForm = jest.fn();
const mockError = jest.fn();
const mockInfo = jest.fn();

describe("SignUpForm Component", () => {
  beforeEach(() => {
    render(
      <SignUpForm
        submit={mockSubmit}
        toggleForm={mockToggleForm}
        errorMessage={mockError}
        infoMessage={mockInfo}
      />
    );
  });

  it("renders SignUpForm component", () => {
    expect(screen.getByText("My Stickies Sign Up")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
  });

  it("handles email input change", () => {
    const emailInput = screen.getByTestId("signup-email");
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    expect(emailInput).toHaveValue("user@example.com");
  });

  it("sends OTP when email is valid", async () => {
    checkEmail.mockResolvedValue({ status: statusCode.SUCCESS });

    const emailInput = screen.getByTestId("signup-email");
    const sendOtpButton = screen.getByTestId("signup-send-otp-button");

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });

    await act(async () => {
      fireEvent.click(sendOtpButton);
    });

    expect(checkEmail).toHaveBeenCalledWith("user@example.com");
    expect(mockInfo).toHaveBeenCalledWith(null);
    await waitFor(() =>
      expect(mockInfo).toHaveBeenCalledWith(
        "To validate your email, a 4 digit One Time Password has been sent to your email address."
      )
    );
  });

  it("toggle Send Code button when email is invalid or not", async () => {
    checkEmail.mockResolvedValue({ status: statusCode.SUCCESS });
    const validEmail = "valid@example.com";
    const invalidEmail = "invalid-email";

    const emailInput = screen.getByTestId("signup-email");
    const sendOtpButton = screen.getByTestId("signup-send-otp-button");

    fireEvent.change(emailInput, { target: { value: invalidEmail } });
    expect(sendOtpButton.textContent).toBe("Send Code");
    //button should stay disabled
    expect(sendOtpButton).toBeDisabled();
    //validate once again with a valid email
    fireEvent.change(emailInput, { target: { value: validEmail } });
    expect(sendOtpButton).not.toBeDisabled();
    await act(async () => {
      fireEvent.click(sendOtpButton);
    });
    expect(mockInfo).toHaveBeenCalledWith(null);
    await waitFor(() =>
      expect(mockInfo).toHaveBeenCalledWith(
        "To validate your email, a 4 digit One Time Password has been sent to your email address."
      )
    );
  });

  it("complete signup when when OTP, name and new password are valid", async () => {
    //mock the successful checkEmail and signUp calls
    checkEmail.mockResolvedValue({ status: statusCode.SUCCESS });
    signUp.mockResolvedValue({ status: statusCode.SUCCESS });

    const mockFormData = {
      name: "Test User",
      email: "test@example.com",
      password: "NewPassword123$",
      otp: "1234",
    };

    const emailInput = screen.getByTestId("signup-email");
    const sendOtpButton = screen.getByTestId("signup-send-otp-button");

    fireEvent.change(emailInput, { target: { value: mockFormData.email } });
    await act(async () => {
      fireEvent.click(sendOtpButton);
    });
    await waitFor(() => screen.getByTestId("otp-input-0"));

    //info & errorMessage is set to null at the start of sendOTP function to clear any previous messages
    expect(mockInfo).toHaveBeenCalledWith(null);
    expect(mockError).toHaveBeenCalledWith(null);

    const signupButton = screen.getByTestId("signup-submit-otp-button");
    //the sign up button is disabled until all 4 digits are entered
    expect(signupButton).toBeDisabled();

    //the OTP inputs will appear on screen and sign up button will be displayed but disabled
    const otpInputs = screen.getAllByTestId(/^otp-input-/);
    //enter the valid OTP
    otpInputs.forEach((input, index) =>
      fireEvent.change(input, { target: { value: mockFormData.otp[index] } })
    );

    await waitFor(() =>
      expect(screen.getByTestId("otp-value")).toHaveTextContent(
        "Entered value: " + mockFormData.otp
      )
    );

    // once checkEmail is called, the timer starts
    expect(screen.getByTestId("timer-value")).toHaveTextContent(
      "Time remaining: 10:00"
    );

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

    //the sign up button is no longer disabled once all 4 digits and password are entered
    expect(signupButton).not.toBeDisabled();
    // mock the successful sign up
    await act(async () => {
      fireEvent.click(signupButton);
    });
    // Verify all API calls were made with correct data
    expect(checkEmail).toHaveBeenCalledWith(mockFormData.email);
    expect(signUp).toHaveBeenCalledWith(
      mockFormData.name,
      mockFormData.email,
      mockFormData.password,
      mockFormData.otp
    );
  });

  it("shows error when OTP is invalid", async () => {
    checkEmail.mockResolvedValue({ status: statusCode.SUCCESS });
    signUp.mockResolvedValue({ status: statusCode.ERROR }); //mock the failed OTP check
    const mockFormData = {
      name: "Test User",
      email: "test@example.com",
      password: "NewPassword123$",
      otp: "1234",
    };
    const invalidOTP = "0000";

    const emailInput = screen.getByTestId("signup-email");
    const sendOtpButton = screen.getByTestId("signup-send-otp-button");

    fireEvent.change(emailInput, { target: { value: mockFormData.email } });
    fireEvent.click(sendOtpButton);
    await waitFor(() => screen.getByTestId("otp-input-0"));

    //info & errorMessage is set to null at the start of sendOTP function to clear any previous messages
    expect(mockInfo).toHaveBeenCalledWith(null);
    expect(mockError).toHaveBeenCalledWith(null);

    //the OTP inputs will appear on screen and sign up button will be displayed but disabled
    const otpInputs = screen.getAllByTestId(/^otp-input-/);
    const signUpButton = screen.getByTestId("signup-submit-otp-button");
    //the sign up button is disabled until all 4 digits and password
    expect(signUpButton).toBeDisabled();

    // once checkEmail is called, the timer starts
    expect(screen.getByTestId("timer-value")).toHaveTextContent(
      "Time remaining: 10:00"
    );

    //enter the invalid OTP
    otpInputs.forEach((input, index) =>
      fireEvent.change(input, { target: { value: invalidOTP[index] } })
    );

    //the sign up button is no longer disabled once all 4 digits are entered
    expect(signUpButton).not.toBeDisabled();

    await waitFor(() =>
      expect(screen.getByTestId("otp-value")).toHaveTextContent(
        "Entered value: " + invalidOTP
      )
    );

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

    //click the sign up button
    fireEvent.click(signUpButton);

    expect(signUp).toHaveBeenCalledWith(
      mockFormData.name,
      mockFormData.email,
      mockFormData.password,
      invalidOTP
    );

    //errorMessage is set to null at the start of handleSignup function to clear any previous error messages
    expect(mockError).toHaveBeenCalledWith(null);
    await waitFor(() =>
      expect(mockError).toHaveBeenCalledWith(errorReason.OTP_INVALID)
    );
  });
});
