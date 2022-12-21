import {
  Button,
  Group,
  Title,
  Tooltip,
  Modal,
  TextInput,
  Textarea,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus } from "@tabler/icons";
import { useState } from "react";

import groupApi from "../../../api/group";
import * as notificationManager from "../../common/notificationManager";
import { isAxiosError } from "../../../utils/axiosErrorHandler";
import { GROUP_FILTER_TYPE } from "../../../utils/constants";
import useUserInfo from "../../../hooks/useUserInfo";

export default function Header({ fetchData, groupFilter, setGroupFilter }) {
  const [opened, setOpened] = useState(false);
  const { userInfo } = useUserInfo();

  const form = useForm({
    initialValues: {
      name: "",
      desc: "",
    },
  });

  const handleOpenModal = () => {
    form.reset();
    setOpened(true);
  };

  const handleCloseModal = () => {
    form.reset();
    setOpened(false);
  };

  const handleSubmitForm = async (values) => {
    try {
      const { data: response } = await groupApi.createGroup(
        values.name,
        values.desc,
        userInfo._id
      );

      notificationManager.showSuccess(
        "",
        `Create group ${response?.name} successfully`
      );
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
      <Modal title="Create a group" opened={opened} onClose={handleCloseModal}>
        <form onSubmit={form.onSubmit(handleSubmitForm)}>
          <TextInput
            label="Name"
            placeholder="Your group name"
            required
            {...form.getInputProps("name")}
          />
          <Textarea
            label="Description"
            placeholder="Your group description"
            my="md"
            {...form.getInputProps("desc")}
          />
          <Group position="center">
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
          Groups
        </Title>
        <Group>
          <Select
            data={[
              GROUP_FILTER_TYPE.ALL,
              GROUP_FILTER_TYPE.GROUP_YOU_CREATED,
              GROUP_FILTER_TYPE.GROUP_YOU_JOINED,
            ]}
            value={groupFilter}
            onChange={setGroupFilter}
          />
          <Tooltip label="Create a group">
            <Button onClick={handleOpenModal}>
              <IconPlus />
            </Button>
          </Tooltip>
        </Group>
      </Group>
    </>
  );
}
