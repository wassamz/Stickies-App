import { Box } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import config from "../config/config.js";
import { forgotPassword, resetPassword } from "../services/Api";
import { authFormType, showForm, statusCode } from "../util/auth";
import {
  errorReason,
  validEmail,
  validPassword,
} from "../util/inputValidation";
import Otp from "./OTP";
import "./styles/Form.css";

// Prop Types validation
ResetForm.propTypes = {
  submit: PropTypes.func.isRequired,
  toggleForm: PropTypes.func.isRequired,
  errorMessage: PropTypes.func.isRequired,
  infoMessage: PropTypes.func.isRequired,
};

function ResetForm({ submit, toggleForm, errorMessage, infoMessage }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSendCount, setOtpSendCount] = useState(0);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    if (otpSendCount > 0 && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
    if (timer === 0) {
      errorMessage(errorReason.OTP_EXPIRED);
      infoMessage(null);
    }
  }, [errorMessage, infoMessage, otpSendCount, timer]);

  const handleShowForm = showForm(setFormData, toggleForm);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleOTPChange = (newOtp) => {
    setOtp(newOtp);
  };

  const sendOTP = async () => {
    errorMessage(null);
    infoMessage(null);

    if (!validEmail(formData.email)) {
      errorMessage(errorReason.EMAIL_INVALID);
      return;
    }
    if (otpSendCount > config.otpRetryAttempts) {
      errorMessage("Password Reset unsuccessful. Please try again later.");
      return;
    }
    //call api to send OTP if email is valid
    const result = await forgotPassword(formData.email);
    if (result.status === statusCode.ERROR) {
      infoMessage(null);
      errorMessage(result.message);
      setOtpSendCount(0);
      return;
    } else {
      infoMessage(
        "If your email is assigned to an account, a 4 digit One Time Password has been " +
          (otpSendCount > 0 ? "re" : "") +
          "sent to your email address."
      );
    }
    setOtpSendCount(otpSendCount + 1);
  };

  const handleResetPassword = async () => {
    infoMessage(null);
    errorMessage(null);

    if (!validEmail(formData.email)) {
      errorMessage(errorReason.EMAIL_INVALID);
      return;
    }
    if (!validPassword(formData.password)) {
      errorMessage(errorReason.PASSWORD_INVALID);
      return;
    }
    if (!otp || otp.length !== 4) {
      errorMessage(errorReason.OTP_INVALID);
      return;
    }

    //send API call to reset password using otp, email, and new password
    let result = null;
    if (otpSendCount <= config.otpRetryAttempts) {
      result = await resetPassword(formData.email, formData.password, otp);
      if (result.status === statusCode.SUCCESS) submit(formData);
      else errorMessage(errorReason.OTP_INVALID);
    } else {
      errorMessage("Password Reset unsuccessful. Please try again later.");
    }
    setOtpSendCount(otpSendCount + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // If OTP is being shown and is complete, trigger signup
    if (otpSendCount > 0 && otp.length === config.otpLength) {
      handleResetPassword();
    } else {
      // Otherwise trigger OTP send
      sendOTP();
    }
  };
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="wrapper">
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2 className="auth-title">
            My Stickies
            <br />
            Password Reset
          </h2>
          <div className="form-group">
            <p>Reset your password using your email.</p>
          </div>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              data-testid="reset-email"
              type="text"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>
          {otpSendCount > 0 && (
            <div className="form-group">
              <label htmlFor="otp">Enter 4 Digit Code</label>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Otp
                  separator={<span>-</span>}
                  value={otp}
                  onChange={handleOTPChange}
                  length={4}
                />
                <div className="otp-info-container">
                  <span data-testid="otp-value">Entered value: {otp}</span>
                  <span data-testid="timer-value">
                    Time remaining: {formatTime(timer)}
                  </span>
                </div>
              </Box>
            </div>
          )}
          {otpSendCount > 0 && (
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                data-testid="reset-password"
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          )}

          <div className="button-container">
            <button
              data-testid="reset-login-user-button"
              type="button"
              className="alter-btn"
              onClick={() => handleShowForm(authFormType.LOGIN)}
            >
              Back
            </button>
            <button
              data-testid="reset-send-otp-button"
              type="button"
              className="submit-btn"
              onClick={sendOTP}
              disabled={
                !validEmail(formData.email) ||
                timer <= 0 ||
                otpSendCount > config.otpRetryAttempts
              }
            >
              {otpSendCount > 0 ? "Resend Code" : "Send Code"}
            </button>
            {otpSendCount > 0 && (
              <button
                data-testid="reset-submit-otp-button"
                type="submit"
                className="submit-btn"
                disabled={
                  otp.length !== 4 ||
                  timer <= 0 ||
                  otpSendCount > config.otpRetryAttempts
                }
                onClick={handleResetPassword}
              >
                Reset Password
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetForm;
