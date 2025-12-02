import React from 'react';
import { Paper, Stack, Avatar, Box, Typography, Rating, Button } from '@mui/material';
import { Person as PersonIcon, RateReview } from '@mui/icons-material';

const ReviewsList = ({ reviews = [], expandedReviewIds = [], toggleExpand }) => {
    if (!reviews || reviews.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 6,
                    textAlign: 'center',
                    bgcolor: 'grey.50',
                    borderRadius: 2
                }}
            >
                <RateReview sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Reviews Yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Be the first to share your experience with this service provider!
                </Typography>
            </Paper>
        );
    }

    return (
        <Stack spacing={2}>
            {reviews.map((review, id) => (
                <Paper key={id} sx={{ p: 2 }} elevation={0}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Avatar src={review.image} alt={review.user} sx={{ width: 56, height: 56 }} />
                        <Box sx={{ flex: 1 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                                        <PersonIcon sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} /> {review.user}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">{new Date(review.createdAt).toLocaleDateString()}</Typography>
                                </Box>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Rating value={review.rating} readOnly size="small" />
                                </Stack>
                            </Stack>
                            <Typography variant="body2" color="text.primary"
                                sx={{ mt: 1, maxHeight: expandedReviewIds.includes(id) ? 'none' : 72, overflow: 'hidden', position: 'relative' }}
                            >{review.comment}
                            </Typography>
                            {review.comment.length > 180 && (
                                <Button size="small" onClick={() => toggleExpand(id)}>
                                    {expandedReviewIds.includes(id) ? 'Show less' : 'Read more'}
                                </Button>
                            )}
                        </Box>
                    </Stack>
                </Paper>
            ))}
        </Stack>
    );
};

export default ReviewsList;
