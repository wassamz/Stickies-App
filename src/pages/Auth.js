import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Error from "../components/common/Error";
import Footer from "../components/common/Footer";
import Header from "../components/common/Header";
import Info from "../components/common/Info";
import LoginForm from "../components/LoginForm";
import ResetForm from "../components/ResetForm";
import SignUpForm from "../components/SignUpForm";
import { useUserProfile } from "../context/UserContext";
import { login, signUp } from "../services/Api";
import { authFormType, statusCode } from "../util/auth";

function Auth() {
  let navigate = useNavigate();
  const { setUser } = useUserProfile();
  const [activeForm, setActiveForm] = useState(authFormType.LOGIN); //default to Login Form
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  // Toggle between showing Login Form, Sign Up Form, and Reset Form
  function handleToggle(formData) {
    if (formData.toggleForm !== activeForm) {
      setActiveForm(formData.toggleForm);
      setError(null);
      setInfo(null);
    }
  }

  async function handleSubmit(data) {
    let result;
    if (activeForm === authFormType.SIGNUP) {
      result = await signUp(data);
    } else if (activeForm === authFormType.RESET) {
      setActiveForm(authFormType.LOGIN);
      setInfo(
        "Password Reset Successful. Please Login with your new password."
      );
      setError(null);
      return;
    } else {
      result = await login(data);
    }

    if (result.status !== statusCode.SUCCESS) {
      setError(result.message);
      setInfo(null);
    } else {
      setError(null); // Clear error on successful login/signup/reset
      setInfo(result.message);
      data.password = ""; // Clear the password
      setUser(data); // Save the user data in context

      navigate("/notes", {
        replace: true,
      });
    }
  }

  return (
    <div>
      <Header onSearch={() => {}} userData={{}} />

      <div>
        <div>
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

        {error && <Error message={error} />}
        {info && <Info message={info} />}
      </div>
      <Footer />
    </div>
  );
}

export default Auth;
