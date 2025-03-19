import PropTypes from "prop-types";
import { useState } from "react";
import { login } from "../services/Api";
import { authFormType, showForm, statusCode } from "../util/auth";
import {
  errorReason,
  validEmail,
  validPassword,
} from "../util/inputValidation";
import "./styles/Form.css";

LoginForm.propTypes = {
  submit: PropTypes.func.isRequired,
  toggleForm: PropTypes.func.isRequired,
  errorMessage: PropTypes.func.isRequired,
  infoMessage: PropTypes.func.isRequired,
};

function LoginForm({ submit, toggleForm, errorMessage, infoMessage }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleShowForm = showForm(setFormData, toggleForm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validEmail(formData.email)) {
      errorMessage(errorReason.EMAIL_INVALID);
      return;
    }
    if (!validPassword(formData.password)) {
      errorMessage(errorReason.PASSWORD_INVALID);
      return;
    }

    const result = await login(formData);

    if (result.status === statusCode.SUCCESS) {
      infoMessage(null);
      errorMessage(null);
      submit(formData);
    } else {
      infoMessage(null);
      errorMessage(errorReason.LOGIN_FAILED);
    }
  };

  return (
    <div className="wrapper">
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2 className="auth-title">My Stickies Login</h2>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              data-testid="login-email"
              type="text"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              data-testid="login-password"
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          <div className="button-container">
            <button
              data-testid="signup-user-form-button"
              type="button"
              className="alter-btn"
              onClick={() => handleShowForm(authFormType.SIGNUP)}
            >
              Sign Up
            </button>
            <button
              data-testid="login-user-button"
              type="submit"
              className="submit-btn"
            >
              Login
            </button>
          </div>
          <div className="wrapper">
            <button
              className="text-button"
              onClick={() => handleShowForm(authFormType.RESET)}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
