/* eslint-disable react-hooks/exhaustive-deps */
import { PasswordInput, Paper, Container, Button, Flex } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";

import { Link, useNavigate } from "react-router-dom";

import userApi from "../../../api/user";
import * as notificationManager from "../../common/notificationManager";
import { isAxiosError } from "../../../utils/axiosErrorHandler";
import useUserInfo from "../../../hooks/useUserInfo";

export default function ChangePasswordForm() {
  const navigate = useNavigate();
  const { userInfo } = useUserInfo();
  const form = useForm({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      retype: "",
    },
    validate: {
      newPassword: (value, values) =>
        value === values.oldPassword
          ? "New password cannot be the same as old password"
          : null,
      retype: (value, values) =>
        value !== values.newPassword
          ? "Retype must be the same as new password"
          : null,
    },
  });

  const checkUser = async () => {
    const { data: res } = await userApi.getUserInfo(userInfo._id);

    if (res.isLoggedInWithGoogle) {
      navigate("/user/profile");
      notificationManager.showFail(
        "",
        "User logged in with Google account cannot change their password"
      );
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const handleSubmitForm = async (values) => {
    try {
      await userApi.changePassword(
        userInfo._id,
        values.oldPassword,
        values.newPassword
      );

      notificationManager.showSuccess("", "Password changed successfully");
      navigate("/user/profile");
    } catch (error) {
      if (isAxiosError(error)) {
        notificationManager.showFail("", error.response?.data.message);
      }
    }
  };

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmitForm)}>
          <PasswordInput
            label="Old Password"
            placeholder="Your old password"
            {...form.getInputProps("oldPassword")}
            required
            mt="md"
          />
          <PasswordInput
            label="New Password"
            placeholder="Your new password"
            {...form.getInputProps("newPassword")}
            required
            mt="md"
          />
          <PasswordInput
            label="Retype"
            placeholder="Your new password again"
            {...form.getInputProps("retype")}
            required
            mt="md"
          />
          <Flex
            pt="lg"
            justify="center"
            align="center"
            gap="sm"
            sx={() => ({
              "@media (max-width: 360px)": { flexDirection: "column" },
            })}
          >
            <Button w={160} type="submit">
              Submit
            </Button>
            <Link to="/user/profile">
              <Button w={160} color="red">
                Cancel
              </Button>
            </Link>
          </Flex>
        </form>
      </Paper>
    </Container>
  );
}
