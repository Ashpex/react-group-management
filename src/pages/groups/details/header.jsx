/* eslint-disable react-hooks/exhaustive-deps */
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
  Box,
  CloseButton,
  Title,
  Avatar,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconUserPlus,
  IconTrash,
  IconCategory,
  IconLogout,
  IconDoorEnter,
  IconMessageCircle,
  IconSend,
  IconPresentationAnalytics,
} from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import socketIOClient from "socket.io-client";
import groupApi from "../../../api/group";
import messageApi from "../../../api/message";
import * as notificationManager from "../../common/notificationManager";
import { USER_ROLE } from "../../../utils/constants";
import useUserInfo from "../../../hooks/useUserInfo";
import presentationApi from "../../../api/presentation";

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
  const [joinSlideOpened, setJoinSlideOpened] = useState(false);
  const [groupData, setGroupData] = useState();
  const [openConfirmWatchPresentation, setOpenConfirmWatchPresentation] =
    useState(false);
  const [invitationLink, setInvitationLink] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [openChatBox, setOpenChatBox] = useState(false);
  const [messages, setMessages] = useState([]);
  const [presentations, setPresentations] = useState([]);
  const [presentationId, setPresentationId] = useState("");
  const [firstSlide, setFirstSlide] = useState("");
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const { userInfo } = useUserInfo();
  const chatBoxRef = useRef();
  const socketRef = useRef();

  const form = useForm({
    initialValues: { email: "", role: USER_ROLE.MEMBER },
    validate: {
      email: (value) =>
        /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? null : "Invalid email",
    },
  });

  const joinSlideForm = useForm({
    initialValues: { slideId: "" },
  });

  const breadcrumbsItems = [
    { title: "Groups", to: "/groups" },
    { title: groupData?.name || "", to: "#" },
  ];

  useEffect(() => {
    socketRef.current = socketIOClient.connect(process.env.REACT_APP_BACKEND);
    getPresentationsByUserId();

    socketRef.current.on("getMessages", () => {
      if (!openChatBox) {
        setOpenChatBox(true);
      }
      getAllMessages();
    });

    socketRef.current.on("createSlideShow", ({ data }) => {
      if (role === USER_ROLE.MEMBER || !role) {
        setPresentationId(data?.presentationId);
        setOpenConfirmWatchPresentation(true);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await groupApi.getGroupById(groupId);

        setGroupData(response);
      } catch (error) {
        notificationManager.showFail("", error.response?.data.message);
      }
    };

    fetchData();
  }, [groupId]);

  useEffect(() => {
    if (openChatBox) {
      getAllMessages();
    }
  }, [groupId, openChatBox]);

  useEffect(() => {
    chatBoxRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (content) => {
    try {
      await messageApi.createMessage(groupId, content, userInfo._id);
      socketRef.current.emit("getMessages", { groupId });
    } catch (error) {
      notificationManager.showFail("", "Failed to send message");
    }
  };

  const getAllMessages = async () => {
    try {
      const { data: response } = await messageApi.getMessagesByGroupId(groupId);
      setMessages(response);
    } catch (error) {
      notificationManager.showFail("", error.response?.data.message);
    }
  };

  const getPresentationsByUserId = async () => {
    try {
      const { data: response } = await presentationApi.getPresentations(
        userInfo._id
      );
      setPresentations(response);
    } catch (error) {
      notificationManager.showFail("", "Failed to get presentations");
    }
  };

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
    setInvitationModalOpened(false);
  };

  const handleOpenInviteViaEmailModal = () => {
    form.reset();
    setInviteViaEmailOpened(true);
  };

  const handleOpenJoinGroupModal = () => {
    joinSlideForm.reset();
    setJoinSlideOpened(true);
  };

  const handleCloseJoinSlideModal = () => {
    joinSlideForm.reset();
    setJoinSlideOpened(false);
  };

  const handleCloseInviteViaEmailModal = () => {
    form.reset();
    setInviteViaEmailOpened(false);
  };

  const handleSubmitSlideIdForm = async (values) => {
    navigate(`/slides/${values.slideId}`);
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
      notificationManager.showFail("", error.response?.data.message);
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
      notificationManager.showFail("", error.response?.data.message);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      const { data: response } = await groupApi.deleteGroup(groupId);

      notificationManager.showSuccess("", response.message);
      navigate("/groups");
    } catch (error) {
      notificationManager.showFail("", error.response?.data.message);
    }
  };

  const handleOpenPresentation = (presentationId) => {
    socketRef.current.emit("createSlideShow", { presentationId });
    navigate(`/presentations/${presentationId}`);
  };

  const getFirstSlideFromPresentationId = async (presentationId) => {
    try {
      const { data: response } = await presentationApi.getFirstSlide(
        presentationId
      );

      return response;
    } catch (error) {
      notificationManager.showFail("", error.response?.data.message);
    }
  };

  return (
    <>
      {role === USER_ROLE.MEMBER && (
        <Modal
          centered
          opened={openConfirmWatchPresentation}
          onClose={() => setOpenConfirmWatchPresentation(false)}
          title="Confirm"
          size="lg"
        >
          <Title order={4}>
            Your teacher are showing presentation. Do you want to join?
          </Title>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: "20px",
              gap: "16px",
            }}
          >
            <Button
              color="red"
              onClick={() => {
                setOpenConfirmWatchPresentation(false);
              }}
            >
              No
            </Button>
            <Button
              onClick={async () => {
                setOpenConfirmWatchPresentation(false);
                const firstSlide = await getFirstSlideFromPresentationId(
                  presentationId
                );
                navigate(`/slides/${firstSlide._id}`);
              }}
            >
              Yes
            </Button>
          </Box>
        </Modal>
      )}

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

      <Modal
        title="Join slide"
        opened={joinSlideOpened}
        onClose={handleCloseJoinSlideModal}
        className={classes.modal}
      >
        <form onSubmit={joinSlideForm.onSubmit(handleSubmitSlideIdForm)}>
          <TextInput
            label="Slide ID"
            placeholder="Slide ID you want join"
            required
            {...joinSlideForm.getInputProps("slideId")}
          />

          <Group position="center" mt="lg">
            <Button type="submit">Join</Button>
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
                <Tooltip label="Create slideshow">
                  <Button>
                    <IconPresentationAnalytics />
                  </Button>
                </Tooltip>
              </Menu.Target>
              <Menu.Dropdown>
                {presentations?.map((presentation) => (
                  <Menu.Item
                    key={presentation._id}
                    onClick={() => handleOpenPresentation(presentation._id)}
                  >
                    {presentation?.name}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>

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
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            <Tooltip label="Join slide">
              <Button onClick={handleOpenJoinGroupModal}>
                <IconDoorEnter />
              </Button>
            </Tooltip>
            <Tooltip label="Leave group">
              <Button color="red" onClick={handleMemberLeaveGroup}>
                <IconLogout />
              </Button>
            </Tooltip>
          </Box>
        ) : null}
      </Group>

      <Box
        sx={{
          position: "fixed",
          bottom: 15,
          right: 15,
          zIndex: 9,
        }}
      >
        <Tooltip label="Invite people">
          <Button
            sx={{
              borderRadius: "50%",
              width: "3rem",
              height: "3rem",
              padding: 0,
            }}
            onClick={() => {
              setOpenChatBox(!openChatBox);
            }}
          >
            <IconMessageCircle size={24} />
          </Button>
        </Tooltip>

        {openChatBox && (
          <Box
            sx={{
              position: "fixed",
              bottom: 15,
              right: 15,
              width: "25vw",
              height: "70vh",
              backgroundColor: "white",
              borderRadius: "1rem",
              border: "1px solid #e5e5e5",
              padding: "16px",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                right: "-10px",
                top: "-12px",
                zIndex: 10,
              }}
            >
              <CloseButton
                size="14"
                iconSize={16}
                color="red"
                variant="filled"
                sx={{
                  borderRadius: "50%",
                  padding: "6px",
                }}
                onClick={() => {
                  setOpenChatBox(!openChatBox);
                }}
              />
            </Box>

            {/* chat content */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "calc(100% - 40px)",
                width: "100%",
                overflowY: "auto",
              }}
            >
              {messages?.map((message, index) => {
                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                      gap: "8px",
                      flexDirection:
                        message.userId === userInfo?._id
                          ? "row-reverse"
                          : "row",
                    }}
                  >
                    <Avatar radius="xl" color="cyan">
                      {message.userId === userInfo?._id ? "Me" : "U"}
                    </Avatar>

                    <Box
                      sx={{
                        background:
                          message.userId === userInfo?._id
                            ? "#0084ff"
                            : "#e4e6eb",
                        borderRadius: "1rem",
                        padding: "8px 16px",
                        width: "fit-content",
                        color:
                          message.userId === userInfo?._id ? "white" : "#000",
                      }}
                    >
                      {message?.content}
                    </Box>

                    <Title
                      sx={{
                        fontSize: "10px",
                        fontWeight: "400",
                      }}
                    >
                      {new Date(message?.createdAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "numeric",
                        }
                      )}
                    </Title>
                  </Box>
                );
              })}
              <div ref={chatBoxRef}></div>
            </Box>

            <Box
              sx={{
                position: "absolute",
                bottom: 14,
                width: "calc(100% - 28px)",
              }}
            >
              <TextInput
                placeholder="Enter your massage"
                rightSection={<IconSend size="18" />}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage(e.target.value);
                    e.target.value = "";
                  }
                }}
                autoComplete="off"
              />
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
