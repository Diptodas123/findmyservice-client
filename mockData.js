
export const MOCK_PROVIDER = {
    providerId: 101,
    providerName: 'ProFix Plumbing',
    email: 'contact@profixplumbing.com',
    phone: '+91-98765-43210',
    addressLine1: '123 MG Road',
    addressLine2: 'Near Metro Station',
    city: 'Mumbai',
    state: 'Maharashtra',
    zipCode: '400001',
    createdAt: new Date().toISOString(),
    profilePictureUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeyHKd8ng_bUjfxGTGplWC9kMFLmxqTMDn53Fwk50MRU1fSFAwrd95PNzHLcTpPDCT4kw&usqp=CAU',
    imageUrls: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80&auto=format&fit=crop'
    ],
    services: [
        {
            id: 1,
            name: 'Plumbing Leak Repair',
            description: 'Expert plumbing services for leak detection and repair. Fast response time and guaranteed quality work.',
            imageUrl: 'https://atmosclear.biz/wp-content/uploads/2019/07/Atmosclear-Domestic-Plumbing.jpg',
            price: 1500
        },
        {
            id: 2,
            name: 'Emergency Plumbing',
            description: '24/7 emergency response for burst pipes, gas leaks, and urgent repairs. Certified technicians arrive fast.',
            imageUrl: 'https://micromain.com/wp-content/uploads/Emergency.png',
            price: 2500
        },
        {
            id: 3,
            name: 'Water Heater Installation',
            description: 'Installation and replacement of tank and tankless water heaters with energy-efficient options and warranty.',
            imageUrl: 'https://trusteyman.com/wp-content/uploads/2018/05/Water-heater-installation-dos-and-donts.jpeg',
            price: 8000
        },
        {
            id: 4,
            name: 'Drain Cleaning',
            description: 'Professional drain cleaning services for kitchen, bathroom, and outdoor drains using modern equipment.',
            imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80',
            price: 1200
        }
    ],
    avgRating: 4.8,
    totalRatings: 128,
    description: 'Experienced professional offering reliable plumbing and repair services. Fast response, fair pricing, and a satisfaction guarantee.'
};

