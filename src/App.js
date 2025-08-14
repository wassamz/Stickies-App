import { createBrowserRouter, RouterProvider } from "react-router";
import { UserProvider } from "./context/UserContext";
import Auth from "./pages/Auth";
import ErrorPage from "./pages/ErrorPage";
import Notes from "./pages/Notes";
import { checkAuthLoader } from "./util/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/notes",
    element: <Notes />,
    loader: checkAuthLoader,
    errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
