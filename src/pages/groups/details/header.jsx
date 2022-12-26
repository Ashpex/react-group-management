import {
  Button,
  Group,
  Menu,
  Tooltip,
  Modal,
  TextInput,
  Breadcrumbs,
  Anchor,
  createStyles,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconUserPlus,
  IconTrash,
  IconCategory,
  IconLogout,
} from "@tabler/icons";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import groupApi from "../../../api/group";
import * as notificationManager from "../../common/notificationManager";
import { isAxiosError } from "../../../utils/axiosErrorHandler";
import { USER_ROLE } from "../../../utils/constants";
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

    "& .mantine-Input-disabled": {
      color: "black",
      fontWeight: "500",
    },
  },
}));

export default function Header({ role }) {
  const [invitationModalOpened, setInvitationModalOpened] = useState(false);
  const [inviteViaEmailOpened, setInviteViaEmailOpened] = useState(false);
  const [groupData, setGroupData] = useState();
  const [invitationLink, setInvitationLink] = useState("");
  const [isLoading, setLoading] = useState(false);
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const { userInfo } = useUserInfo();

  const form = useForm({
    initialValues: { email: "", role: USER_ROLE.MEMBER },
    validate: {
      email: (value) =>
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? null : "Invalid email",
    },
  });

  const breadcrumbsItems = [
    { title: "Groups", to: "/groups" },
    { title: groupData?.name || "", to: "#" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await groupApi.getGroupById(groupId);

        setGroupData(response);
      } catch (error) {
        if (isAxiosError(error)) {
          notificationManager.showFail("", error.response?.data.message);
        }
      }
    };

    fetchData();
  }, [groupId]);

  const handleOpenInvitationModal = async () => {
    setInvitationLink(`${window.location.origin}/groups/invitation/${groupId}`);
    setInvitationModalOpened(true);
  };

  const handleCloseInvitationModal = () => {
    setInvitationLink("");
    setInvitationModalOpened(false);
  };

  const handleCopyInvitationLink = () => {
    navigator.clipboard.writeText(invitationLink);
    notificationManager.showSuccess("", "Copy to clipboard");
  };

  const handleOpenInviteViaEmailModal = () => {
    form.reset();
    setInviteViaEmailOpened(true);
  };

  const handleCloseInviteViaEmailModal = () => {
    form.reset();
    setInviteViaEmailOpened(false);
  };

  const handleSubmitInviteViaEmailForm = async (values) => {
    try {
      setLoading(true);
      const { data: response } = await groupApi.inviteUserByEmail(
        groupId,
        values.email,
        values.role
      );

      notificationManager.showSuccess("", response.message);
    } catch (error) {
      if (isAxiosError(error)) {
        notificationManager.showFail("", error.response?.data.message);
      }
    }

    setLoading(false);
    setInviteViaEmailOpened(false);
  };

  const handleMemberLeaveGroup = async () => {
    try {
      await groupApi.leaveGroup(groupId, userInfo._id);

      notificationManager.showSuccess("", `You have left ${groupData?.name}`);
      navigate("/groups");
    } catch (error) {
      if (isAxiosError(error)) {
        notificationManager.showFail("", error.response?.data.message);
      }
    }
  };

  const handleDeleteGroup = async () => {
    try {
      const { data: response } = await groupApi.deleteGroup(groupId);

      notificationManager.showSuccess("", response.message);
      navigate("/groups");
    } catch (error) {
      if (isAxiosError(error)) {
        notificationManager.showFail("", error.response?.data.message);
      }
    }
  };

  return (
    <>
      <Modal
        title="Invitation link"
        opened={invitationModalOpened}
        onClose={handleCloseInvitationModal}
        className={classes.modal}
      >
        <TextInput value={invitationLink} disabled />
        <Group position="center" mt="lg">
          <Button onClick={handleCopyInvitationLink}>Copy link</Button>
        </Group>
      </Modal>
      <Modal
        title="Invite via email"
        opened={inviteViaEmailOpened}
        onClose={handleCloseInviteViaEmailModal}
        className={classes.modal}
      >
        <form onSubmit={form.onSubmit(handleSubmitInviteViaEmailForm)}>
          <TextInput
            label="Email"
            placeholder="Email you want invite"
            required
            {...form.getInputProps("email")}
          />

          <Select
            label="Choose role"
            defaultValue={USER_ROLE.MEMBER}
            data={[
              { value: USER_ROLE.CO_OWNER, label: "CO OWNER" },
              { value: USER_ROLE.MEMBER, label: "MEMBER" },
            ]}
            {...form.getInputProps("role")}
          />

          <Group position="center" mt="lg">
            <Button type="submit" loading={isLoading}>
              Send link
            </Button>
          </Group>
        </form>
      </Modal>
      <Group my="lg" position="apart">
        <Breadcrumbs>
          {breadcrumbsItems.map((item, index) => (
            <Anchor key={index} component={Link} to={item.to}>
              {item.title}
            </Anchor>
          ))}
        </Breadcrumbs>
        {role === USER_ROLE.OWNER || role === USER_ROLE.CO_OWNER ? (
          <Group>
            <Menu position="bottom-end" shadow="md">
              <Menu.Target>
                <Tooltip label="Invite people">
                  <Button>
                    <IconUserPlus />
                  </Button>
                </Tooltip>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={handleOpenInvitationModal}>
                  Get invitation link
                </Menu.Item>
                <Menu.Item onClick={handleOpenInviteViaEmailModal}>
                  Send invitation via email
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Menu position="bottom-end" shadow="md">
              <Menu.Target>
                <Tooltip label="Menu">
                  <Button>
                    <IconCategory />
                  </Button>
                </Tooltip>
              </Menu.Target>
              <Menu.Dropdown>
                {role === USER_ROLE.OWNER ? (
                  <>
                    <Menu.Item
                      color="red"
                      icon={<IconTrash size={14} />}
                      onClick={handleDeleteGroup}
                    >
                      Delete group
                    </Menu.Item>
                  </>
                ) : (
                  <>
                    <Menu.Label>Danger zone</Menu.Label>
                    <Menu.Item
                      color="red"
                      icon={<IconLogout size={14} />}
                      onClick={handleMemberLeaveGroup}
                    >
                      Leave group
                    </Menu.Item>
                  </>
                )}
              </Menu.Dropdown>
            </Menu>
          </Group>
        ) : role === USER_ROLE.MEMBER ? (
          <Tooltip label="Leave group">
            <Button color="red" onClick={handleMemberLeaveGroup}>
              <IconLogout />
            </Button>
          </Tooltip>
        ) : null}
      </Group>
    </>
  );
}
