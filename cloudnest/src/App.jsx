import LandingPage from "./Components/LandingPage";
import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./Components/ErrorPage";
import AuthPage from "./Components/AuthPage/AuthPage";
import Main from "./Pages/Main/Main";
import ProfililePagUploa from "./Components/MainPageComponents/ProfilePage/ProfilileUpload/FilPageUploa";
import Test from "./Test";
import Public from "./Pages/publicFolder/public";
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
  },
  {
    path: "/profile",
    element: <ProfilePage/>,
    errorElement: <ErrorPage />,
  },


]);

export default router;
