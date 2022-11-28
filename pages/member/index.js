import { Avatar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { getSession } from "next-auth/react";
import React from "react";

function MemberPage({ session }) {
  return (
    <Box className="flex justify-center">
      <Box className="w-[808px] p-[24px]">
        <Box>
          <Box
            className="pl-[16px] mb-[4px] h-[72px] flex items-center"
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
          </Box>

          <Box>
            <Box
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
            <Box
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
            <Box
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
              120 sinh viên
            </Typography>
          </Box>

          <Box>
            <Box
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
            <Box
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
            <Box
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
