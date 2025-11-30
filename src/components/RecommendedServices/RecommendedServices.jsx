import { Typography, Skeleton, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ServiceGrid from '../ServiceGrid/ServiceGrid';
import { searchByCategory } from '../../utils/searchNavigation';
import apiClient from '../../utils/apiClient';

const RecommendedServices = () => {

    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const defaultImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvwrZoNvnxGJhZgUhZy7v_T2fHzrlbF6vMiQ&s';

    // Fetch services and extract categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/api/v1/services');
                const services = response.data || response;
                
                // Extract unique categories from service names
                const uniqueCategories = Array.from(
                    new Set(
                        services.map(service => service.serviceName?.split(' ')[0])
                    )
                ).filter(Boolean).slice(0, 6);

                const categoryItems = uniqueCategories.map(category => ({
                    serviceName: category,
                    imageUrl: services.find(s => s.serviceName?.startsWith(category))?.imageUrl || defaultImageUrl
                }));
                
                setCategories(categoryItems);
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchCategories();
    }, [defaultImageUrl]);

    const handleCategoryClick = (category) => {
        searchByCategory(navigate, category);
    };

    return (
        <section className="recommended-services" style={{ padding: "2rem 1rem" }}>
            <div className="container">
                <Typography variant="h5" component="h2" gutterBottom>
                    User, what services are you looking for today?
                </Typography>
                
                {loading ? (
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <Grid item xs={6} sm={4} md={2} key={item}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Skeleton 
                                        variant="rectangular" 
                                        width={180} 
                                        height={180} 
                                        sx={{ borderRadius: 2, mb: 1 }}
                                    />
                                    <Skeleton variant="text" width={120} height={24} sx={{ mx: 'auto' }} />
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <ServiceGrid
                        items={categories}
                        defaultImage={defaultImageUrl}
                        cardSize={180}
                        onItemClick={handleCategoryClick}
                    />
                )}
            </div>
        </section>
    );
};

export default RecommendedServices;
