import { useRouteError, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import Error from "../components/common/Error";
import { getToken } from "../util/auth.js";
import "./styles/ErrorPage.css";

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const location = useLocation();
  
  let errorMessage = "Something went wrong";

  if (error?.status === 404 || !error) {
    errorMessage = `Page not found: ${location.pathname}`;
  } else if (error?.status === 401) {
    errorMessage = "Unauthorized access";
    setTimeout(() => {
      navigate("/");
    }, 2000);
  } else if (error?.statusText) {
    errorMessage = error.statusText;
  }

  return (
    <div className="error-page">
      <Header onSearch={() => {}} userData={{}} />
      <div className="error-content">
        <span className="error-title">Ooops!</span>
        <p>An error has occurred. Let's get back to work.</p>
        {getToken() ? (
          <button onClick={() => navigate("/notes")}>Notes</button>
        ) : (
          <button onClick={() => navigate("/")}>Login</button>
        )}

        <br />
        <br />
        <Error message={<p>{errorMessage}</p>} />
      </div>
      <Footer />
    </div>
  );
}

export default ErrorPage;
