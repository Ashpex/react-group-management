import { Box, Group } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import groupApi from "../../../api/group";
import {
  ConfirmPopoverAssignRole,
  ConfirmPopoverKickOut,
} from "../../common/confirmPopover";
import * as notificationManager from "../../common/notificationManager";
import { sortMemberListByRole } from "../../../utils";
import { isAxiosError } from "../../../utils/axiosErrorHandler";
import { USER_ROLE } from "../../../utils/constants";
import useUserInfo from "../../../hooks/useUserInfo";

export default function MemberList({ role, setRole }) {
  const [dataSource, setDataSource] = useState([]);
  const [fetching, setFetching] = useState(false);
  const { groupId } = useParams();
  const { userInfo } = useUserInfo();

  const fetchData = useCallback(async () => {
    try {
      setFetching(true);
      const { data: response } = await groupApi.getGroupById(groupId);

      const convertedData = response.usersAndRoles.map((item) => ({
        ...item,
        role: USER_ROLE[item.role.toUpperCase()],
      }));

      const user = convertedData.find((item) => item.user._id === userInfo._id);

      setRole(user?.role || "");
      setDataSource(sortMemberListByRole(convertedData));
    } catch (error) {
      if (isAxiosError(error)) {
        notificationManager.showFail("", error.response?.data.message);
      }
    }

    setFetching(false);
  }, [groupId, setRole]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssignMemberRole = async (userId, roleAssign) => {
    try {
      const { data: response } = await groupApi.assignMemberRole(
        groupId,
        userId,
        roleAssign
      );

      notificationManager.showSuccess("", response.message);
      fetchData();
    } catch (error) {
      if (isAxiosError(error)) {
        notificationManager.showFail("", error.response?.data.message);
      }
    }
  };

  const handleKickOutMember = async (userId) => {
    try {
      const { data: response } = await groupApi.kickOutMember(groupId, userId);

      notificationManager.showSuccess("", response.message);
      fetchData();
    } catch (error) {
      if (isAxiosError(error)) {
        notificationManager.showFail("", error.response?.data.message);
      }
    }
  };

  const COLUMNS = [
    {
      accessor: "index",
      title: "#",
      textAlignment: "center",
      width: 40,
      render: (_, index) => index + 1,
    },
    { accessor: "user.name", title: "Name" },
    { accessor: "user.email", title: "Email" },
    { accessor: "role", textAlignment: "center" },
  ];

  const ACTION_COLUMNS = [
    {
      accessor: "action",
      title: "Action",
      textAlignment: "center",
      width: 100,
      render: (record) => {
        const onAssignRoleConfirm = () => {
          const roleAssign =
            record.role === USER_ROLE.MEMBER ? "CO_OWNER" : "MEMBER";

          handleAssignMemberRole(record.user._id, roleAssign);
        };

        return record.role !== USER_ROLE.OWNER ? (
          <Group position="center">
            {role === USER_ROLE.OWNER ? (
              <ConfirmPopoverAssignRole
                role={record.role}
                onConfirm={onAssignRoleConfirm}
              />
            ) : null}
            {role === USER_ROLE.OWNER || record.role === USER_ROLE.MEMBER ? (
              <ConfirmPopoverKickOut
                onConfirm={() => handleKickOutMember(record.user._id)}
              />
            ) : null}
          </Group>
        ) : null;
      },
    },
  ];

  return (
    <Box mt="xl">
      <DataTable
        columns={
          role !== USER_ROLE.MEMBER ? [...COLUMNS, ...ACTION_COLUMNS] : COLUMNS
        }
        records={dataSource}
        idAccessor="user._id"
        minHeight={dataSource.length > 0 ? 0 : 150}
        verticalSpacing="sm"
        borderRadius="md"
        withBorder
        withColumnBorders
        fetching={fetching}
      />
    </Box>
  );
}
