
export const MOCK_PROVIDER = {
    providerId: 12345,
    providerName: 'ABC Services',
    email: 'john.doe@example.com',
    phone: '+1-555-123-4567',
    addressLine1: '12 Baker Street',
    addressLine2: 'Suite 4B',
    city: 'Metropolis',
    state: 'CA',
    zipCode: '94016',
    createdAt: new Date().toISOString(),
    profilePictureUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeyHKd8ng_bUjfxGTGplWC9kMFLmxqTMDn53Fwk50MRU1fSFAwrd95PNzHLcTpPDCT4kw&usqp=CAU',
    imageUrls: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80&auto=format&fit=crop'
    ],
    services: [
        {
            id: 's1',
            name: 'General Plumbing',
            description: 'Full-service plumbing including drains, taps, installations and preventative maintenance. We handle both residential and commercial jobs with quick turnarounds and transparent pricing.',
            imageUrl: 'https://atmosclear.biz/wp-content/uploads/2019/07/Atmosclear-Domestic-Plumbing.jpg'
        },
        {
            id: 's2',
            name: 'Emergency Repairs',
            description: '24/7 emergency response for burst pipes, gas leaks, and urgent repairs. Certified technicians arrive fast and secure the issue to prevent further damage.',
            imageUrl: 'https://micromain.com/wp-content/uploads/Emergency.png'
        },
        {
            id: 's3',
            name: 'Water Heater Installation',
            description: 'Installation and replacement of tank and tankless water heaters with energy-efficient options and warranty-backed workmanship.',
            imageUrl: 'https://trusteyman.com/wp-content/uploads/2018/05/Water-heater-installation-dos-and-donts.jpeg'
        }
    ],
    avgRating: 4.6,
    totalRatings: 128,
    description: 'Experienced professional offering reliable plumbing and repair services. Fast response, fair pricing, and a satisfaction guarantee.'
};

export const MOCK_REVIEWS = [
    {
        id: 1,
        user: 'Alice Johnson',
        comment: 'Quick, professional and reasonably priced. Fixed my leaky sink the same day.',
        rating: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        image: 'https://images.unsplash.com/photo-1545996124-1b7a1f6a7f5c?w=200&q=80&auto=format&fit=crop'
    },
    {
        id: 2,
        user: 'Marcus Lee',
        comment: 'Good work but arrived a bit late. Overall satisfied with the repair.',
        rating: 4,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format&fit=crop'
    },
    {
        id: 3,
        user: 'Priya Kapoor',
        comment: 'Very knowledgeable and polite. Replaced our old pipes and offered great advice.',
        rating: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 70).toISOString(),
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80&auto=format&fit=crop'
    }
]; 

export const SAMPLE_SEVICES_FOR_RECOMMENDATION = [
    { serviceName: 'Home Cleaning' },
    { serviceName: 'Plumbing' },
    { serviceName: 'Electrician' },
    { serviceName: 'AC Repair' },
    { serviceName: 'Car Service' },
    { serviceName: 'Personal Training' },
];

export const SAMPLE_SERVICE_PROVIDERS = [
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
