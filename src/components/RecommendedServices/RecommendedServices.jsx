import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ServiceGrid from '../ServiceGrid/ServiceGrid';
import { MOCK_SEARCH_SERVICES } from '../../../mockData';
import { searchByCategory } from '../../utils/searchNavigation';

const RecommendedServices = () => {

    const navigate = useNavigate();
    const defaultImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvwrZoNvnxGJhZgUhZy7v_T2fHzrlbF6vMiQ&s';

    // Extract unique categories from mock data
    const uniqueCategories = Array.from(
        new Set(
            MOCK_SEARCH_SERVICES.map(service => service.serviceName?.split(' ')[0])
        )
    ).filter(Boolean).slice(0, 6);

    const categoryItems = uniqueCategories.map(category => ({
        serviceName: category,
        imageUrl: MOCK_SEARCH_SERVICES.find(s => s.serviceName?.startsWith(category))?.imageUrl
    }));

    const handleCategoryClick = (category) => {
        searchByCategory(navigate, category);
    };

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
