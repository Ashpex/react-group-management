import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import React from "react";
import { RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import router from "./routes";

import useColorScheme from "./hooks/useColorScheme";

const App = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider theme={{ colorScheme }}>
          <NotificationsProvider position="top-right">
            <RouterProvider router={router} />
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
