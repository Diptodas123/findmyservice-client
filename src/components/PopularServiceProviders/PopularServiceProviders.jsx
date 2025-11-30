import { Typography, Box, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ServiceCarousel from '../ServiceCarousel/ServiceCarousel';
import apiClient from '../../utils/apiClient';

const PopularServiceProviders = () => {

    const navigate = useNavigate();
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const defaultImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvwrZoNvnxGJhZy7v_T2fHzrlbF6vMiQ&s';

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/api/v1/providers');
                const providers = response.data || response;

                // Sort by rating (highest first) and take top 10
                const popularProviders = providers
                    .sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
                    .slice(0, 10)
                    .map(provider => ({
                        id: provider.providerId,
                        serviceName: provider.providerName,
                        imageUrl: provider.profilePictureUrl || defaultImageUrl,
                        avgRating: provider.avgRating
                    }));

                setProviders(popularProviders);                
            } catch (error) {
                console.error('Error fetching popular providers:', error);
                setProviders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();
    }, [defaultImageUrl]);

    const handleProviderClick = (provider) => {
        navigate(`/service-providers/${provider.id}`);
    };

    if (!loading && (!providers || providers.length === 0)) return null;

    return (
        <section className="recommended-services" style={{ padding: "2rem 1rem" }}>
            <div className="container">
                <Typography variant="h5" component="h2" gutterBottom>
                    Popular Service Providers
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Explore our top-rated service providers trusted by thousands of users.
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', gap: 2, mt: 3, overflowX: 'hidden' }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                            <Box key={item} sx={{ minWidth: 160, textAlign: 'center' }}>
                                <Skeleton
                                    variant="rectangular"
                                    width={160}
                                    height={160}
                                    sx={{ borderRadius: 2, mb: 1 }}
                                />
                                <Skeleton variant="text" width={120} height={24} sx={{ mx: 'auto' }} />
                            </Box>
                        ))}
                    </Box>
                ) : (
                    <ServiceCarousel
                        items={providers}
                        defaultImage={defaultImageUrl}
                        cardSize={160}
                        visible={4}
                        onItemClick={handleProviderClick}
                    />
                )}
            </div>
        </section>
    );
};

export default PopularServiceProviders;
