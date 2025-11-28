import React from 'react';
import { Paper, Stack, Avatar, Tooltip, Box, Typography, Rating, Button } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

const ReviewsList = ({ reviews = [], expandedReviewIds = [], toggleExpand }) => {

    return (
        <Stack spacing={2}>
                {reviews.map((review, id) => (
                <Paper key={id} sx={{ p: 2 }} elevation={0}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Tooltip title={`View ${review.user} profile`}>
                            <Avatar src={review.image} alt={review.user} sx={{ width: 56, height: 56, cursor: 'pointer' }} />
                        </Tooltip>
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
