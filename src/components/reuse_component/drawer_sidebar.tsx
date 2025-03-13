import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useRouter } from "next/navigation";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";


    export const DrawerSidebar = () => {
      const toggleDrawer = (isOpen: boolean) => () => {
        setOpen(isOpen);
      };
    
      const router = useRouter();
      const handleNavigation = (path: string) => {
        router.push(path);
      };
    
      const menuItems = [
        { text: "Administrators", path: "/administrators", icon: <InboxIcon /> },
        { text: "Clients", path: "/clients", icon: <MailIcon /> },
        { text: "Roles", path: "/roless", icon: <InboxIcon /> },
        { text: "Problems", path: "/problems", icon: <MailIcon /> },
        {
          text: "Problem Categories",
          path: "/problems_categories",
          icon: <MailIcon />,
        },
      ];
      return (
        <>
      <div className="mt-15">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
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
    </>
      )
    };