import * as React from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

export default function DropLogoutMenu() {
  return (
    <Paper sx={{ width: 320, maxWidth: '100%' }}>
      <MenuList>
        <MenuItem className='flex justify-between'>
          <ListItemText>Profil</ListItemText>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
        <Divider />
        <MenuItem className='flex justify-between'>
          <ListItemText>Logout</ListItemText>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </MenuList>
    </Paper>
  );
}