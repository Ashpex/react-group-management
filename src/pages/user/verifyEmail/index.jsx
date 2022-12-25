/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Code, Image, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "@mantine/core";

import ImageVerifyEmail from "../../../assets/image-verify-email.svg";
import ImageChecked from "../../../assets/checked.svg";
import authApi from "../../../api/auth";
import * as notificationManager from "../../common/notificationManager";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const verifyEmail = async () => {
    setLoading(true);
    try {
      const res = await authApi.verifyEmail(token);
      setError(null);
      notificationManager.showSuccess("", res.data.message);
      setUser(res.data.user);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setError(error);
      notificationManager.showFail("", error.response?.data?.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    verifyEmail();
  }, []);

  if (error)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Title>Something went wrong</Title>
      </Box>
    );

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Loader size="xl" variant="dots" />
      </Box>
    );

  return (
    <Box
      sx={{
        background: "#EAF0F3",
        width: "calc(100% + 32px)",
        height: "calc(100% + 32px)",
        marginLeft: "-16px",
        marginTop: "-16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Image
          radius="md"
          src={ImageVerifyEmail}
          alt="image"
          height={135}
          width={135}
        />
        <Title
          sx={{
            fontSize: "52px",
            fontWeight: "400",
            textAlign: "center",
          }}
        >
          Hi{" "}
          <Code
            sx={{
              display: "inline",
              fontSize: "52px",
              fontWeight: "700",
            }}
          >
            {user?.name}
          </Code>
          , your email is verified
        </Title>
      </Box>

      <Box
        sx={{
          width: "50%",
          background: "#FFFFFF",
          borderRadius: "6px",
          marginTop: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          gap: "20px",
        }}
      >
        <Image src={ImageChecked} alt="image" width={128} height={128} />
        <Title
          sx={{
            color: "#5E5E5E",
            fontSize: "18px",
            fontWeight: "400",
          }}
        >
          Your email has been verified. You can now login to your account.
        </Title>

        <Button
          sx={{
            background: "linear-gradient(0deg, #3490EC, #3490EC), #FF743C",
            borderRadius: "40px",
            width: "20%",
            marginTop: "20px",
          }}
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
}
