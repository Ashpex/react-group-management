import {
  createStyles,
  Avatar,
  Header,
  Group,
  Divider,
  Box,
  Burger,
  Drawer,
  Image,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { Link } from "react-router-dom";

import BlackLogo from "../assets/logo-low-res-black.png";

import useUserInfo from "./../hooks/useUserInfo";

const useStyles = createStyles((theme) => ({
  link: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: "none",
    color: theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan("sm")]: {
      height: 42,
      display: "flex",
      alignItems: "center",
      width: "100%",
    },

    ...theme.fn.hover({
      backgroundColor: theme.colors.gray[0],
    }),
  },
}));

const UserAvatar = (userInfo) => (
  <Avatar
    src={`https://avatars.dicebear.com/api/identicon/${userInfo.email}.svg`}
    size="sm"
  />
);

const NavLinks = () => {
  const { classes } = useStyles();

  return (
    <>
      <Link to="/groups" className={classes.link}>
        Groups
      </Link>
      <Link to="/presentations" className={classes.link}>
        Presentations
      </Link>
    </>
  );
};

const RightButtons = () => {
  const { userInfo } = useUserInfo();

  return (
    <>
      {userInfo ? (
        <Link to="/user/profile">
          <UserAvatar userInfo={userInfo} />
        </Link>
      ) : null}
    </>
  );
};

export default function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const { classes } = useStyles();

  return (
    <Box>
      <Header height={60} px="md">
        <Group position="apart" sx={{ height: "100%" }}>
          <Link to="/">
            <Image src={BlackLogo} height={30} width="auto" />
          </Link>

          <Group
            sx={{ height: "100%" }}
            spacing={0}
            className={classes.hiddenMobile}
          >
            <NavLinks />
          </Group>

          <Group className={classes.hiddenMobile}>
            <RightButtons />
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            className={classes.hiddenDesktop}
          />
        </Group>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1_000_000}
      >
        <ScrollArea sx={{ height: "calc(100vh - 60px)" }} mx="-md">
          <Divider my="sm" color={"gray.1"} />
          <NavLinks />
          <Divider my="sm" color={"gray.1"} />
          <Group position="center" grow pb="xl" px="md">
            <RightButtons />
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
