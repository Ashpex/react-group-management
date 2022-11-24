import React, { useState } from "react";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";

import styles from "./style.module.scss";
import { Avatar, IconButton, Tab, Tabs } from "@mui/material";
import IconButtonCustom from "../IconButtonCustom";
import { useRouter } from "next/router";

function Navbar() {
  const [value, setValue] = useState("newfeed");
  const router = useRouter();

  const handleChange = (event, newValue) => {
    setValue(newValue);
    router.push(newValue);
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
                onClick: () => {},
              },
              {
                label: "Tham gia lớp học",
                onClick: () => {},
              },
            ]}
          />
        </Box>

        <Box>
          <IconButtonCustom
            iconButton={<Avatar alt="Remy Sharp" src="/images/avatar.jpg" />}
            menuItem={[
              {
                label: "Thông tin cá nhân",
                onClick: () => {},
              },
              {
                label: "Đăng xuất",
                onClick: () => {},
              },
            ]}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Navbar;
