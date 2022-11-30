import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { getSession, signIn } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import httpRequest from "../../src/api/httpRequest";

const InfoSchema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên"),
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
});

function UserProfile({ session }) {
  const { user } = session;
  const [error, setError] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
    resolver: yupResolver(InfoSchema),
  });

  const updateInfo = async (data) => {
    setIsFetching(true);

    try {
      const res = await httpRequest.put("/user/profile", {
        name: data.name,
        email: data.email,
      });

      toast.success(res?.data?.message, {
        autoClose: 3000,
      });

      await signIn("credentials", {
        redirect: false,
        ...res.data,
      });
    } catch (err) {
      setError(err?.response?.data?.message);
    }
    setIsFetching(false);
  };

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
              className="h-[80px] p-[8px] pl-[16px] flex items-center gap-[12px]"
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
              className="h-[80px] p-[8px] pl-[16px] pr-0 flex items-center gap-[20px]"
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
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors?.email?.message}
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
                />
              </Box>
            </Box>

            <Box
              className="h-[80px] p-[8px] pl-[16px] pr-0 flex items-center gap-[20px]"
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
                  {...register("name")}
                  error={!!errors.name}
                  helperText={errors?.name?.message}
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
                />
              </Box>
            </Box>

            {error && (
              <Box className="mt-6 flex justify-center">
                <Typography className="text-red-900 font-semibold">
                  {error}
                </Typography>
              </Box>
            )}

            <Box className="mt-4 flex justify-center">
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#1976d2 !important",
                  color: "#fff",
                }}
                onClick={handleSubmit(updateInfo)}
                disabled={isFetching}
                className={isFetching ? "cursor-not-allowed opacity-60" : ""}
              >
                {isFetching ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Cập nhật"
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <ToastContainer />
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
