import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ServiceCarousel from '../ServiceCarousel/ServiceCarousel';
import { MOCK_SEARCH_SERVICES } from '../../../mockData';
import { searchSimilarServices } from '../../utils/searchNavigation';

const PopularServiceProviders = () => {

    const navigate = useNavigate();
    const defaultImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvwrZoNvnxGJhZgUhZy7v_T2fHzrlbF6vMiQ&s';

    // Get top-rated services (rating >= 4.7) as popular providers
    const popularServices = MOCK_SEARCH_SERVICES
        .filter(service => service.avgRating >= 4.7)
        .slice(0, 10)
        .map(service => ({
            id: service.serviceId,
            serviceName: service.providerId?.providerName || service.serviceName,
            imageUrl: service.imageUrl
        }));

    const handleProviderClick = (provider) => {
        // Find the original service to get full details
        const service = MOCK_SEARCH_SERVICES.find(
            s => s.providerId?.providerName === provider.serviceName
        );
        if (service) {
            searchSimilarServices(navigate, service);
        }
    };

    if (!popularServices || popularServices.length === 0) return null;

    return (
        <section className="recommended-services" style={{ padding: "2rem 1rem" }}>
            <div className="container">
                <Typography variant="h5" component="h2" gutterBottom>
                    Popular Service Providers
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Explore our top-rated service providers trusted by thousands of users.
                </Typography>
                <ServiceCarousel
                    items={popularServices}
                    defaultImage={defaultImageUrl}
                    cardSize={160}
                    visible={4}
                    onItemClick={handleProviderClick}
                />
            </div>
        </section>
    );
};

export default PopularServiceProviders;
