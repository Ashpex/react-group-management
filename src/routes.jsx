import { useEffect } from "react";
import { createBrowserRouter, Outlet, useNavigate } from "react-router-dom";

import UnauthorizedLayout from "./layout/UnauthorizedLayout";
import LoginPage from "./pages/authentication/login";
import Logout from "./pages/authentication/logout";
import RegisterPage from "./pages/authentication/register";
import NotFoundPage from "./pages/errorPage/notFound";
import GroupDetail from "./pages/groups/details";
import JoinGroup from "./pages/groups/join";
import GroupsPage from "./pages/groups/list";
import Home from "./pages/home";
import PresentationList from "./pages/presentation/list";
import ChangePasswordForm from "./pages/user/changePassword";

import ProfileEditor from "./pages/user/editProfile";

import { APP_LOGOUT_EVENT } from "./utils/constants";

import Layout from "./layout/Layout";
import UserProfile from "./pages/user/userProfile";
import VerifyEmail from "./pages/user/verifyEmail";
import PresentationDetail from "./pages/presentation/detail";
import SlideQuestion from "./pages/presentation/slides/question";

export const AUTHORIZED_ROUTES = [
  {
    index: true,
    name: "Home",
    element: <Home />,
    errorElement: <NotFoundPage />,
  },
  {
    path: "/logout",
    name: "Logout",
    element: <Logout />,
  },
  {
    path: "/user/profile",
    name: "Profile",
    element: <UserProfile />,
  },
  {
    path: "/user/change-password",
    name: "Profile",
    element: <ChangePasswordForm />,
  },
  {
    path: "/user/edit-profile",
    name: "Profile",
    element: <ProfileEditor />,
  },
  {
    path: "/groups",
    name: "Groups",
    element: <GroupsPage />,
  },
  {
    path: "/group/:groupId",
    name: "Group",
    element: <GroupDetail />,
  },
  {
    path: "/presentations",
    name: "Presentations",
    element: <PresentationList />,
  },
  {
    path: "/slides/:slideId",
    name: "Join Present",
    element: <SlideQuestion />,
  },
  {
    path: "/presentations/:presentationId",
    name: "Detail Presentation",
    element: <PresentationDetail />,
  },
];

const LayoutRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener(APP_LOGOUT_EVENT, () => {
      navigate("/logout");
    });
  });

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const UNAUTHORIZED_ROUTES = [
  {
    path: "/register",
    name: "Register",
    element: <RegisterPage />,
  },
  {
    path: "/login",
    name: "Login",
    element: <LoginPage />,
  },
  {
    path: "/group/join",
    name: "Join",
    element: <JoinGroup />,
  },
  {
    path: "/user/verify-email/:token",
    name: "Profile",
    element: <VerifyEmail />,
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutRoute />,
    errorElement: <NotFoundPage />,
    children: AUTHORIZED_ROUTES,
  },
  ...UNAUTHORIZED_ROUTES.map(({ path, name, element }) => ({
    path,
    name,
    element: <UnauthorizedLayout>{element}</UnauthorizedLayout>,
  })),
]);

export default router;
