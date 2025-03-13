"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
// import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useRouter } from "next/navigation";
import DashboardIcon from '@mui/icons-material/Dashboard';


const drawerWidth = 250;

export default function SidebarPanelFull() {

  const router = useRouter();
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const menuItems = [
    { text: "Dasboard", path: "/dashboard", icon: <DashboardIcon /> },
    { text: "Administrators", path: "/administrators", icon: <InboxIcon /> },
    { text: "Clients", path: "/clients", icon: <MailIcon /> },
    { text: "Roles", path: "/roles", icon: <InboxIcon /> },
    { text: "Problems", path: "/problems", icon: <MailIcon /> },
    {
      text: "Problem Categories",
      path: "/problems_categories",
      icon: <MailIcon />,
    },
  ];


  const DrawerList = (
    <div className="mt-15">
      <Box sx={{ width: 250 }}>
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => handleNavigation(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* <Divider /> */}
      </Box>
    </div>
  );

  return (
    <>
      <Drawer
      variant="permanent"
      sx={{
      width: drawerWidth,
      flexShrink: 0,
      }}
      >
        {DrawerList}
      </Drawer>
    </>
  );
}
