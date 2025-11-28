import { 
    Person, 
    LocationOn, 
    Settings,
    AccountCircle 
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import { useThemeMode } from '../../theme/useThemeMode.js';
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
    Divider
} from '@mui/material';

const ProfileSidebar = ({ activeTab, setActiveTab, profilePicturePreview }) => {
    const theme = useTheme();
    const { mode } = useThemeMode();
    
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
        </List>
      </Paper>
    );
};

export default ProfileSidebar;
