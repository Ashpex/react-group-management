import { Box, Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

export default function MenuNavbar({ classId, currentTab, setCurrentTab }) {
  const router = useRouter();

  const handleChange = (event, value) => {
    setCurrentTab(value);
    router.push(`/class/${classId}/${value}`);
  };

  return (
    <Box className="fixed top-0 w-full">
      <Box className="flex items-center justify-center h-[60px]">
        <Tabs
          value={currentTab}
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
          <Tab label="Bài tập trên lớp" value={"exercise"} />
          <Tab label="Mọi người" value={"member"} />
        </Tabs>
      </Box>
    </Box>
  );
}
