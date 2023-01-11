import { AppShell } from "@mantine/core";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "./Header";

import { AUTH_COOKIE } from "../utils/constants";

export default function Layout({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get(AUTH_COOKIE)) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <AppShell
      header={<Header />}
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
}
