"use client";

import { Avatar, Menu, MenuItem, IconButton, ListItemIcon, Divider } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import Logout from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserProfile({ user, onLogout, toggleTheme }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleNavigate = (path) => {
    handleClose();
    router.push(path);
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
      <Avatar>
  {user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U"}
</Avatar>

      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleNavigate("/profile")}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => handleNavigate("/about")}>
          <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          About Me
        </MenuItem>
        <Divider />
        <MenuItem onClick={toggleTheme}>
          <ListItemIcon>
            <DarkModeIcon fontSize="small" />
          </ListItemIcon>
          Toggle Dark Mode
        </MenuItem>
        <MenuItem onClick={onLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
