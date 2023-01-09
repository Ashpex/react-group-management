import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import React from "react";
import { RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import router from "./routes";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <MantineProvider>
        <NotificationsProvider position="top-right">
          <RouterProvider router={router} />
        </NotificationsProvider>
      </MantineProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
