
import "./GlobalFooter.css";
import {
    ArrowUpward,
    ContactEmergency,
    Email,
    Facebook,
    Handshake,
    Instagram,
    LocationOn,
    Phone,
    X,
    YouTube
} from "@mui/icons-material";
import {
    Box,
    Grid,
    Typography,
    Stack,
    Divider,
    Link as MuiLink,
    useTheme
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HelpIcon from '@mui/icons-material/Help';
import HomeIcon from '@mui/icons-material/Home';
import { Link } from "react-router-dom";

const GlobalFooter = () => {
    const theme = useTheme();
    const isLight = theme.palette.mode === 'light';
    const footerTextPrimary = isLight ? 'common.white' : 'text.primary';
    const footerTextSecondary = isLight ? 'grey.300' : 'text.secondary';

    const backToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <Box
            component="footer"
            sx={{
                bgcolor: isLight ? '#0f172a' : 'background.paper',
                color: isLight ? 'common.white' : 'text.primary',
                borderTop: `1px solid ${theme.palette.divider}`,
                mt: 6
            }}>
            <Box
                sx={{
                    cursor: 'pointer',
                    textAlign: 'center',
                    py: 1.5,
                    bgcolor: isLight ? 'info.main' : 'secondary.main',
                    '&:hover': { opacity: 0.95 }
                }}
                onClick={backToTop}
            >
                <Typography
                    variant="body2"
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        color: isLight ? 'common.white' : 'secondary.contrastText',
                        fontWeight: 600
                    }}>
                    <ArrowUpward fontSize="small" /> Back to top
                </Typography>
            </Box>

            <Box sx={{ maxWidth: 1100, mx: 'auto', px: 3, py: 5 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Stack spacing={1}>
                            <Box component="img"
                                src="/brand-logo.png"
                                alt="FindMyService"
                                sx={{ height: 48, width: 'auto' }}
                            />
                            <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                                <MuiLink
                                    href="https://www.facebook.com"
                                    target="_blank"
                                    rel="noopener"
                                    color="inherit"
                                    sx={{ bgcolor: 'action.hover', p: .5, borderRadius: 1 }}>
                                    <Facebook />
                                </MuiLink>
                                <MuiLink
                                    href="https://www.instagram.com"
                                    target="_blank"
                                    rel="noopener"
                                    color="inherit"
                                    sx={{ bgcolor: 'action.hover', p: .5, borderRadius: 1 }}>
                                    <Instagram />
                                </MuiLink>
                                <MuiLink
                                    href="https://www.twitter.com"
                                    target="_blank"
                                    rel="noopener"
                                    color="inherit"
                                    sx={{ bgcolor: 'action.hover', p: .5, borderRadius: 1 }}
                                >
                                    <X />
                                </MuiLink>
                                <MuiLink
                                    href="https://www.youtube.com"
                                    target="_blank"
                                    rel="noopener"
                                    color="inherit"
                                    sx={{ bgcolor: 'action.hover', p: .5, borderRadius: 1 }}
                                >
                                    <YouTube />
                                </MuiLink>
                            </Stack>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} md={2}>
                        <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700, mb: 1, color: footerTextPrimary }}
                        >
                            Quick Links
                        </Typography>
                        <Stack spacing={1}>
                            <MuiLink
                                component={Link}
                                to="/" color="inherit"
                                underline="none"
                            >
                                <HomeIcon fontSize="small" sx={{ mr: .5 }} />
                                Home
                            </MuiLink>
                            <MuiLink
                                component={Link}
                                to="/help"
                                color="inherit"
                                underline="none"
                            >
                                <HelpIcon fontSize="small" sx={{ mr: .5 }} />
                                Help
                            </MuiLink>
                            <MuiLink
                                component={Link}
                                to="/cart"
                                color="inherit"
                                underline="none">
                                <ShoppingCartIcon fontSize="small" sx={{ mr: .5 }} />
                                Cart
                            </MuiLink>
                        </Stack>
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700, mb: 1, color: footerTextPrimary }}
                        >
                            Company
                        </Typography>
                        <Stack spacing={1}>
                            <MuiLink
                                component={Link}
                                to="/about" color="inherit"
                                underline="none"
                            >
                                <InfoIcon fontSize="small" sx={{ mr: .5 }} />
                                About
                            </MuiLink>
                            <MuiLink component={Link}
                                to="/contact" color="inherit"
                                underline="none"
                            >
                                <ContactEmergency fontSize="small" sx={{ mr: .5 }} />
                                Contact
                            </MuiLink>
                            <MuiLink component={Link}
                                to="/partner-with-us"
                                color="inherit"
                                underline="none"
                            >
                                <Handshake fontSize="small" sx={{ mr: .5 }} />
                                Partner with us
                            </MuiLink>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700, mb: 1, color: footerTextPrimary }}
                        >
                            Contact
                        </Typography>
                        <Stack spacing={1}>
                            <Typography
                                variant="body2"
                                sx={{ color: footerTextSecondary }}
                            >
                                <LocationOn fontSize="small" sx={{ mr: .5 }} />
                                12/3, M.G. Road, Kolkata
                            </Typography>
                            <MuiLink href="tel:+916234567890"
                                color="inherit" underline="none">
                                <Phone fontSize="small" sx={{ mr: .5 }} />
                                +91 6234567890
                            </MuiLink>
                            <MuiLink href="mailto:info@findmyservice.com"
                                color="inherit"
                                underline="none"
                            >
                                <Email fontSize="small" sx={{ mr: .5 }} />
                                info@findmyservice.com
                            </MuiLink>
                        </Stack>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />

                <Box sx={{ textAlign: 'center' }}>
                    <Typography
                        variant="caption"
                        sx={{ color: footerTextSecondary, opacity: 0.9 }}
                    >
                        © {new Date().getFullYear()} FindMyService — All rights reserved.
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}

export default GlobalFooter;