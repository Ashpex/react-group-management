import React, { useState } from "react";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import { signOut, useSession } from "next-auth/react";
import styles from "./style.module.scss";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import IconButtonCustom from "../IconButtonCustom";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import httpRequest from "../../api/httpRequest";

const CreateClassSchema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên lớp"),
  description: yup.string().required("Vui lòng nhập mô tả"),
});

const JoinClassSchema = yup.object().shape({
  name: yup.string().required("Vui lòng nhập tên lớp"),
  description: yup.string().required("Vui lòng nhập mô tả"),
});

function Navbar() {
  const [value, setValue] = useState("newfeed");
  const [openJoinClassDialog, setOpenJoinClassDialog] = useState(false);
  const [openCreateClassDialog, setOpenCreateClassDialog] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    resolver: yupResolver(CreateClassSchema),
  });

  const handleCloseJoinClassDialog = () => {
    setOpenJoinClassDialog(false);
  };

  const handleCloseCreateClassDialog = () => {
    setOpenCreateClassDialog(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    router.push(newValue);
  };

  const handleCreateClass = async (data) => {
    // console.log({ data });
    // try {
    //   const res = await httpRequest.post("/group", data);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <Box className={styles.navbar}>
      <Box className="flex gap-3 items-center">
        <IconButton
          sx={{
            padding: "1rem",
          }}
        >
          <MenuIcon sx={{ fontSize: 24 }} />
        </IconButton>
        <p>Classroom</p>
      </Box>

      <Box>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            overflow: "visible !important",
            "& .MuiTabs-scroller": {
              overflow: "visible !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#c26401",
              position: "absolute",
              bottom: -9,
            },
            "& .MuiTab-root": {
              color: "#5f6368",
              fontWeight: 550,
              fontSize: "14px",
              textTransform: "none",
            },
            "& .Mui-selected": {
              color: "#c26401 !important",
            },
          }}
        >
          <Tab label="Bảng tin" value={"newfeed"} />
          <Tab label="Bài tập trên lớp" value={"class-exercise"} />
          <Tab label="Mọi người" value={"member"} />
        </Tabs>
      </Box>

      <Box className="flex items-center gap-3">
        <Box>
          <IconButtonCustom
            iconButton={<AddIcon sx={{ fontSize: 24 }} />}
            menuItem={[
              {
                label: "Tạo lớp học",
                onClick: () => {
                  setOpenCreateClassDialog(true);
                },
              },
              {
                label: "Tham gia lớp học",
                onClick: () => {
                  setOpenJoinClassDialog(true);
                },
              },
            ]}
          />
        </Box>

        <Box>
          <IconButtonCustom
            iconButton={
              <Avatar
                alt="Remy Sharp"
                src={session?.user?.image ?? "/images/avatar.jpg"}
              />
            }
            menuItem={[
              {
                label: "Thông tin cá nhân",
                onClick: () => {
                  router.push("/user-profile");
                },
              },
              {
                label: "Đăng xuất",
                onClick: () => {
                  signOut();
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                },
              },
            ]}
          />
        </Box>
      </Box>

      {/* dialog join classroom */}
      <Dialog
        open={openJoinClassDialog}
        onClose={() => setOpenJoinClassDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-paper": {
            width: "50vw",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle>Tham gia lớp học</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <TextField
            label="Mã lớp"
            fullWidth
            autoFocus
            margin="dense"
            id="name"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
              },

              "& .MuiOutlinedInput-input": {
                padding: "10px",
                fontSize: "16px",
              },
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          <Button variant="outlined" onClick={handleCloseJoinClassDialog}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCloseJoinClassDialog}
            sx={{
              backgroundColor: "#1976d2 !important",
              color: "#fff",
            }}
          >
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>

      {/* dialog create classroom */}
      <Dialog
        open={openCreateClassDialog}
        onClose={() => setOpenCreateClassDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiDialog-paper": {
            width: "50vw",
            borderRadius: "10px",
          },
        }}
      >
        <DialogTitle>Tạo lớp học</DialogTitle>
        <DialogContent>
          <TextField
            {...register("name")}
            error={!!errors.name}
            helperText={errors.name?.message}
            label="Tên lớp học (bắt buộc)"
            fullWidth
            autoFocus
            margin="dense"
            id="name"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
              },

              "& .MuiOutlinedInput-input": {
                padding: "10px",
                fontSize: "16px",
              },
            }}
          />

          <TextField
            {...register("description")}
            error={!!errors.description}
            helperText={errors.description?.message}
            label="Mô tả"
            fullWidth
            autoFocus
            margin="dense"
            id="name"
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
              },

              "& .MuiOutlinedInput-input": {
                padding: "10px",
                fontSize: "16px",
              },
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          <Button variant="outlined" onClick={handleCloseCreateClassDialog}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit(handleCreateClass)}
            sx={{
              backgroundColor: "#1976d2 !important",
              color: "#fff",
            }}
          >
            Tạo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Navbar;
