import { Typography } from '@mui/material';
import ServiceCarousel from '../ServiceCarousel/ServiceCarousel';

const sampleServiceProviders = [
    { id: 1, serviceName: 'Abc Home Cleaning' },
    { id: 2, serviceName: 'Xyz Plumbing Services' },
    { id: 3, serviceName: 'QuickFix Electricians' },
    { id: 4, serviceName: 'CoolAir AC Repair' },
    { id: 5, serviceName: 'AutoCare Car Service' },
    { id: 6, serviceName: 'FitLife Personal Training' },
    { id: 7, serviceName: 'Sparkle Window Cleaning' },
    { id: 8, serviceName: 'BrightFix Handyman' },
    { id: 9, serviceName: 'FreshLook Landscaping' },
    { id: 10, serviceName: 'TechPros IT Support' },
];


const PopularServiceProviders = () => {

    const defaultImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvwrZoNvnxGJhZgUhZy7v_T2fHzrlbF6vMiQ&s';

    if (!sampleServiceProviders || sampleServiceProviders.length === 0) return null;

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
                    items={sampleServiceProviders.slice(0, 10)}
                    defaultImage={defaultImageUrl}
                    cardSize={160}
                    visible={4}
                />
            </div>
        </section>
    );
};

export default PopularServiceProviders;
