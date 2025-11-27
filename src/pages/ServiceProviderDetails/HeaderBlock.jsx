import {
    Box,
    Avatar,
    Typography,
    Stack,
    Rating,
    Tooltip,
    IconButton
} from '@mui/material';
import {
    Person as PersonIcon,
    Share as ShareIcon,
    LocationOn as LocationOnIcon
} from '@mui/icons-material';

const HeaderBlock = ({ provider, loading, openLightbox, onShare }) => {
    if (loading) return (
        null
    );

    return (
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%' }}
        >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                <Tooltip title="View photos">
                    <Avatar
                        variant="square"
                        src={provider.profilePictureUrl}
                        alt={provider.providerName}
                        sx={{ width: 128, height: 128, borderRadius: 1, cursor: 'pointer' }}
                        onClick={() => openLightbox(0)}
                    />
                </Tooltip>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ mr: 1, color: 'primary.main' }} /> {provider.providerName}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} /> {provider.city}, {provider.state}
                        </Typography>
                    </Stack>
                </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: { xs: 0, sm: 2 } }}>
                <Rating value={provider.avgRating ? Number(provider.avgRating) : 0} readOnly precision={0.1} />
                <Typography variant="body2">{provider.totalRatings} ratings</Typography>
                <Tooltip title="Share provider">
                    <IconButton onClick={onShare} sx={{ ml: 1 }} aria-label="share">
                        <ShareIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
        </Stack>
    );
};

export default HeaderBlock;
