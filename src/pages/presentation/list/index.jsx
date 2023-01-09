import {
  Container,
  Text,
  Tooltip,
  Center,
  Loader,
  Alert,
  Grid,
  Card,
  createStyles,
  Image,
  Stack,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import { useState, useEffect } from "react";

import PresentationListHeader from "./header";

import presentationApi from "../../../api/presentation";
import * as notificationManager from "../../common/notificationManager";
import { isAxiosError } from "../../../utils/axiosErrorHandler";
import useUserInfo from "../../../hooks/useUserInfo";
import { Link } from "react-router-dom";

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

export default function PresentationList() {
  const { classes } = useStyles();
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const { userInfo } = useUserInfo();

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: response } = await presentationApi.getPresentations(
        userInfo._id
      );
      setDataSource(response);
    } catch (error) {
      if (isAxiosError(error)) {
        notificationManager.showFail("", error.response?.data.message);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container size="lg">
      <PresentationListHeader fetchData={fetchData} />

      {isLoading ? (
        <Center>
          <Loader />
        </Center>
      ) : dataSource?.length > 0 ? (
        <>
          <Grid>
            {dataSource?.map((presentation, index) => (
              <Grid.Col key={index} span={3}>
                <Card
                  component={Link}
                  to={`/presentations/${presentation._id}`}
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
                    <Tooltip label={presentation.name} position="top-start">
                      <Text weight={600} className={classes.lineClamp1}>
                        {presentation.name}
                      </Text>
                    </Tooltip>
                    <Text className={classes.lineClamp1}>
                      {presentation.createdAt.toLocaleString("en-US")}
                    </Text>
                  </Stack>

                  <Text size="sm" color="dimmed" className={classes.lineClamp3}>
                    {presentation.description}
                  </Text>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </>
      ) : (
        <Center>
          <Alert
            icon={<IconAlertCircle size={16} />}
            radius="md"
            color="yellow"
            my="xl"
          >
            Create your first presentation
          </Alert>
        </Center>
      )}
    </Container>
  );
}
