import { useState } from 'react';
import { Box, Paper, Stack, Typography, Skeleton, Pagination, IconButton } from '@mui/material';
import { LocalOffer as LocalOfferIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';

const ServicesList = ({ services = [], loading, truncate, pageSize: initialPageSize = 4 }) => {
    const [page, setPage] = useState(1);
    const pageSize = initialPageSize;

    if (loading) {
        return (
            <Stack spacing={2}>
                {[1, 2, 3].map((n) => (
                    <Paper key={`skele-${n}`} sx={{ display: 'flex', gap: 2, p: 2, alignItems: 'flex-start' }}>
                        <Skeleton variant="rectangular" width={96} height={72} sx={{ borderRadius: 1 }} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="40%" height={30} />
                            <Skeleton variant="text" width="80%" />
                            <Skeleton variant="text" width="60%" />
                        </Box>
                    </Paper>
                ))}
            </Stack>
        );
    }

    const total = services ? services.length : 0;
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const effectivePage = Math.min(Math.max(1, page), pageCount);
    const visible = services ? services.slice((effectivePage - 1) * pageSize, effectivePage * pageSize) : [];

    return (
        <Stack spacing={2}>
            {visible.map((svc) => (
                <Paper key={svc.id}
                    sx={{
                        display: 'flex',
                        gap: 2,
                        p: 2,
                        alignItems: 'flex-start',
                        transition: 'transform 150ms, box-shadow 150ms',
                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 3, cursor: 'pointer' }
                    }}>
                    <Box
                        component="img"
                        src={svc.imageUrl}
                        alt={svc.name}
                        sx={{
                            width: 96, height: 72, objectFit: 'cover', borderRadius: 1
                        }} />
                    <Box sx={{ flex: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" spacing={1} alignItems="center">
                                <LocalOfferIcon color="primary" />
                                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{svc.name}</Typography>
                            </Stack>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {truncate(svc.description, 140)}
                        </Typography>
                    </Box>
                </Paper>
            ))}

            {pageCount > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mt: 1 }}>
                    <IconButton
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        aria-label="previous page"
                        sx={{
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            color: 'text.primary',
                            boxShadow: 1,
                            '&:hover': { bgcolor: (theme) => theme.palette.action.hover },
                            width: 36,
                            height: 36,
                        }}
                    >
                        <ChevronLeftIcon />
                    </IconButton>

                    <Pagination
                        count={pageCount}
                        page={effectivePage}
                        onChange={(_, v) => setPage(v)}
                        color="primary"
                        size="small"
                    />

                    <IconButton
                        onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                        aria-label="next page"
                        sx={{
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            color: 'text.primary',
                            boxShadow: 1,
                            '&:hover': { bgcolor: (theme) => theme.palette.action.hover },
                            width: 36,
                            height: 36,
                        }}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
            )}
        </Stack>
    );
};

export default ServicesList;
