import { useState} from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";
import Error from "../components/common/Error";
import Info from "../components/common/Info";

import { login, signUp } from "../services/Api";

function Auth() {
  let navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);

  //toggle between showing Login Form and Sign Up Form
  function handleToggle() {
    setIsSignUp(!isSignUp);
    setError(null);
  }

  async function handleSubmit(data) {
    //based on isSignUp state, call Sign Up or Login
    const result = isSignUp ? await signUp(data) : await login(data);

    if (result.status !== "SUCCESS") {
      setError(result.message);
      setInfo(null);
    } else {
      setError(null); // Clear error on successful login/signup
      setInfo(result.message);

      navigate("/notes", {
        replace: true,
        state: { userData: data }, // Pass user data to Notes Page
      });
    }
  }

  return (
    <div>
      <Header onSearch={() => {}} userData={{}} />

      <div>
        <div>
          {isSignUp ? (
            <SignUpForm submit={handleSubmit} toggleForm={handleToggle} />
          ) : (
            <LoginForm submit={handleSubmit} toggleForm={handleToggle} />
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
