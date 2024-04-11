import LandingPage from "./Components/LandingPage";
import {createBrowserRouter} from "react-router-dom";
import ErrorPage from "./Components/ErrorPage";
import AuthPage from "./Components/AuthPage/AuthPage";
import Feed from "./Components/Feed";
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
    element: <Feed/>,
    errorElement: <ErrorPage />,

  },


]);


export default router;


