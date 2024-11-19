import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./pages/Auth";
import Notes from "./pages/Notes";
import ErrorPage from "./pages/ErrorPage";
import { checkAuthLoader } from "./util/auth";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Auth />,
    },
    {
      path: "/notes",
      element: <Notes />,
      loader: checkAuthLoader,
      errorElement: <ErrorPage />,
    },
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

function App() {
  return (
    <div className="container">
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </div>
  );
}

export default App;