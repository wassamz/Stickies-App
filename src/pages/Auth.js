import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Error from "../components/common/Error";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Info from "../components/common/Info";
import LoginForm from "../components/LoginForm";
import ResetForm from "../components/ResetForm";
import SignUpForm from "../components/SignUpForm";
import { useUserProfile } from "../context/UserContext";
import { authFormType } from "../util/auth";
import "./styles/Auth.css";

function Auth() {
  let navigate = useNavigate();
  const { setUser } = useUserProfile();
  const [activeForm, setActiveForm] = useState(authFormType.LOGIN); //default to Login Form
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const errorRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
      errorRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    } else if (info && infoRef.current) {
      infoRef.current.focus();
      infoRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [error, info]);

  // Toggle between showing Login Form, Sign Up Form, and Reset Form
  function handleToggle(formData) {
    if (formData.toggleForm !== activeForm) {
      setActiveForm(formData.toggleForm);
      setError(null);
      setInfo(null);
    }
  }

  async function handleSubmit(data) {
    switch (activeForm) {
      case authFormType.LOGIN:
        // show Notes page after successful login
        goToNotes(data);
        break;
      case authFormType.SIGNUP:
        // show Notes page after successful SignUp
        goToNotes(data);
        break;
      case authFormType.RESET:
        //show Login Form after successful password reset
        setActiveForm(authFormType.LOGIN);
        setInfo(
          "Password Reset Successful. Please Login with your new password."
        );
        setError(null);
        break;
      default:
        break;
    }
  }

  function goToNotes(data) {
    // Clear messages on successful login/signup/reset
    setError(null);
    setInfo(null);
    data.password = ""; // Clear the password
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data); // Save the user data in context
    navigate("/notes", {
      replace: true,
    });
  }

  return (
    <div className="auth-page-container">
      <Header onSearch={() => {}} userData={{}} />

      <div className="auth-content">
        <div className="auth-messages">
          {error && (
            <Error
              ref={errorRef}
              message={error}
              tabIndex="-1"
              aria-live="assertive"
            />
          )}
          {info && (
            <Info
              ref={infoRef}
              message={info}
              tabIndex="-1"
              aria-live="polite"
            />
          )}
        </div>
        <div className="auth-forms-container">
          {activeForm === authFormType.SIGNUP && (
            <SignUpForm
              submit={handleSubmit}
              toggleForm={handleToggle}
              errorMessage={setError}
              infoMessage={setInfo}
            />
          )}
          {activeForm === authFormType.LOGIN && (
            <LoginForm
              submit={handleSubmit}
              toggleForm={handleToggle}
              errorMessage={setError}
              infoMessage={setInfo}
            />
          )}
          {activeForm === authFormType.RESET && (
            <ResetForm
              submit={handleSubmit}
              toggleForm={handleToggle}
              errorMessage={setError}
              infoMessage={setInfo}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Auth;
