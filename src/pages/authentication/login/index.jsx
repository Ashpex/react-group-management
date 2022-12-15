/* eslint-disable react-hooks/exhaustive-deps */
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Divider,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import config from "config";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import GoogleButton from "../common/googleButton";
import authApi from "../../../api/auth";
import * as notificationManager from "../../common/notificationManager";
import { isAxiosError } from "../../../utils/axiosErrorHandler";
import { AUTH_COOKIE } from "../../../utils/constants";

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const initEmail = searchParams.get("email");

  useEffect(() => {
    if (Cookies.get(AUTH_COOKIE)) {
      navigate("/");
    }
  }, [navigate]);

  const form = useForm({
    initialValues: {
      email: initEmail || "",
      password: "",
      rememberMe: false,
    },
  });

  const handleSubmitForm = async (values) => {
    try {
      const { data: response } = await authApi.signIn(
        values.email,
        values.password
      );

      notificationManager.showSuccess("", response.message);

      if (token) {
        navigate(`/group/invite?token=${token}`);
      } else {
        Cookies.set("token", response.data.token);
        Cookies.set("user", JSON.stringify(response.data.user));

        navigate("/");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        notificationManager.showFail("", error.response?.data.message);
      }
    }
  };

  const handleGoogleLogin = async () => {
    window.open(`${config.backendUrl}/auth/google`, "_self");
  };

  useEffect(() => {
    if (initEmail) {
      notificationManager.showSuccess(
        "",
        "Xác thực email thành công. Vui lòng đăng nhập để tiếp tục"
      );
    }
  }, []);

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
          color:
            theme.colorScheme === "dark"
              ? theme.colors.gray[1]
              : theme.colors.dark[4],
        })}
      >
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component={Link} to="/register">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmitForm)}>
          <TextInput
            label="Email"
            placeholder="Your email"
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...form.getInputProps("password")}
            required
            mt="md"
          />
          <Group position="apart" mt="lg">
            <Checkbox
              label="Remember me"
              sx={{ lineHeight: 1 }}
              {...form.getInputProps("rememberMe", { type: "checkbox" })}
            />
            <Anchor size="sm" component={Link} to="/forgot-password">
              Forgot password?
            </Anchor>
          </Group>

          <Button fullWidth mt="xl" type="submit">
            Log in
          </Button>

          <Divider label="Or continue with" labelPosition="center" my="lg" />

          <Stack>
            <GoogleButton radius="xl" onClick={handleGoogleLogin}>
              Google
            </GoogleButton>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
