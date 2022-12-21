/* eslint-disable react-hooks/exhaustive-deps */
import {
  Container,
  Grid,
  Group,
  Card,
  Image,
  Stack,
  Text,
  Pagination,
  Tooltip,
  Loader,
  Center,
  Alert,
  createStyles,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";

import Header from "./header";

import groupApi from "../../../api/group";
import * as notificationManager from "../../common/notificationManager";
import { filterGroupByType, getUserId } from "../../../utils";
import { isAxiosError } from "../../../utils/axiosErrorHandler";
import { GROUP_FILTER_TYPE } from "../../../utils/constants";
import useUserInfo from "../../../hooks/useUserInfo";

const GROUPS_PER_PAGE = 8;

const useStyles = createStyles(() => ({
  lineClamp1: {
    display: "-webkit-box",
    WebkitLineClamp: 1,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  lineClamp3: {
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
}));

function EmptyContent({ message }) {
  return (
    <Center>
      <Alert
        icon={<IconAlertCircle size={16} />}
        radius="md"
        color="yellow"
        my="xl"
      >
        {message}
      </Alert>
    </Center>
  );
}

export default function GroupsPage() {
  const { classes } = useStyles();
  const [dataSource, setDataSource] = useState([]);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [activePage, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [groupFilter, setGroupFilter] = useState(GROUP_FILTER_TYPE.ALL);
  const [isLoading, setLoading] = useState(false);
  const { userInfo } = useUserInfo();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: response } = await groupApi.getGroupsOwner(userInfo._id);

      setDataSource(response.data);
      setTotalPages(Math.ceil(response.data.length / GROUPS_PER_PAGE));
    } catch (error) {
      if (isAxiosError(error)) {
        notificationManager.showFail("", error.response?.data.message);
      }
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const userId = getUserId();
    const filteredGroups = filterGroupByType(dataSource, groupFilter, userId);

    setFilteredDataSource(filteredGroups);
  }, [dataSource, groupFilter]);

  const currentDataSource = useMemo(() => {
    const startIndex = (activePage - 1) * GROUPS_PER_PAGE;
    const groups = filteredDataSource?.slice(
      startIndex,
      startIndex + GROUPS_PER_PAGE
    );

    return groups;
  }, [activePage, filteredDataSource]);

  return (
    <Container size="lg">
      <Header
        fetchData={fetchData}
        groupFilter={groupFilter}
        setGroupFilter={setGroupFilter}
      />
      {isLoading ? (
        <Center>
          <Loader />
        </Center>
      ) : dataSource?.length > 0 ? (
        currentDataSource?.length > 0 ? (
          <>
            <Grid>
              {currentDataSource.map((group, index) => (
                <Grid.Col key={index} span={3}>
                  <Card
                    component={Link}
                    to={`/group/${group._id}`}
                    shadow="sm"
                    p="lg"
                    radius="md"
                    h={333}
                    withBorder
                  >
                    <Card.Section>
                      <Image
                        src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1122&q=80"
                        height={160}
                        alt="Cover image"
                      />
                    </Card.Section>

                    <Stack mt="md" mb="xs" spacing="xs">
                      <Tooltip label={group.name} position="top-start">
                        <Text weight={600} className={classes.lineClamp1}>
                          {group.name}
                        </Text>
                      </Tooltip>
                      <Text className={classes.lineClamp1}>
                        {group.userCreated.name}
                      </Text>
                    </Stack>

                    <Text
                      size="sm"
                      color="dimmed"
                      className={classes.lineClamp3}
                    >
                      {group.description}
                    </Text>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
            <Group position="right" mt="lg">
              <Pagination
                page={activePage}
                onChange={setPage}
                total={totalPages}
              />
            </Group>
          </>
        ) : (
          <EmptyContent
            message={
              groupFilter === GROUP_FILTER_TYPE.GROUP_YOU_JOINED
                ? "You haven't join any groups"
                : "You haven't create any groups"
            }
          />
        )
      ) : (
        <EmptyContent message="Create or join a group to start" />
      )}
    </Container>
  );
}
