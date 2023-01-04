import { Group, Title, Button, Tooltip, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus } from "@tabler/icons";
import { useState } from "react";

import presentationApi from "../../../api/presentation";
import * as notificationManager from "../../common/notificationManager";
import { isAxiosError } from "../../../utils/axiosErrorHandler";
import useUserInfo from "../../../hooks/useUserInfo";

export default function PresentationListHeader({ fetchData }) {
  const [opened, setOpened] = useState(false);
  const { userInfo } = useUserInfo();

  const form = useForm({ initialValues: { name: "", description: "" } });

  const handleOpenModal = () => {
    setOpened(true);
  };

  const handleCloseModal = () => {
    form.reset();
    setOpened(false);
  };

  const handleSubmitForm = async (values) => {
    console.log({ values });
    try {
      await presentationApi.createPresentation(
        values.name,
        values.description,
        userInfo._id
      );

      notificationManager.showSuccess("", "Create presentation successfully");
      handleCloseModal();
      fetchData();
    } catch (error) {
      if (isAxiosError(error)) {
        notificationManager.showFail("", error.response?.data.message);
      }
    }
  };

  return (
    <>
      <Modal
        title="Create new presentation"
        opened={opened}
        onClose={handleCloseModal}
      >
        <form onSubmit={form.onSubmit(handleSubmitForm)}>
          <TextInput
            label="Presentation name"
            placeholder="Your presentation name"
            required
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Presentation description"
            placeholder="Your presentation description"
            {...form.getInputProps("description")}
            mt="md"
          />
          <Group position="right" mt="md">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Modal>
      <Group my="lg" position="apart">
        <Title
          order={3}
          sx={(theme) => ({
            color:
              theme.colorScheme === "dark"
                ? theme.colors.gray[1]
                : theme.colors.dark[4],
          })}
        >
          My presentations
        </Title>
        <Group>
          <Tooltip label="Create a presentation">
            <Button onClick={handleOpenModal}>
              <IconPlus />
            </Button>
          </Tooltip>
        </Group>
      </Group>
    </>
  );
}
