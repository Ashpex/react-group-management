/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Button, Code, Image, Loader, Title } from "@mantine/core";

import ImageVerifyEmail from "../../../assets/image-verify-email.svg";
import ImageChecked from "../../../assets/checked.svg";
import groupApi from "../../../api/group";
import * as notificationManager from "../../common/notificationManager";

export default function JoinGroup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const groupId = searchParams.get("groupId");
  const email = searchParams.get("email");
  const role = searchParams.get("role");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);

  const joinGroup = async (groupId, email, userRole) => {
    setLoading(true);
    try {
      const res = await groupApi.joinGroup(groupId, email, userRole);
      setUser(res.data.newMember);
      setGroup(res.data.group);
      notificationManager.showSuccess("", "Join group successfully");
      setError(null);
    } catch (error) {
      setError(error.response?.data.message);
      notificationManager.showFail("", error.response?.data?.message);
      setUser(null);

      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (groupId && email && role) {
      joinGroup(groupId, email, role);
    }
  }, [groupId, email, role]);

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
          , you have joined{" "}
          <Code
            sx={{
              display: "inline",
              fontSize: "52px",
              fontWeight: "700",
            }}
          >
            {group?.name}
          </Code>
          successfully
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
          You have joined the group successfully. Please access your group via
          the link below
        </Title>

        <Button
          sx={{
            background: "linear-gradient(0deg, #3490EC, #3490EC), #FF743C",
            borderRadius: "40px",
            width: "20%",
            marginTop: "20px",
          }}
          onClick={() => {
            navigate(`/group/${groupId}`);
          }}
        >
          Access Group
        </Button>
      </Box>
    </Box>
  );
}
