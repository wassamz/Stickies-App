import PropTypes from "prop-types";
import { useState } from "react";
import { authFormType, showForm } from "../util/auth";
import {
  errorReason,
  validEmail,
  validPassword,
} from "../util/inputValidation";
import "./styles/Form.css";

SignUpForm.propTypes = {
  submit: PropTypes.func.isRequired,
  toggleForm: PropTypes.func.isRequired,
  errorMessage: PropTypes.func.isRequired,
};

function SignUpForm({ submit, toggleForm, errorMessage }) {
  const [formData, setFormData] = useState({
    name: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validEmail(formData.email)) {
      errorMessage(errorReason.EMAIL_INVALID);
      return;
    }
    if (!validPassword(formData.password)) {
      errorMessage(errorReason.PASSWORD_INVALID);
      return;
    }
    submit(formData);
  };

  return (
    <div className="wrapper">
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2 className="auth-title">My Stickies Sign Up</h2>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              data-testid="sign-up-name"
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
            <label htmlFor="email">E-mail</label>
            <input
              data-testid="sign-up-email"
              type="text"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              data-testid="sign-up-password"
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="button-container">
            <button
              data-testid="login-user-button"
              type="button"
              className="alter-btn"
              onClick={() => handleShowForm(authFormType.LOGIN)}
            >
              Back to Login
            </button>
            <button
              data-testid="sign-up-user-button"
              type="submit"
              className="submit-btn"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
