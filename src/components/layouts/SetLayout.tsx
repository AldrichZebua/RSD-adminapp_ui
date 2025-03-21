"use client";

import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import LogoutIcon from "@mui/icons-material/Logout";
import CategoryIcon from "@mui/icons-material/Category";
import RuleIcon from "@mui/icons-material/Rule";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PersonIcon from "@mui/icons-material/Person";
import { Menu, MenuItem, MenuList, Paper, useMediaQuery } from "@mui/material";
import { useState, MouseEvent, ReactNode, useEffect } from "react";
import {
  administratorDefaultTableParams,
  clientDefaultTableParams,
  problemCategoryDefaultTableParams,
  problemDefaultTableParams,
  roleDefaultTableParams,
} from "../../../types/tableDefaultParams";
import qs from "qs";
import { useRouter } from "@bprogress/next/app";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open
    ? {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      }
    : {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      }),
}));

interface SetLayoutProps {
  children: ReactNode;
}

export default function SetLayout({ children }: SetLayoutProps) {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setOpen(isLargeScreen);
  }, [isLargeScreen]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const menuItems = [
    { text: "Dasboard", path: "/dashboard", icon: <DashboardIcon /> },
    {
      text: "Administrators",
      path: `/administrators?${qs.stringify(administratorDefaultTableParams)}`,
      icon: <SupervisorAccountIcon />,
    },
    {
      text: "Clients",
      path: `/clients?${qs.stringify(clientDefaultTableParams)}`,
      icon: <PersonIcon />,
    },
    {
      text: "Roles",
      path: `/roles?${qs.stringify(roleDefaultTableParams)}`,
      icon: <RuleIcon />,
    },
    {
      text: "Problem Categories",
      path: `/problem_categories?${qs.stringify(
        problemCategoryDefaultTableParams
      )}`,
      icon: <CategoryIcon />,
    },
    {
      text: "Problems",
      path: `/problems?${qs.stringify(problemDefaultTableParams)}`,
      icon: <ReportProblemIcon />,
    },
  ];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openDrop = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    router.push("/logout");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <div className="flex w-full justify-between">
            <div className="flex">
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={{ marginRight: 5, ...(open && { display: "none" }) }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                Your App
              </Typography>
            </div>
            <div>
              <IconButton onClick={handleClick}>
                <AccountCircleIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={openDrop} onClose={handleClose}>
                <Paper sx={{ width: 320, maxWidth: "100%" }}>
                  <MenuList>
                    <MenuItem
                      onClick={handleClose}
                      className="flex justify-between"
                    >
                      <ListItemText>Profil</ListItemText>
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                    </MenuItem>
                    <MenuItem
                      onClick={handleLogout}
                      className="flex justify-between"
                    >
                      <ListItemText>Logout</ListItemText>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Menu>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>

        <List>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  justifyContent: open ? "initial" : "center",
                }}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    justifyContent: "center",
                    mr: open ? 3 : "auto",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
