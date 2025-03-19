import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { forgotPassword, resetPassword } from "../../services/Api";
import { statusCode } from "../../util/auth";
import { errorReason } from "../../util/inputValidation";
import ResetForm from "../ResetForm";

jest.mock("../../util/auth", () => ({
  showForm: jest.fn(),
  statusCode: { SUCCESS: "SUCCESS", ERROR: "ERROR" },
}));

jest.mock("../../services/Api", () => ({
  forgotPassword: jest.fn(),
  resetPassword: jest.fn(),
}));

jest.mock("../OTP", () => {
  const OTP = (props) => {
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
  };

  return OTP;
});

const mockSubmit = jest.fn();
const mockToggleForm = jest.fn();
const mockError = jest.fn();
const mockInfo = jest.fn();

describe("ResetForm Component", () => {
  beforeEach(() => {
    render(
      <ResetForm
        submit={mockSubmit}
        toggleForm={mockToggleForm}
        errorMessage={mockError}
        infoMessage={mockInfo}
      />
    );
  });

  it("renders ResetForm component", () => {
    expect(screen.getByText("My StickiesPassword Reset")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
    expect(screen.getByTestId("reset-send-otp-button")).toBeInTheDocument();
  });

  it("handles email input change", () => {
    const emailInput = screen.getByTestId("reset-email");
    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    expect(emailInput).toHaveValue("user@example.com");
  });

  it("sends OTP when email is valid", async () => {
    forgotPassword.mockResolvedValue({ status: statusCode.SUCCESS });

    const emailInput = screen.getByTestId("reset-email");
    const sendOtpButton = screen.getByTestId("reset-send-otp-button");

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    await act(async () => {
      fireEvent.click(sendOtpButton);
    });

    expect(forgotPassword).toHaveBeenCalledWith("user@example.com");
    expect(mockInfo).toHaveBeenCalledWith(null);
    await waitFor(() =>
      expect(mockInfo).toHaveBeenCalledWith(
        "If your email is assigned to an account, a 4 digit One Time Password has been sent to your email address."
      )
    );
  });

  it("toggle Send Code button when email is invalid or not", async () => {
    forgotPassword.mockResolvedValue({ status: statusCode.SUCCESS });
    const validEmail = "valid@example.com";
    const invalidEmail = "invalid-email";

    const emailInput = screen.getByTestId("reset-email");
    const sendOtpButton = screen.getByTestId("reset-send-otp-button");

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
        "If your email is assigned to an account, a 4 digit One Time Password has been sent to your email address."
      )
    );
  });

  it("resets password when OTP and new password are valid", async () => {
    //mock the successful password reset
    forgotPassword.mockResolvedValue({ status: statusCode.SUCCESS });
    resetPassword.mockResolvedValue({ status: statusCode.SUCCESS });

    const mockFormData = {
      email: "test@example.com",
      password: "NewPassword123$",
      otp: "1234",
    };

    const emailInput = screen.getByTestId("reset-email");
    const sendOtpButton = screen.getByTestId("reset-send-otp-button");

    fireEvent.change(emailInput, { target: { value: mockFormData.email } });
    await act(async () => {
      fireEvent.click(sendOtpButton);
    });
    await waitFor(() => screen.getByTestId("otp-input-0"));

    //info & errorMessage is set to null at the start of sendOTP function to clear any previous messages
    expect(mockInfo).toHaveBeenCalledWith(null);
    expect(mockError).toHaveBeenCalledWith(null);

    const resetPasswordButton = screen.getByTestId("reset-submit-otp-button");
    //the reset button is disabled until all 4 digits and password are entered
    expect(resetPasswordButton).toBeDisabled();

    //the OTP inputs will appear on screen and reset password button will be displayed but disabled
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

    // once forget password is called, the timer starts
    expect(screen.getByTestId("timer-value")).toHaveTextContent(
      "Time remaining: 10:00"
    );

    //enter new password
    const passwordInput = screen.getByTestId("reset-password");
    fireEvent.change(passwordInput, {
      target: { value: mockFormData.password },
    });
    expect(passwordInput).toHaveValue(mockFormData.password);

    //the reset button is no longer disabled once all 4 digits and password are entered
    expect(resetPasswordButton).not.toBeDisabled();
    // mock the successful password reset
    await act(async () => {
      fireEvent.click(resetPasswordButton);
    });

    expect(resetPassword).toHaveBeenCalledWith(
      mockFormData.email,
      mockFormData.password,
      mockFormData.otp
    );
  });

  it("shows error when OTP is invalid", async () => {
    forgotPassword.mockResolvedValue({ status: statusCode.SUCCESS });
    resetPassword.mockResolvedValue({ status: statusCode.ERROR }); //mock the failed OTP check
    const mockFormData = {
      email: "test@example.com",
      password: "NewPassword123$",
      otp: "1234",
    };
    const invalidOTP = "0000";

    const emailInput = screen.getByTestId("reset-email");
    const sendOtpButton = screen.getByTestId("reset-send-otp-button");

    fireEvent.change(emailInput, { target: { value: mockFormData.email } });
    fireEvent.click(sendOtpButton);
    await waitFor(() => screen.getByTestId("otp-input-0"));

    //info & errorMessage is set to null at the start of sendOTP function to clear any previous messages
    expect(mockInfo).toHaveBeenCalledWith(null);
    expect(mockError).toHaveBeenCalledWith(null);

    //the OTP inputs will appear on screen and reset password button will be displayed but disabled
    const otpInputs = screen.getAllByTestId(/^otp-input-/);
    const resetPasswordButton = screen.getByTestId("reset-submit-otp-button");
    //the reset button is disabled until all 4 digits and password
    expect(resetPasswordButton).toBeDisabled();

    // once forget password is called, the timer starts
    expect(screen.getByTestId("timer-value")).toHaveTextContent(
      "Time remaining: 10:00"
    );

    //enter the invalid OTP
    otpInputs.forEach((input, index) =>
      fireEvent.change(input, { target: { value: invalidOTP[index] } })
    );

    //the reset button is no longer disabled once all 4 digits are entered
    expect(resetPasswordButton).not.toBeDisabled();

    await waitFor(() =>
      expect(screen.getByTestId("otp-value")).toHaveTextContent(
        "Entered value: " + invalidOTP
      )
    );

    //enter new password
    const passwordInput = screen.getByTestId("reset-password");
    fireEvent.change(passwordInput, {
      target: { value: mockFormData.password },
    });
    expect(passwordInput).toHaveValue(mockFormData.password);
    //click the reset password button
    await act(async () => {
      fireEvent.click(resetPasswordButton);
    });

    expect(resetPassword).toHaveBeenCalledWith(
      mockFormData.email,
      mockFormData.password,
      invalidOTP
    );

    //errorMessage is set to null at the start of handleResetPassword function to clear any previous error messages
    expect(mockError).toHaveBeenCalledWith(null);
    await waitFor(() =>
      expect(mockError).toHaveBeenCalledWith(errorReason.OTP_INVALID)
    );
  });
});
