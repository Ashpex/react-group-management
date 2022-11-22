import React from "react";
import Box from "@mui/material/Box";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";

import styles from "./style.module.scss";
import { Avatar, IconButton } from "@mui/material";
import IconButtonCustom from "../IconButtonCustom";

function Navbar() {
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
