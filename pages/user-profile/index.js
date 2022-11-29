import { Avatar, Box, TextField, Typography } from "@mui/material";
import { getSession } from "next-auth/react";
import React, { useState } from "react";

function UserProfile({ session }) {
  const { user } = session;
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

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
              Thông tin cá nhân
            </Typography>
          </Box>

          <Box>
            <Box
              className="h-[60px] p-[8px] pl-[16px] flex items-center gap-[12px]"
              sx={{
                borderBottom: "0.0625rem solid #e0e0e0",
              }}
            >
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
                Avatar
              </Typography>

              <Box className="flex-1 flex justify-center items-center">
                <Avatar
                  sx={{ width: 50, height: 50 }}
                  src={user?.image ?? "/images/avatar.jpg"}
                ></Avatar>
              </Box>
            </Box>

            <Box
              className="h-[60px] p-[8px] pl-[16px] pr-0 flex items-center gap-[20px]"
              sx={{
                borderBottom: "0.0625rem solid #e0e0e0",
              }}
            >
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
                Email
              </Typography>

              <Box className="flex-1">
                <TextField
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-input": {
                      padding: "8px 14px",
                    },
                    "& .MuiOutlinedInput-root": {
                      fontSize: "16px",
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#e0e0e0",
                      },
                    },
                  }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Box>
            </Box>

            <Box
              className="h-[60px] p-[8px] pl-[16px] pr-0 flex items-center gap-[20px]"
              sx={{
                borderBottom: "0.0625rem solid #e0e0e0",
              }}
            >
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
                Name
              </Typography>

              <Box className="flex-1">
                <TextField
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-input": {
                      padding: "8px 14px",
                    },
                    "& .MuiOutlinedInput-root": {
                      fontSize: "16px",
                      "& fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&:hover fieldset": {
                        borderColor: "#e0e0e0",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#e0e0e0",
                      },
                    },
                  }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default UserProfile;

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
