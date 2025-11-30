import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ServiceGrid from '../ServiceGrid/ServiceGrid';
import { searchByCategory } from '../../utils/searchNavigation';
import { serviceAPI } from '../../utils/serviceAPI';

const RecommendedServices = () => {

    const navigate = useNavigate();
    const defaultImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvwrZoNvnxGJhZgUhZy7v_T2fHzrlbF6vMiQ&s';
    const [categoryItems, setCategoryItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await serviceAPI.getAllServices();
                
                // Extract unique categories from API data
                const uniqueCategories = Array.from(
                    new Set(
                        data.map(service => service.serviceName?.split(' ')[0])
                    )
                ).filter(Boolean).slice(0, 6);

                const categories = uniqueCategories.map(category => ({
                    serviceName: category,
                    imageUrl: data.find(s => s.serviceName?.startsWith(category))?.imageUrl
                }));

                setCategoryItems(categories);
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handleCategoryClick = (category) => {
        searchByCategory(navigate, category);
    };

    if (loading) {
        return (
            <section className="recommended-services" style={{ padding: "2rem 1rem" }}>
                <div className="container">
                    <Typography variant="h5" component="h2" gutterBottom>
                        User, what services are you looking for today?
                    </Typography>
                    <Typography>Loading services...</Typography>
                </div>
            </section>
        );
    }

    return (
        <section className="recommended-services" style={{ padding: "2rem 1rem" }}>
            <div className="container">
                <Typography variant="h5" component="h2" gutterBottom>
                    User, what services are you looking for today?
                </Typography>
                <ServiceGrid
                    items={categoryItems}
                    defaultImage={defaultImageUrl}
                    cardSize={180}
                    onItemClick={handleCategoryClick}
                />
            </div>
        </section>
    );
};

export default RecommendedServices;
