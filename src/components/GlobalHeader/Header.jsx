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
    useMediaQuery
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ContactSupportRoundedIcon from '@mui/icons-material/ContactSupportRounded';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import { useThemeMode } from '../../theme/useThemeMode.js';
import SearchIcon from '@mui/icons-material/Search';

const navItems = [
    { label: 'Home', path: '/', Icon: HomeRoundedIcon },
    { label: 'Search', path: '/search', Icon: SearchIcon },
    { label: 'Contact', path: '/contact', Icon: ContactSupportRoundedIcon }
];

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
    const { mode, setMode } = useThemeMode();
    const toggleMode = () => setMode(mode === 'light' ? 'dark' : 'light');

    const [drawerOpen, setDrawerOpen] = useState(false);
    const loggedIn = Boolean(localStorage.getItem('token'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

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
                    <IconButton aria-label="close navigation" onClick={toggleDrawer(false)}>
                        <CloseIcon />
                    </IconButton>
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
                <Button
                    variant="outlined"
                    sx={{ px: "16px", width: "280px" }}
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    fullWidth
                >
                    Logout
                </Button>
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
                                <Button
                                    onClick={handleLogout}
                                    variant="outlined"
                                    color="inherit"
                                    startIcon={<PersonOutlineIcon />}
                                    className="logout-btn auth-btn"
                                >
                                    Logout
                                </Button>
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