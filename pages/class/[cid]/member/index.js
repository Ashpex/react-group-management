import { Avatar, Tab, Tabs, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import httpRequest from "../../../../src/api/httpRequest";
import MenuNavbar from "../../../../src/components/MenuNavbar";
import { useMenu } from "../../../../src/provider/MenuProvider";

function MemberPage({ session }) {
  const router = useRouter();
  const { currentTab, setCurrentTab } = useMenu();
  const [adminMember, setAdminMember] = useState([]);
  const [member, setMember] = useState([]);

  const classId = router.query.cid;

  const getMember = async () => {
    try {
      const res = await httpRequest.get("/group/" + classId + "/users");
      const data = res.data;

      const adminMember = data?.filter((item) => item.role === "admin");
      const member = data?.filter((item) => item.role === "member");

      setAdminMember(adminMember);
      setMember(member);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMember();
  }, []);

  return (
    <Box>
      <Box className="flex w-full justify-center">
        <MenuNavbar
          classId={classId}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
      </Box>
      <Box className="flex justify-center">
        <Box className="w-[808px] p-[24px]">
          <Box>
            <Box
              className="pl-[16px] mb-[4px] h-[72px] flex items-center justify-between"
              sx={{
                borderBottom: "1px solid rgb(232,113,10)",
              }}
            >
              <Typography
                sx={{
                  color: "rgb(194, 100, 1)",
                  fontSize: "34px",
                  fontWeight: 400,
                }}
              >
                Giáo viên
              </Typography>

              <Typography
                sx={{
                  color: "rgb(194, 100, 1)",
                  fontSize: "14px",
                  fontWeight: 550,
                  marginRight: "24px",
                }}
              >
                {adminMember?.length} giáo viên
              </Typography>
            </Box>

            <Box>
              {(adminMember || []).map((item) => (
                <Box
                  key={item.id}
                  className="h-[60px] p-[8px] pl-[16px] flex items-center gap-[12px]"
                  sx={{
                    borderBottom: "0.0625rem solid #e0e0e0",
                  }}
                >
                  <Avatar>{item?.name.slice(0, 1)}</Avatar>
                  <Typography
                    sx={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      marginLeft: "8px",
                      letterSpacing: "2px",
                      fontSize: "16px",
                      color: "#3c4043",
                      fontWeight: 550,
                    }}
                  >
                    {item.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <Box
              className="pl-[16px] mb-[4px] h-[72px] flex items-center justify-between"
              sx={{
                borderBottom: "1px solid rgb(232,113,10)",
              }}
            >
              <Typography
                sx={{
                  color: "rgb(194, 100, 1)",
                  fontSize: "34px",
                  fontWeight: 400,
                }}
              >
                Học sinh
              </Typography>

              <Typography
                sx={{
                  color: "rgb(194, 100, 1)",
                  fontSize: "14px",
                  fontWeight: 550,
                  marginRight: "24px",
                }}
              >
                {member?.length} học sinh
              </Typography>
            </Box>

            <Box>
              {(member || []).map((item) => (
                <Box
                  key={item.id}
                  className="h-[60px] p-[8px] pl-[16px] flex items-center gap-[12px]"
                  sx={{
                    borderBottom: "0.0625rem solid #e0e0e0",
                  }}
                >
                  <Avatar>H</Avatar>
                  <Typography
                    sx={{
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      marginLeft: "8px",
                      letterSpacing: "2px",
                      fontSize: "16px",
                      color: "#3c4043",
                      fontWeight: 550,
                    }}
                  >
                    Nguyễn Văn A
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default MemberPage;

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
