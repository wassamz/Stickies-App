import { useState } from "react";
import PropTypes from "prop-types";
import "./styles/Form.css";

// Prop Types validation
SignUpForm.propTypes = {
  submit: PropTypes.func.isRequired,
  toggleForm: PropTypes.func.isRequired,
};

function SignUpForm({ submit, toggleForm }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submit(formData);
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
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
              onClick={() => {
                toggleForm(true);
              }}
            >
              Login
            </button>
            <button
              data-testid="sign-up-user-button"
              type="submit"
              className="submit-btn"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpForm;
