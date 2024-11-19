import { useState } from "react";
import PropTypes from "prop-types";
import "./styles/Form.css";

// Prop Types validation
LoginForm.propTypes = {
  submit: PropTypes.func.isRequired,
  toggleForm: PropTypes.func.isRequired,
};

function LoginForm({ submit, toggleForm }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(formData);
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
            />
          </div>

          <div className="button-container">
            <button
              data-testid="sign-up-user-button"
              type="button"
              className="alter-btn"
              onClick={() => {
                toggleForm(true);
              }}
            >
              Create Account
            </button>
            <button
              data-testid="login-user-button"
              type="submit"
              className="submit-btn"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
