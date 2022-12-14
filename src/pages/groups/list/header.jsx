import {
  Button,
  Group,
  Title,
  Tooltip,
  Modal,
  TextInput,
  Textarea,
  Select,
  createStyles,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus, IconDoorEnter } from "@tabler/icons";
import { useState } from "react";

import groupApi from "../../../api/group";
import * as notificationManager from "../../common/notificationManager";
import { GROUP_FILTER_TYPE, USER_ROLE } from "../../../utils/constants";
import useUserInfo from "../../../hooks/useUserInfo";

const useStyles = createStyles((theme) => ({
  modal: {
    "& .mantine-Modal-inner": {
      display: "flex",
      alignItems: "center",
    },

    "& .mantine-Modal-modal": {
      width: "30%",
    },
  },
}));

export default function Header({ fetchData, groupFilter, setGroupFilter }) {
  const [openCreateGroupModal, setOpenCreateGroupModal] = useState(false);
  const [openJoinGroupModal, setOpenJoinGroupModal] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const { userInfo } = useUserInfo();
  const { classes } = useStyles();

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
        const regex = new RegExp(
          "^(https?:\\/\\/)|(localhost|((\\d{1,3}\\.){3}\\d{1,3}))(:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$"
        );

        if (!regex.test(value)) {
          return "Invalid link 1";
        }
        return null;
      },
    },
  });

  const handleOpenCreateGroupModal = () => {
    createGroupForm.reset();
    setOpenCreateGroupModal(true);
  };

  const handleOpenJoinGroupModal = () => {
    joinGroupForm.reset();
    setOpenJoinGroupModal(true);
  };

  const handleCloseCreateGroupModal = () => {
    createGroupForm.reset();
    setOpenCreateGroupModal(false);
  };

  const handleCloseJoinGroupModal = () => {
    joinGroupForm.reset();
    setOpenJoinGroupModal(false);
  };

  const handleSubmitCreateGroupForm = async (values) => {
    try {
      setButtonLoading(true);
      const { data: response } = await groupApi.createGroup(
        values.name,
        values.desc,
        userInfo._id
      );

      notificationManager.showSuccess(
        "",
        `Create group ${response?.name} successfully`
      );
      fetchData();
    } catch (error) {
      notificationManager.showFail("", error.response?.data.message);
    } finally {
      setButtonLoading(false);
      handleCloseCreateGroupModal();
    }
  };

  const handleSubmitJoinGroupForm = async (values) => {
    try {
      setButtonLoading(true);
      const groupId = values.link.split("/").pop();
      if (!groupId) {
        notificationManager.showFail("", "Invalid link");
        return;
      }

      const { data: response } = await groupApi.joinGroup(
        groupId,
        userInfo.email,
        USER_ROLE.MEMBER
      );

      notificationManager.showSuccess(
        "",
        `Join group ${response?.name} successfully`
      );
      fetchData();
    } catch (error) {
      notificationManager.showFail("", error.response?.data.message);
    } finally {
      setButtonLoading(false);
      handleCloseJoinGroupModal();
    }
  };

  return (
    <>
      <Modal
        className={classes.modal}
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
            <Button type="submit" disabled={buttonLoading}>
              Create
            </Button>
          </Group>
        </form>
      </Modal>

      <Modal
        className={classes.modal}
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
          <Group position="center" mt={12}>
            <Button type="submit" disabled={buttonLoading}>
              Join
            </Button>
          </Group>
        </form>
      </Modal>
      <Group my="lg" position="apart">
        <Title
          order={3}
          sx={(theme) => ({
            color: theme.colors.dark[4],
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
