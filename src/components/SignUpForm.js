import { Box } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import config from "../config/config.js";
import { checkEmail, signUp } from "../services/Api";
import { authFormType, showForm, statusCode } from "../util/auth";
import {
  errorReason,
  validEmail,
  validName,
  validPassword,
} from "../util/inputValidation";
import Otp from "./OTP";
import "./styles/Form.css";

// Prop Types validation
SignUpForm.propTypes = {
  submit: PropTypes.func.isRequired,
  toggleForm: PropTypes.func.isRequired,
  errorMessage: PropTypes.func.isRequired,
  infoMessage: PropTypes.func.isRequired,
};

function SignUpForm({ submit, toggleForm, errorMessage, infoMessage }) {
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
      setOtpSendCount(0);
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
      errorMessage("Sign Up unsuccessful. Please try again later.");
      return;
    }
    const result = await checkEmail(formData.email);
    if (result.status === statusCode.ERROR) {
      infoMessage(null);
      errorMessage(result.message);
      setOtpSendCount(0);
      return;
    } else if (result.status === statusCode.SUCCESS) {
      infoMessage(
        "To validate your email, a 4 digit One Time Password has been " +
          (otpSendCount > 0 ? "re" : "") +
          "sent to your email address."
      );
      errorMessage(null);
    }
    setOtpSendCount(otpSendCount + 1);
  };

  const handleSignUp = async () => {
    infoMessage(null);
    errorMessage(null);

    if (!validName(formData.name)) {
      errorMessage(errorReason.NAME_INVALID);
      return;
    }
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
      result = await signUp(
        formData.name,
        formData.email,
        formData.password,
        otp
      );
      if (result?.status === statusCode.SUCCESS) submit(formData);
      else {
        errorMessage(
          otpSendCount > config.otpRetryAttempts
            ? "Sign Up unsuccessful. Please try again later."
            : errorReason.OTP_INVALID
        );
      }
    } else {
      errorMessage("Sign Up unsuccessful. Please try again later.");
    }

    setOtpSendCount(otpSendCount + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // If OTP is being shown and is complete, trigger signup
    if (otpSendCount > 0 && otp.length === config.otpLength) {
      handleSignUp();
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
          <h2 className="auth-title">My Stickies Sign Up</h2>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              data-testid="signup-email"
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
              <label htmlFor="otp">Enter {config.otpLength} Digit Code</label>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Otp
                  separator={<span>-</span>}
                  value={otp}
                  onChange={handleOTPChange}
                  length={config.otpLength}
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
            <div>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  data-testid="signup-name"
                  type="text"
                  id="name"
                  name="name"
                  minLength="2"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  data-testid="signup-password"
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}

          <div className="button-container">
            <button
              data-testid="login-user-button"
              type="button"
              className="alter-btn"
              onClick={() => {
                setOtpSendCount(0);
                handleShowForm(authFormType.LOGIN);
              }}
            >
              Back to Login
            </button>
            <button
              data-testid="signup-send-otp-button"
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
                data-testid="signup-submit-otp-button"
                type="submit"
                className="submit-btn"
                disabled={
                  otp.length !== config.otpLength ||
                  timer <= 0 ||
                  otpSendCount > config.otpRetryAttempts
                }
                onClick={handleSignUp}
              >
                Sign Up
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
