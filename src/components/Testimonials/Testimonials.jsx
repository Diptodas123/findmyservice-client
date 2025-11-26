import React from 'react';
import './Testimonials.css';

import { Box, Typography, Grid, Card, CardContent, Avatar, Rating, Stack } from '@mui/material';

const testimonials = [
    {
        quote: 'Great prices and transparent invoicing. Will use again.',
        author: 'Rita K.',
        company: 'City Plumbing',
        rating: 4
    },
    {
        quote: 'Helpful support and vetted pros. My go-to app now.',
        author: 'David L.',
        company: 'Bright Electric',
        rating: 5
    },
    {
        quote: 'Fast response times and friendly technicians.',
        author: 'Sofia M.',
        company: 'A1 Repairs',
        rating: 5
    },
    {
        quote: 'Fantastic service — arrived on time and solved the problem quickly.',
        author: 'Alice P.',
        company: 'HomeFix Co.',
        rating: 5
    },
    {
        quote: 'Easy booking and professional staff. Highly recommended.',
        author: 'Michael S.',
        company: 'Sparkle Cleaners',
        rating: 5
    },

];

const Testimonials = () => {
    return (
        <section className="testimonials-section" style={{ padding: '2rem 1rem' }}>
            <div className="container testimonials-container">
                <Typography variant="h5" component="h2" gutterBottom>What our customers say</Typography>
                <Typography variant="body1" gutterBottom>
                    Hear from our satisfied users who have experienced top-notch services through our platform.
                </Typography>

                <Grid container spacing={2} className="testimonials-grid">
                    {testimonials.map((testimonial, id) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
                            <Card className="testimonial-card" elevation={4}>
                                <CardContent className="testimonial-card-content">
                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                                        <Avatar
                                            className="testimonial-avatar"
                                            sx={{ width: 48, height: 48, fontSize: '0.95rem' }}
                                        >
                                            {testimonial.author.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                        </Avatar>
                                        <Box>
                                            <Typography component="div"
                                                className="testimonial-author"
                                                sx={{ color: 'text.primary' }}
                                            >
                                                {testimonial.author}
                                            </Typography>
                                            {testimonial.company && (
                                                <Typography
                                                    variant="caption"
                                                    className="testimonial-company"
                                                    sx={{ color: 'text.secondary' }}
                                                >
                                                    {testimonial.company}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Stack>
                                    <Typography
                                        variant="body2"
                                        className="testimonial-quote"
                                        sx={{
                                            color: 'text.primary',
                                            fontStyle: 'italic', mb: 1
                                        }}
                                    >
                                        “{testimonial.quote}”
                                    </Typography>
                                    <div className="testimonial-meta" style={{ marginTop: 8 }}>
                                        <Rating name={`rating-${id}`} value={testimonial.rating} readOnly size="small" precision={1} />
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </section>
    );
};

export default Testimonials;
