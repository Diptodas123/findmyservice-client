import { Typography } from '@mui/material';
import ServiceGrid from '../ServiceGrid/ServiceGrid';

const sampleServices = [
    { serviceName: 'Home Cleaning' },
    { serviceName: 'Plumbing' },
    { serviceName: 'Electrician' },
    { serviceName: 'AC Repair' },
    { serviceName: 'Car Service' },
    { serviceName: 'Personal Training' },
];

const RecommendedServices = () => {

    const defaultImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvwrZoNvnxGJhZgUhZy7v_T2fHzrlbF6vMiQ&s';

    return (
        <section className="recommended-services" style={{ padding: "2rem 1rem" }}>
            <div className="container">
                <Typography variant="h5" component="h2" gutterBottom>
                    User, what services are you looking for today?
                </Typography>
                <ServiceGrid
                    items={sampleServices}
                    defaultImage={defaultImageUrl}
                    cardSize={180}
                />
            </div>
        </section>
    );
};

export default RecommendedServices;
