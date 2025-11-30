import React, { useState, useEffect, useMemo } from 'react';
import { Box, Container, Toolbar, useTheme, useMediaQuery, ThemeProvider, CssBaseline, Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import ProviderHeader from './ProviderHeader';
import ProviderSidebar from './ProviderSidebar';
import ProviderSetupForm from './ProviderSetupForm';
// ProviderDetails removed; details are shown in ProviderHomeView
import ServicesList from './ServicesList';
import BookingsList from './BookingsList';
import ReviewsManagement from './ReviewsManagement';
import Analytics from './Analytics';
import Reports from './Reports';
import ProviderHomeView from './ProviderHomeView';
import { MOCK_PROVIDER } from '../../../mockData';
import { buildTheme } from '../../theme/theme.js';
import { ThemeModeProvider } from '../../theme/themeModeContext.jsx';

const ProviderDashboard = () => {
    const [view, setView] = useState('home');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [mode, setMode] = useState(() => {
        try {
            return localStorage.getItem('theme') || 'light';
        } catch (err) {
            console.warn('read theme failed', err); return 'light';
        }
    });

    // Get provider from Redux store
    const reduxProvider = useSelector((state) => state.provider.profile);
    const isProfileComplete = useSelector((state) => state.provider.isProfileComplete);

    // Use Redux provider if available, otherwise fallback to mock
    const [provider, setProvider] = useState({ ...MOCK_PROVIDER });

    useEffect(() => {
        if (reduxProvider && reduxProvider.providerId) {
            setProvider({ ...MOCK_PROVIDER, ...reduxProvider });
        }
    }, [reduxProvider]);

    // If profile is not complete, show setup form
    if (!isProfileComplete) {
        return <ProviderSetupForm />;
    }

    const renderView = () => {
        switch (view) {
            case 'home':
                return <Analytics provider={provider} />;
            case 'details':
                return <ProviderHomeView provider={provider} setProvider={setProvider} hideHero onCreateService={() => setView('services')} onViewBookings={() => setView('bookings')} />;
            case 'services':
                return <ServicesList provider={provider} />;
            case 'bookings':
                return <BookingsList provider={provider} />;
            case 'reviews':
                return <ReviewsManagement provider={provider} />;
            case 'reports':
                return <Reports provider={provider} />;
            default:
                return <div>Welcome to the Provider Dashboard</div>;
        }
    };

    const theme = useTheme();
    const mdUp = useMediaQuery(theme.breakpoints.up('md'));
    const drawerWidth = 260;

    useEffect(() => {
        try { localStorage.setItem('theme', mode); } catch (err) { console.warn('persist theme', err); }
    }, [mode]);

    const themeObj = useMemo(() => buildTheme(mode), [mode]);

    const handleToggle = () => {
        if (mdUp) {
            setCollapsed((c) => !c);
        } else {
            setMobileOpen((s) => !s);
        }
    };

    const collapsedWidth = 72;
    const drawerWidthPx = collapsed ? collapsedWidth : drawerWidth;

    return (
        <ThemeModeProvider value={{ mode, setMode }}>
            <ThemeProvider theme={themeObj}>
                <CssBaseline />
                <Box>
                    <ProviderHeader onToggleSidebar={handleToggle} />
                    <Toolbar />
                    <Container maxWidth={false} disableGutters sx={{ display: 'flex', gap: 3, mt: 0, pt: 0 }}>
                        <ProviderSidebar
                            value={view}
                            onChange={setView}
                            mobileOpen={mobileOpen}
                            onClose={() => setMobileOpen(false)}
                            collapsed={collapsed}
                        />
                        <Box sx={(t) => ({
                            flex: 1,
                            p: 3,
                            ml: mdUp ? `${drawerWidthPx}px` : 0,
                            transition: t.transitions.create('margin')
                        })}
                        >
                            {/* shared hero/banner */}
                            <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'visible', mb: 3 }}>
                                <Box component="img" src={provider.imageUrls?.[0] || '/banner.jpg'} alt="banner" sx={{ width: '100%', height: 220, objectFit: 'cover', filter: 'brightness(0.85)' }} />
                                <Box component="div" sx={{ position: 'absolute', left: 24, bottom: 24 }}>
                                    <Avatar src={provider.profilePictureUrl} alt={provider.providerName} sx={{ width: 120, height: 120, border: '4px solid', borderColor: 'background.paper', zIndex: 2, boxShadow: 6 }} />
                                </Box>
                            </Box>
                            {renderView()}
                        </Box>
                    </Container>
                </Box>
            </ThemeProvider>
        </ThemeModeProvider>
    );
};

export default ProviderDashboard;