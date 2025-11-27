import {
    Paper,
    Stack,
    Typography,
    Button,
    Divider,
    Chip
} from '@mui/material';
import {
    Contacts as ContactsIcon,
    CalendarToday as CalendarTodayIcon,
    Phone as PhoneIcon,
    Email as EmailIcon
} from '@mui/icons-material';

const ContactCard = ({ provider, loading, onCall, onEmail }) => {
    return (
        <Paper sx={{ p: 3 }} elevation={3}>
            {loading ? (
                <Stack spacing={1}>
                    <Typography variant="body2">&nbsp;</Typography>
                </Stack>
            ) : (
                <Stack spacing={2}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        <ContactsIcon sx={{ mr: 1, color: 'primary.main' }} /> Contact Information
                    </Typography>
                    <Typography variant="body2">{provider.addressLine1}{provider.addressLine2 ? `, ${provider.addressLine2}` : ''}</Typography>
                    <Typography variant="body2">{provider.city}, {provider.state} {provider.zipCode}</Typography>
                    <Button
                        startIcon={<PhoneIcon />}
                        variant="contained"
                        onClick={onCall}
                        fullWidth
                        sx={(theme) => ({
                            backgroundColor: theme.palette.secondary.main,
                            color: theme.palette.getContrastText(theme.palette.secondary.main),
                            '&:hover': {
                                backgroundColor: theme.palette.secondary.dark
                            },
                            '& .MuiButton-startIcon': {
                                color: theme.palette.getContrastText(theme.palette.secondary.main)
                            }
                        })}
                    >Call {provider.phone}
                    </Button>
                    <Button
                        startIcon={<EmailIcon />}
                        variant="outlined"
                        onClick={onEmail}
                        fullWidth sx={(theme) => (
                            {
                                ...(theme.palette.mode === 'dark' ?
                                    {
                                        border: `2px solid rgba(255,255,255,0.12)`,
                                        color: theme.palette.text.primary,
                                        backgroundColor: 'transparent', px: 2.5, py: 1.05,
                                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' },
                                        '& .MuiButton-startIcon': { color: theme.palette.text.primary }
                                    } : {}),
                            })}>
                        Enquire via Email
                    </Button>
                    <Divider />
                    <Stack direction="row" spacing={1}>
                        <Chip icon={<ContactsIcon />} label={`Provider ID: ${provider.providerId}`} />
                        <Chip icon={<CalendarTodayIcon />} label={`Joined: ${new Date(provider.createdAt).toLocaleDateString()}`} />
                    </Stack>
                </Stack>
            )}
        </Paper>
    );
};

export default ContactCard;
