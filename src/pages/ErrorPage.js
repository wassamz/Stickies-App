import { useRouteError, useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import Error from "../components/common/Error";

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  if (error.status === 401) {
    // Redirect to login after 2 seconds
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }

  return (
    <div>
      <Header onSearch={false} />
      <div></div>
      <div>
        {error && (
          <Error
            message={
              error.status === 401 ? (
                <p>Unauthorized access. Redirecting to login...</p>
              ) : (
                <p>
                  Something went wrong: {error.statusText || "Unknown error"}
                </p>
              )
            }
          />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ErrorPage;
