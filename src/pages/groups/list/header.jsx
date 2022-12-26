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
import { IconPlus, IconDoorEnter } from "@tabler/icons";
import { useState } from "react";

import groupApi from "../../../api/group";
import * as notificationManager from "../../common/notificationManager";
import { isAxiosError } from "../../../utils/axiosErrorHandler";
import { GROUP_FILTER_TYPE } from "../../../utils/constants";
import useUserInfo from "../../../hooks/useUserInfo";

export default function Header({ fetchData, groupFilter, setGroupFilter }) {
  const [openCreateGroupModal, setOpenCreateGroupModal] = useState(false);
  const [openJoinGroupModal, setOpenJoinGroupModal] = useState(false);
  const { userInfo } = useUserInfo();

  const createGroupForm = useForm({
    initialValues: {
      name: "",
      desc: "",
    },
  });

  const joinGroupForm = useForm({
    initialValues: {
      link: "",
    },
    validate: {
      link: (value) => {
        // const regex = new RegExp(
        //   "^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$"
        // );

        // use regex to test, accept http:// and https:// and localhost
        const regex = new RegExp(
          "^(https?:\\/\\/)?(localhost|((\\d{1,3}\\.){3}\\d{1,3}))(:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$"
        );

        if (!regex.test(value)) {
          return "Invalid link 1";
        }
        return null;

        // return new RegExp(
        //   "^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$"
        // ).test(value)
        //   ? null
        //   : "Invalid link 2";
      },
    },
  });

  const handleOpenCreateGroupModal = () => {
    createGroupForm.reset();
    setOpenCreateGroupModal(true);
  };

  const handleOpenJoinGroupModal = () => {
    createGroupForm.reset();
    setOpenJoinGroupModal(true);
  };

  const handleCloseCreateGroupModal = () => {
    createGroupForm.reset();
    setOpenCreateGroupModal(false);
  };

  const handleCloseJoinGroupModal = () => {
    createGroupForm.reset();
    setOpenJoinGroupModal(false);
  };

  const handleSubmitCreateGroupForm = async (values) => {
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
      setOpenCreateGroupModal();
      fetchData();
    } catch (error) {
      if (isAxiosError(error)) {
        notificationManager.showFail("", error.response?.data.message);
      }
    }
  };

  const handleSubmitJoinGroupForm = async (values) => {
    // try {
    //   const { data: response } = await groupApi.createGroup(
    //     values.name,
    //     values.desc,
    //     userInfo._id
    //   );

    //   notificationManager.showSuccess(
    //     "",
    //     `Create group ${response?.name} successfully`
    //   );
    //   setOpenCreateGroupModal();
    //   fetchData();
    // } catch (error) {
    //   if (isAxiosError(error)) {
    //     notificationManager.showFail("", error.response?.data.message);
    //   }
    // }

    console.log({ values });
  };

  return (
    <>
      <Modal
        title="Create a group"
        opened={openCreateGroupModal}
        onClose={handleCloseCreateGroupModal}
      >
        <form onSubmit={createGroupForm.onSubmit(handleSubmitCreateGroupForm)}>
          <TextInput
            label="Name"
            placeholder="Your group name"
            required
            {...createGroupForm.getInputProps("name")}
          />
          <Textarea
            label="Description"
            placeholder="Your group description"
            my="md"
            {...createGroupForm.getInputProps("desc")}
          />
          <Group position="center">
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Modal>

      <Modal
        title="Join group by link"
        opened={openJoinGroupModal}
        onClose={handleCloseJoinGroupModal}
      >
        <form onSubmit={joinGroupForm.onSubmit(handleSubmitJoinGroupForm)}>
          <TextInput
            label="Link group"
            required
            {...joinGroupForm.getInputProps("link")}
          />
          <Group position="center">
            <Button type="submit">Join</Button>
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
            <Button onClick={handleOpenCreateGroupModal}>
              <IconPlus />
            </Button>
          </Tooltip>
          <Tooltip label="Join group">
            <Button onClick={handleOpenJoinGroupModal}>
              <IconDoorEnter />
            </Button>
          </Tooltip>
        </Group>
      </Group>
    </>
  );
}
