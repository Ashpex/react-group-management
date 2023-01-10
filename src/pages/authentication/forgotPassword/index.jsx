import {
  Anchor,
  Button,
  Container,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../../../api/auth";
import * as notificationManager from "../../common/notificationManager";
import { isAxiosError } from "../../../utils/axiosErrorHandler";
import { AUTH_COOKIE } from "../../../utils/constants";
import { useEffect } from "react";
import Cookies from "js-cookie";

const ForgotPassword = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get(AUTH_COOKIE)) {
      navigate("/");
    }
  }, [navigate]);

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (value) =>
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? null : "Invalid email",
    },
  });

  const handleSubmitForm = async (values) => {
    try {
      const response = await authApi.forgotPassword(values.email);

      if (response.status === 200) {
        notificationManager.showSuccess("Please check email to reset password");
        navigator("/login");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        notificationManager.showFail(
          "Register unsuccessfully",
          error.response?.data.message
        );
      }
    }
  };

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
          color: theme.colors.dark[4],
        })}
      >
        Welcome to Classroom Management!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account?{" "}
        <Anchor component={Link} size="sm" to="/login">
          Login
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmitForm)}>
          <TextInput
            label="Email"
            placeholder="Your email"
            {...form.getInputProps("email")}
            mt="md"
            required
          />
          <Button fullWidth mt="xl" type="submit">
            Reset password
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;
