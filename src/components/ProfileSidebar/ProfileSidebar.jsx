import React from 'react';
import {
  Person,
  LocationOn,
  Settings,
  AccountCircle,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Paper,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../../store/userSlice';

const ProfileSidebar = ({ activeTab, setActiveTab, profilePicturePreview }) => {
  const theme = useTheme();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = React.useState(false);

  const menuItems = [
    {
      id: 'personal',
      label: 'Personal Info',
      icon: <Person />
    },
    {
      id: 'address',
      label: 'Address',
      icon: <LocationOn />
    },
    {
      id: 'settings',
      label: 'Account Settings',
      icon: <Settings />
    }
  ];

  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3
      }}
    >
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Avatar
          src={profilePicturePreview}
          sx={{
            width: 100,
            height: 100,
            margin: "0 auto 16px",
            background: profilePicturePreview
              ? "transparent"
              : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: `0 4px 12px ${alpha(
              theme.palette.primary.main,
              0.16
            )}`,
          }}
        >
          {!profilePicturePreview && <AccountCircle sx={{ fontSize: 80 }} />}
        </Avatar>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          John Doe
        </Typography>
        <Typography variant="body2" color="text.secondary">
          john.doe@example.com
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              color="primary"
              sx={(t) => ({
                borderRadius: 2,
                ...(t.palette.mode === "dark"
                  ? {
                    "&.Mui-selected": {
                      color: t.palette.background.dark,
                      bgcolor: t.palette.primary.dark,
                      "&:hover": {
                        bgcolor: t.palette.primary.main,
                      },
                      "& .MuiListItemIcon-root": {
                        color: t.palette.background.paper,
                      },
                    },
                  }
                  : {
                    "&.Mui-selected": {
                      color: t.palette.primary.contrastText,
                      bgcolor: t.palette.primary.main,
                      "&:hover": {
                        bgcolor: t.palette.primary.dark,
                      },
                      "& .MuiListItemIcon-root": {
                        color: t.palette.primary.contrastText,
                      },
                    },
                  }),
              })}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding sx={{ mt: 1 }}>
          <ListItemButton onClick={() => setLogoutOpen(true)}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout? You will be redirected to the login page.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => {
            localStorage.removeItem('token');
            dispatch(clearUser());
            navigate('/login');
          }}>Logout</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProfileSidebar;
