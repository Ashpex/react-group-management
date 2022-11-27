/* eslint-disable @next/next/no-img-element */
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButtonCustom from "../IconButtonCustom";
import styles from "./styles.module.scss";
import { Colors } from "../../shared/colors";

function ClassroomCardItem() {
  return (
    <Box className={`${styles.card}`}>
      <Box className={`flex-[2] ${styles.background}`}>
        <Box className="flex items-center justify-between">
          <Typography className={styles["class-title"]}>
            202209-PTUDWNC-19_3
          </Typography>

          <IconButtonCustom
            iconButton={
              <MoreVertIcon sx={{ fontSize: 24, color: Colors.WHITE }} />
            }
            menuItem={[
              {
                label: "Hủy đăng ký",
                onClick: () => {},
              },
            ]}
          />
        </Box>
        <Typography className={styles["class-description"]}>
          Phát triển ứng dụng web nâng cao
        </Typography>
      </Box>
      <Box className="flex-[3]">
        <Box className={styles["unnamed"]}>
          <img
            className={styles["unnamed-image"]}
            src="/images/unnamed.png"
            alt="unnamed"
          />
        </Box>
      </Box>
    </Box>
  );
}

export default ClassroomCardItem;
