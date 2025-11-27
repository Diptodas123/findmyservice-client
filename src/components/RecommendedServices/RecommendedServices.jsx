import { Typography } from '@mui/material';
import ServiceGrid from '../ServiceGrid/ServiceGrid';
import { SAMPLE_SEVICES_FOR_RECOMMENDATION } from '../../../mockData';

const RecommendedServices = () => {

    const defaultImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvwrZoNvnxGJhZgUhZy7v_T2fHzrlbF6vMiQ&s';

    return (
        <section className="recommended-services" style={{ padding: "2rem 1rem" }}>
            <div className="container">
                <Typography variant="h5" component="h2" gutterBottom>
                    User, what services are you looking for today?
                </Typography>
                <ServiceGrid
                    items={SAMPLE_SEVICES_FOR_RECOMMENDATION}
                    defaultImage={defaultImageUrl}
                    cardSize={180}
                />
            </div>
        </section>
    );
};

export default RecommendedServices;
