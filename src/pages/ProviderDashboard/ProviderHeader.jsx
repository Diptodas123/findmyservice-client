import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  ListItemIcon
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { clearUser } from '../../store/userSlice';
import { useTheme } from '@mui/material/styles';
import { useThemeMode } from '../../theme/useThemeMode';


const ProviderHeader = ({ onToggleSidebar }) => {
  const profile = useSelector((s) => s.user?.profile || {});
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(clearUser());
    handleClose();
    navigate('/login');
  };

  const theme = useTheme();
  const { mode, setMode } = useThemeMode() || {};
  const handleToggleMode = () => setMode && setMode(mode === 'light' ? 'dark' : 'light');

  return (
    <AppBar position="fixed" color="primary" elevation={3} sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={onToggleSidebar} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', mr: 1 }}>
          <Box component="img" src="/brand-logo.png" alt="FindMyService" sx={{ height: 34, width: 'auto', display: 'block', mr: 1 }} />
        </Box>
        <Typography variant="h6" noWrap sx={{ flexShrink: 0, mr: 2, color: 'primary.contrastText', fontSize: { xs: '0.9rem', sm: '0.9rem' } }}>
          Provider Dashboard
        </Typography>

        <Box sx={{ flex: 1 }} />

        <IconButton sx={{ ml: 1 }} color="inherit" onClick={handleToggleMode} aria-label="toggle theme">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>

        <IconButton onClick={handleAvatarClick} sx={{ ml: 1 }}>
          <Avatar src={profile?.profilePictureUrl} alt={profile?.name} sx={{ width: 48, height: 48 }} />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose} MenuListProps={{
            sx: {
              bgcolor: 'background.paper'
            }
          }}>
          <MenuItem onClick={handleLogout} sx={(t) => ({
            '&:hover': {
              bgcolor: t.palette.mode === 'light' ? t.palette.action.hover : 'primary.dark'
            },
            '&.Mui-focusVisible, &.Mui-selected': {
              bgcolor: t.palette.mode === 'light' ? t.palette.action.selected : 'primary.main',
              color: t.palette.mode === 'light' ? t.palette.text.primary : t.palette.primary.contrastText
            }
          })}>
            <ListItemIcon sx={{ color: 'inherit' }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default ProviderHeader;
