import { Fade, IconButton, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";

function IconButtonCustom({ iconButton, menuItem }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          padding: "1rem",
        }}
      >
        {iconButton}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {menuItem?.map((item, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              item.onClick();
              handleClose();
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default IconButtonCustom;
