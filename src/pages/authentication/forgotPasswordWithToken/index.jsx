import { PasswordInput, Paper, Title, Container, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useNavigate, useParams } from "react-router-dom";

import authApi from "../../../api/auth";
import * as notificationManager from "../../common/notificationManager";

const ForgotPasswordWithToken = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const form = useForm({
    initialValues: {
      password: "",
      rememberMe: false,
    },
  });

  const handleSubmitForm = async (values) => {
    try {
      await authApi.resetPassword(values.password, token);

      notificationManager.showSuccess("", "Đổi mật khẩu thành công");
      navigate("/");
    } catch (error) {
      notificationManager.showFail("", error.response?.data.message);
    }
  };

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

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmitForm)}>
          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...form.getInputProps("password")}
            required
            mt="md"
          />

          <Button fullWidth mt="xl" type="submit">
            Reset Password
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordWithToken;
