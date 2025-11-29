import React, { useMemo } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Tooltip
} from '@mui/material';
import {
  List as ListIcon,
  Event as EventIcon,
  Home as HomeIcon,
  RateReview as RateReviewIcon
} from '@mui/icons-material';

const drawerWidth = 260;

const ITEMS = [
  { key: 'home', label: 'Home', Icon: HomeIcon },
  { key: 'services', label: 'Services', Icon: ListIcon },
  { key: 'bookings', label: 'Bookings', Icon: EventIcon },
  { key: 'reviews', label: 'Reviews', Icon: RateReviewIcon }
];

const ProviderSidebar = ({
  value,
  onChange,
  mobileOpen,
  onClose,
  collapsed = false
}) => {
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  const itemButtonSx = (t, center = false) => ({
    justifyContent: center ? 'center' : undefined,
    transition: t.transitions.create(['background-color', 'color'], { duration: 200 }),
    '&.Mui-selected': {
      bgcolor: t.palette.mode === 'light' ? t.palette.action.selected : 'primary.main',
      color: t.palette.mode === 'light' ? 'primary.main' : 'primary.contrastText'
    },
    '&:not(.Mui-selected):hover': {
      bgcolor: t.palette.mode === 'light' ? 'rgba(0,0,0,0.04)' : undefined
    }
  });

  const content = useMemo(() => (
    <Box sx={(t) => ({
      width: collapsed ? 72 : drawerWidth,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: collapsed ? 'center' : 'stretch',
      bgcolor: 'background.paper',
      color: 'text.primary',
      transition: t.transitions.create(['width', 'background-color', 'color'],
        { duration: 250 })
    })}>
      <List sx={{ flex: 1, width: '100%' }}>
        {ITEMS.map(({ key, label, Icon }) => {
          const IconComponent = Icon;
          return collapsed ? (
            <Tooltip key={key}
              title={label}
              placement="right">
              <ListItemButton
                selected={value === key}
                onClick={() => onChange(key)}
                sx={(t) => itemButtonSx(t, true)}
              >
                <ListItemIcon sx={{ minWidth: 'auto', color: 'text.primary' }}>
                  <IconComponent />
                </ListItemIcon>
              </ListItemButton>
            </Tooltip>
          ) : (
            <ListItemButton
              key={key}
              selected={value === key}
              onClick={() => onChange(key)}
              sx={(t) => itemButtonSx(t, false)}
            >
              <ListItemIcon sx={{ color: 'text.primary' }}>
                <IconComponent />
              </ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  ), [collapsed, value, onChange]);

  if (mdUp) {
    return (
      <Drawer variant="permanent" open
        sx={(t) => ({
          '& .MuiDrawer-paper': {
            width: collapsed ? 72 : drawerWidth,
            boxSizing: 'border-box',
            top: '64px',
            overflowX: 'hidden',
            transition: t.transitions.create(['width', 'background-color', 'color'],
              { duration: 250 }),
            bgcolor: 'background.paper',
            color: 'text.primary',
            borderRight: `1px solid ${t.palette.divider}`,
            boxShadow: t.palette.mode === 'light' ? 'none' : undefined
          }
        })}>
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxSizing: 'border-box',
          top: '64px',
          height: `calc(100% - 64px)`,
          overflowY: 'auto'
        }
      }}
    >
      {content}
    </Drawer>
  );
};

export default ProviderSidebar;
