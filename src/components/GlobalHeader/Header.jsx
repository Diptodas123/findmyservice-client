import { useState } from 'react';
import './Header.css';
import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Divider,
    useMediaQuery,
    Avatar,
    Typography
} from '@mui/material';
import {
    Menu as MenuIcon,
    HomeRounded as HomeRoundedIcon,
    ContactSupportRounded as ContactSupportRoundedIcon,
    Close as CloseIcon,
    PersonOutline as PersonOutlineIcon,
    LightModeOutlined as LightModeOutlinedIcon,
    DarkModeOutlined as DarkModeOutlinedIcon,
    ShoppingCartRounded as ShoppingCartRoundedIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { useThemeMode } from '../../theme/useThemeMode.js';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';

const navItems = [
    { label: 'Home', path: '/', Icon: HomeRoundedIcon },
    { label: 'Search', path: '/search', Icon: SearchIcon },
    { label: 'Contact', path: '/contact', Icon: ContactSupportRoundedIcon }
];

const Header = () => {
    const location = useLocation();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
    const { mode, setMode } = useThemeMode();
    const toggleMode = () => setMode(mode === 'light' ? 'dark' : 'light');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const user = useSelector((s) => s.user?.profile || null);
    const userName = user?.name;
    const cartCount = useSelector((s) => (s.cart?.items || []).length || 0);
    const loggedIn = Boolean(localStorage.getItem('token')) || Boolean(userName);

    const toggleDrawer = (open) => () => setDrawerOpen(open);

    const drawerContent = (
        <Box
            role="presentation"
            onKeyDown={toggleDrawer(false)}>
            <Box className="drawer-header" sx={{ width: "100%" }}>
                <Box
                    component={Link}
                    to="/"
                    aria-label="FindMyService home"
                    className="drawer-logo-wrapper"
                    onClick={toggleDrawer(false)}
                    sx={{ width: '100%' }}
                >
                    <img
                        src="/brand-logo.png"
                        alt="FindMyService logo"
                        className="drawer-logo-img"
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <IconButton aria-label="close navigation" onClick={toggleDrawer(false)}>
                            <CloseIcon />
                        </IconButton>
                        {user && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 1 }}>
                                <Avatar src={user.profilePictureUrl || undefined} sx={{ width: 44, height: 44 }}>
                                    {!user.profilePictureUrl && (user.name || 'U')[0]}
                                </Avatar>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography sx={{ fontWeight: 700 }}>{user.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">View Profile</Typography>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Box>
            <Divider />
            <List className="drawer-nav">
                {navItems.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <ListItem disablePadding key={item.path}>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                onClick={toggleDrawer(false)}
                                className={active ? 'active' : ''}
                            >
                                <ListItemIcon className="list-icon">
                                    <item.Icon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
            {!loggedIn ? (
                <Box
                    className="drawer-auth"
                    sx={{
                        px: "16px",
                        width: "280px"
                    }}
                >
                    <Button
                        variant="contained"
                        fullWidth
                        component={Link}
                        to="/login">
                        Login / Sign Up
                    </Button>
                </Box>
            ) : (
                <List>
                    <ListItem disablePadding>
                        <ListItemButton
                            component={Link}
                            to="/profile"
                            onClick={toggleDrawer(false)}
                        >
                            <ListItemIcon className="list-icon">
                                <PersonOutlineIcon />
                            </ListItemIcon>
                            <ListItemText primary="Profile" />
                        </ListItemButton>
                    </ListItem>
                </List>
            )}
            <Box
                component={Link}
                to="/cart"
                className="cart-container"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                    pt: 2
                }}
            >
                <ShoppingCartRoundedIcon className="nav-icon" />
                <span className="cart-label">Cart</span>
            </Box>
            <Box sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'center'
            }}>
                <IconButton
                    color="inherit"
                    onClick={toggleMode}
                    aria-label="toggle color mode">
                    {mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
                </IconButton>
            </Box>
        </Box>
    );

    return (
        <>
            <AppBar position="fixed" elevation={0} className="header-appbar">
                <Toolbar className="header-toolbar">
                    {!isMdUp && (
                        <IconButton
                            edge="start"
                            aria-label="open navigation"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Box className="brand-nav-group">
                        <Box
                            component={Link}
                            to="/"
                            aria-label="FindMyService home"
                            className="brand-logo-link"
                            sx={{ display: 'flex', alignItems: 'center' }}
                        >
                            <img
                                src="/brand-logo.png"
                                alt="FindMyService logo"
                                className="brand-logo-img"
                            />
                        </Box>
                    </Box>
                    <Box className="flex-spacer" />
                    {isMdUp && (
                        <Box className="options-group">
                            {navItems.map((item) => {
                                const active = location.pathname === item.path;
                                return (
                                    <Button
                                        key={item.path}
                                        component={Link}
                                        to={item.path}
                                        color={active ? 'secondary' : 'inherit'}
                                        className={`nav-button ${active ? 'active' : ''}`}
                                    >
                                        <item.Icon className="nav-icon" />
                                        {item.label}
                                    </Button>
                                );
                            })}
                            <IconButton
                                color="inherit"
                                onClick={toggleMode}
                                aria-label="toggle color mode"
                                className="mode-toggle"
                            >
                                {mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
                            </IconButton>
                            {!loggedIn ? (
                                <Button
                                    component={Link}
                                    to="/login"
                                    color="secondary"
                                    variant="contained"
                                    className="auth-btn"
                                >
                                    Login / Sign Up
                                </Button>
                            ) : (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <IconButton component={Link} to="/profile" aria-label="profile" sx={{ p: 0 }}>
                                        <Avatar src={user?.profilePictureUrl || undefined} sx={{ width: 40, height: 40 }}>
                                            {!user?.profilePictureUrl && (user?.name || 'U')[0]}
                                        </Avatar>
                                    </IconButton>
                                </Box>
                            )}
                            <Box
                                component={Link}
                                to="/cart"
                                className={`cart-container ${location.pathname === '/cart' ? 'active' : ''}`}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    textDecoration: 'none'
                                }}
                            >
                                <ShoppingCartRoundedIcon className="nav-icon" />
                                <span className="cart-label">Cart</span>
                                {cartCount > 0 && (
                                    <Box component="span" sx={{ ml: 1, bgcolor: 'secondary.main', color: 'common.white', px: .75, py: .25, borderRadius: 1, fontSize: 12 }}>{cartCount}</Box>
                                )}
                            </Box>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawerContent}
            </Drawer>

        </>
    );
};

export default Header;