// Generate provider details based on serviceId
export const getProviderById = (providerId) => {
    const providerIdNum = Number(providerId);
    
    // Find all services for this provider
    const providerServices = MOCK_SEARCH_SERVICES.filter(
        service => service.providerId?.providerId === providerIdNum
    );
    
    if (providerServices.length === 0) {
        return null;
    }
    
    const firstService = providerServices[0];
    const providerName = firstService.providerId.providerName;
    
    // Calculate average rating
    const avgRating = providerServices.reduce((sum, s) => sum + s.avgRating, 0) / providerServices.length;
    
    return {
        providerId: providerIdNum,
        providerName: providerName,
        email: `contact@${providerName.toLowerCase().replace(/\s+/g, '')}.com`,
        phone: `+91-${98000 + providerIdNum}-${10000 + providerIdNum}`,
        addressLine1: `${providerIdNum} Business Park`,
        addressLine2: 'Commercial Area',
        city: firstService.location,
        state: firstService.location === 'Mumbai' ? 'Maharashtra' : 
               firstService.location === 'Delhi' ? 'Delhi' : 
               firstService.location === 'Bangalore' ? 'Karnataka' : 
               firstService.location === 'Pune' ? 'Maharashtra' : 
               firstService.location === 'Chennai' ? 'Tamil Nadu' : 
               firstService.location === 'Hyderabad' ? 'Telangana' : 
               firstService.location === 'Kolkata' ? 'West Bengal' : 'India',
        zipCode: `${400000 + providerIdNum}`,
        createdAt: new Date(Date.now() - providerIdNum * 24 * 60 * 60 * 1000).toISOString(),
        profilePictureUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeyHKd8ng_bUjfxGTGplWC9kMFLmxqTMDn53Fwk50MRU1fSFAwrd95PNzHLcTpPDCT4kw&usqp=CAU',
        imageUrls: [
            firstService.imageUrl,
            'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80'
        ],
        services: providerServices.map(s => ({
            id: s.serviceId,
            name: s.serviceName,
            description: s.description,
            imageUrl: s.imageUrl,
            price: s.cost
        })),
        avgRating: Number(avgRating.toFixed(1)),
        totalRatings: Math.floor(Math.random() * 100) + 50,
        description: `Professional ${providerName} offering quality services in ${firstService.location}. Experienced team with customer satisfaction guarantee.`
    };
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

// Structured mock reviews for provider dashboard
export const MOCK_PROVIDER_REVIEWS = [
    {
        feedbackId: 2001,
        serviceId: { serviceId: 1, serviceName: 'Plumbing Leak Repair' },
        userId: { userId: 501, name: 'Alice Johnson', profilePicture: 'https://images.unsplash.com/photo-1545996124-1b7a1f6a7f5c?w=200&q=80&auto=format&fit=crop' },
        orderId: { orderId: 9001 },
        comment: 'Quick, professional and reasonably priced. Fixed my leaky sink the same day.',
        rating: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        providerResponse: 'Thanks Alice — glad we could help!'
    },
    {
        feedbackId: 2002,
        serviceId: { serviceId: 2, serviceName: 'Emergency Plumbing' },
        userId: { userId: 502, name: 'Marcus Lee', profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format&fit=crop' },
        comment: 'Good work but arrived a bit late. Overall satisfied with the repair.',
        rating: 4,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    },
    {
        feedbackId: 2003,
        serviceId: { serviceId: 3, serviceName: 'Water Heater Installation' },
        userId: { userId: 503, name: 'Priya Kapoor', profilePicture: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80&auto=format&fit=crop' },
        comment: 'Very knowledgeable and polite. Replaced our old pipes and offered great advice.',
        rating: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 70).toISOString(),
    }
];

export const MOCK_BOOKINGS = [
    {
        id: 'BKG-1001',
        customerName: 'Ravi Sharma',
        customerEmail: 'ravi.sharma@example.com',
        customerPhone: '+91-91234-56789',
        serviceName: 'Plumbing Leak Repair',
        scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
        scheduledTime: '10:00 AM',
        amount: 1500,
        status: 'pending',
        paymentStatus: 'pending',
        address: 'Flat 4B, 56 Palm Street, Mumbai',
        notes: 'Please call upon arrival.',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'BKG-1002',
        customerName: 'Sneha Patel',
        customerEmail: 'sneha.patel@example.com',
        customerPhone: '+91-99876-54321',
        serviceName: 'Water Heater Installation',
        scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        scheduledTime: '2:30 PM',
        amount: 8000,
        status: 'confirmed',
        paymentStatus: 'pending',
        address: '22 Lotus Apartments, Pune',
        notes: '',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    },
    {
        id: 'BKG-1003',
        customerName: 'Arjun Verma',
        customerEmail: 'arjun.verma@example.com',
        customerPhone: '+91-90123-45678',
        serviceName: 'Drain Cleaning',
        scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
        scheduledTime: '9:00 AM',
        amount: 1200,
        status: 'completed',
        paymentStatus: 'paid',
        address: '10 Green Lane, Chennai',
        notes: 'Customer satisfied with service.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 29).toISOString(),
    },
    {
        id: 'BKG-1004',
        customerName: 'Priya Singh',
        customerEmail: 'priya.singh@example.com',
        customerPhone: '+91-98765-43210',
        serviceName: 'Emergency Plumbing',
        scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        scheduledTime: '11:15 AM',
        amount: 2500,
        status: 'cancelled',
        paymentStatus: 'refunded',
        address: '5 Rose Street, Delhi',
        notes: 'Customer cancelled due to schedule conflict.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
        cancelledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
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

// Mock data for search page services
export const MOCK_SEARCH_SERVICES = [
    {
        serviceId: 1,
        serviceName: 'Plumbing Leak Repair',
        description: 'Expert plumbing services for leak detection and repair. Fast response time and guaranteed quality work.',
        cost: 1500,
        avgRating: 4.8,
        location: 'Mumbai',
        availability: 'Available',
        active: true,
        imageUrl: 'https://atmosclear.biz/wp-content/uploads/2019/07/Atmosclear-Domestic-Plumbing.jpg',
        providerId: {
            providerId: 101,
            providerName: 'ProFix Plumbing'
        }
    },
    {
        serviceId: 2,
        serviceName: 'Plumbing Installation',
        description: 'Complete plumbing installation for new homes and renovations. Licensed and experienced professionals.',
        cost: 5000,
        avgRating: 4.9,
        location: 'Delhi',
        availability: 'Available',
        active: true,
        imageUrl: 'https://micromain.com/wp-content/uploads/Emergency.png',
        providerId: {
            providerId: 102,
            providerName: 'Elite Plumbing Services'
        }
    },
    {
        serviceId: 3,
        serviceName: 'Electrician Wiring Services',
        description: 'Professional electrical wiring for residential and commercial properties. Safety certified.',
        cost: 2000,
        avgRating: 4.7,
        location: 'Bangalore',
        availability: 'Available',
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
        providerId: {
            providerId: 103,
            providerName: 'Bright Electric Co.'
        }
    },
    {
        serviceId: 4,
        serviceName: 'Electrician Panel Upgrade',
        description: 'Electrical panel upgrades and circuit breaker installation. Modern and safe solutions.',
        cost: 8000,
        avgRating: 5.0,
        location: 'Mumbai',
        availability: 'Available',
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
        providerId: {
            providerId: 104,
            providerName: 'PowerTech Electricians'
        }
    },
    {
        serviceId: 5,
        serviceName: 'Cleaning Deep Home Cleaning',
        description: 'Thorough deep cleaning service for your entire home. Eco-friendly products used.',
        cost: 2500,
        avgRating: 4.6,
        location: 'Pune',
        availability: 'Not Available',
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
        providerId: {
            providerId: 105,
            providerName: 'Sparkle Clean Co.'
        }
    },
    {
        serviceId: 6,
        serviceName: 'Cleaning Office Maintenance',
        description: 'Regular office cleaning and maintenance services. Flexible scheduling available.',
        cost: 1800,
        avgRating: 4.5,
        location: 'Bangalore',
        availability: 'Available',
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&q=80',
        providerId: {
            providerId: 106,
            providerName: 'Professional Cleaners Inc.'
        }
    },
    {
        serviceId: 7,
        serviceName: 'Carpentry Custom Furniture',
        description: 'Custom-made furniture designed and built to your specifications. Quality craftsmanship.',
        cost: 12000,
        avgRating: 4.9,
        location: 'Delhi',
        availability: 'Available',
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=800&q=80',
        providerId: {
            providerId: 107,
            providerName: 'Master Woodworks'
        }
    },
    {
        serviceId: 8,
        serviceName: 'Carpentry Cabinet Installation',
        description: 'Professional cabinet installation for kitchens and bathrooms. Precise measurements and fitting.',
        cost: 6000,
        avgRating: 4.8,
        location: 'Mumbai',
        availability: 'Available',
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800&q=80',
        providerId: {
            providerId: 108,
            providerName: 'Cabinet Masters'
        }
    },
    {
        serviceId: 9,
        serviceName: 'Painting Interior Painting',
        description: 'Professional interior painting services with premium paints. Clean and efficient work.',
        cost: 4000,
        avgRating: 4.7,
        location: 'Pune',
        availability: 'Not Available',
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
        providerId: {
            providerId: 109,
            providerName: 'Color Perfect Painters'
        }
    },
    {
        serviceId: 10,
        serviceName: 'Painting Exterior Services',
        description: 'Exterior painting and weatherproofing. Durable finishes for monsoon protection.',
        cost: 9000,
        avgRating: 4.6,
        location: 'Bangalore',
        availability: 'Available',
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&q=80',
        providerId: {
            providerId: 110,
            providerName: 'Outdoor Paint Pros'
        }
    },
    {
        serviceId: 11,
        serviceName: 'AC Air Conditioning Repair',
        description: '24/7 AC repair services. Quick diagnosis and repair for all major brands.',
        cost: 3000,
        avgRating: 4.8,
        location: 'Chennai',
        availability: 'Available',
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80',
        providerId: {
            providerId: 111,
            providerName: 'CoolAir Services'
        }
    },
    {
        serviceId: 12,
        serviceName: 'AC Installation',
        description: 'Complete AC installation with warranty. Energy-efficient options available.',
        cost: 25000,
        avgRating: 5.0,
        location: 'Hyderabad',
        availability: 'Available',
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1635274531355-74f1b53e7c6d?w=800&q=80',
        providerId: {
            providerId: 112,
            providerName: 'CoolHome AC Solutions'
        }
    },
    {
        serviceId: 13,
        serviceName: 'Gardening Lawn Care',
        description: 'Regular lawn maintenance including mowing, edging, and fertilization.',
        cost: 1200,
        avgRating: 4.4,
        location: 'Pune',
        availability: 'Not Available',
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80',
        providerId: {
            providerId: 113,
            providerName: 'GreenScape Gardening'
        }
    },
    {
        serviceId: 14,
        serviceName: 'Gardening Landscape Design',
        description: 'Professional landscape design and installation. Transform your outdoor space.',
        cost: 15000,
        avgRating: 4.9,
        location: 'Bangalore',
        availability: 'Available',
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80',
        providerId: {
            providerId: 114,
            providerName: 'Dream Gardens Ltd.'
        }
    },
    {
        serviceId: 15,
        serviceName: 'Roofing Repair Services',
        description: 'Emergency and scheduled roof repairs. Waterproofing for monsoon season.',
        cost: 7000,
        avgRating: 4.7,
        location: 'Chennai',
        availability: 'Available',
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800&q=80',
        providerId: {
            providerId: 115,
            providerName: 'TopCover Roofing'
        }
    },
    {
        serviceId: 16,
        serviceName: 'Roofing Installation',
        description: 'Complete roof replacement and new installations. Warranty included.',
        cost: 50000,
        avgRating: 4.8,
        location: 'Mumbai',
        availability: 'Available',
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1590642916589-592bca10dfbf?w=800&q=80',
        providerId: {
            providerId: 116,
            providerName: 'Premium Roofing Solutions'
        }
    },
    {
        serviceId: 17,
        serviceName: 'Locksmith Emergency Services',
        description: '24/7 emergency lockout service. Fast response time guaranteed.',
        cost: 1000,
        avgRating: 4.6,
        location: 'Kolkata',
        availability: 'Not Available',
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        providerId: {
            providerId: 117,
            providerName: 'QuickKey Locksmiths'
        }
    },
    {
        serviceId: 18,
        serviceName: 'Locksmith Security Installation',
        description: 'Advanced security system installation including smart locks and cameras.',
        cost: 4500,
        avgRating: 4.9,
        location: 'Hyderabad',
        availability: 'Available',
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80',
        providerId: {
            providerId: 118,
            providerName: 'SecureHome Systems'
        }
    },
    {
        serviceId: 19,
        serviceName: 'Appliance Refrigerator Repair',
        description: 'Expert refrigerator repair services. All brands and models serviced.',
        cost: 1800,
        avgRating: 4.5,
        location: 'Delhi',
        availability: 'Available',
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80',
        providerId: {
            providerId: 119,
            providerName: 'FixIt Appliance Repair'
        }
    },
    {
        serviceId: 20,
        serviceName: 'Appliance Washing Machine Service',
        description: 'Washing machine repair and maintenance. Same-day service available.',
        cost: 1500,
        avgRating: 4.7,
        location: 'Chennai',
        availability: 'Available',
        active: true,
        imageUrl: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&q=80',
        providerId: {
            providerId: 120,
            providerName: 'Home Appliance Experts'
        }
    }
];