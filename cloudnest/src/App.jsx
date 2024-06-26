import LandingPage from "./Components/LandingPage";
import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./Components/ErrorPage";
import AuthPage from "./Components/AuthPage/AuthPage";
import Main from "./Pages/Main/Main";
import Test from "./Test";
import Public from "./Pages/publicFolder/public";
import ProfilePage from "./Components/ProfilePage/ProfilePage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/feed",
    element: <Main />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/public/*",
    element: <Public />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage/>,
    errorElement: <ErrorPage />,
  },
]);

export default router;
