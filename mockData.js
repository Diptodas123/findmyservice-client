
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

export const MOCK_BOOKINGS = [
    {
        id: 'BK-001',
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah.j@email.com',
        customerPhone: '+1-555-234-5678',
        serviceName: 'General Plumbing',
        serviceId: 's1',
        scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days from now
        scheduledTime: '10:00 AM',
        status: 'pending',
        amount: 150,
        paymentStatus: 'pending',
        address: '45 Oak Street, Metropolis, CA 94016',
        notes: 'Leaking kitchen faucet needs repair',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    },
    {
        id: 'BK-002',
        customerName: 'Michael Chen',
        customerEmail: 'mchen@email.com',
        customerPhone: '+1-555-345-6789',
        serviceName: 'Emergency Repairs',
        serviceId: 's2',
        scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 4).toISOString(), // 4 hours from now
        scheduledTime: '2:00 PM',
        status: 'confirmed',
        amount: 250,
        paymentStatus: 'paid',
        address: '123 Main St, Metropolis, CA 94016',
        notes: 'Urgent: Burst pipe in basement',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    },
    {
        id: 'BK-003',
        customerName: 'Emily Rodriguez',
        customerEmail: 'emily.r@email.com',
        customerPhone: '+1-555-456-7890',
        serviceName: 'Water Heater Installation',
        serviceId: 's3',
        scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        scheduledTime: '9:00 AM',
        status: 'completed',
        amount: 800,
        paymentStatus: 'paid',
        address: '789 Pine Ave, Metropolis, CA 94016',
        notes: 'Replace old water heater with tankless model',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
        id: 'BK-004',
        customerName: 'David Wilson',
        customerEmail: 'dwilson@email.com',
        customerPhone: '+1-555-567-8901',
        serviceName: 'General Plumbing',
        serviceId: 's1',
        scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // yesterday
        scheduledTime: '11:00 AM',
        status: 'cancelled',
        amount: 120,
        paymentStatus: 'refunded',
        address: '321 Elm Road, Metropolis, CA 94016',
        notes: 'Customer rescheduled',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        cancelledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
        id: 'BK-005',
        customerName: 'Lisa Martinez',
        customerEmail: 'lisa.m@email.com',
        customerPhone: '+1-555-678-9012',
        serviceName: 'Emergency Repairs',
        serviceId: 's2',
        scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days from now
        scheduledTime: '3:00 PM',
        status: 'confirmed',
        amount: 200,
        paymentStatus: 'paid',
        address: '567 Maple Drive, Metropolis, CA 94016',
        notes: 'Clogged main drain line',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
        id: 'BK-006',
        customerName: 'James Anderson',
        customerEmail: 'janderson@email.com',
        customerPhone: '+1-555-789-0123',
        serviceName: 'Water Heater Installation',
        serviceId: 's3',
        scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days from now
        scheduledTime: '8:00 AM',
        status: 'pending',
        amount: 750,
        paymentStatus: 'pending',
        address: '890 Birch Lane, Metropolis, CA 94016',
        notes: 'New construction - install water heater',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    },
    {
        id: 'BK-007',
        customerName: 'Patricia Brown',
        customerEmail: 'pbrown@email.com',
        customerPhone: '+1-555-890-1234',
        serviceName: 'General Plumbing',
        serviceId: 's1',
        scheduledDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
        scheduledTime: '1:00 PM',
        status: 'completed',
        amount: 175,
        paymentStatus: 'paid',
        address: '234 Cedar Court, Metropolis, CA 94016',
        notes: 'Fix running toilet and replace flapper',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
    {
        id: 'BK-008',
        customerName: 'Robert Taylor',
        customerEmail: 'rtaylor@email.com',
        customerPhone: '+1-555-901-2345',
        serviceName: 'Emergency Repairs',
        serviceId: 's2',
        scheduledDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1).toISOString(), // tomorrow
        scheduledTime: '4:00 PM',
        status: 'confirmed',
        amount: 300,
        paymentStatus: 'paid',
        address: '678 Willow Way, Metropolis, CA 94016',
        notes: 'Water heater leaking - emergency service',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    },
];

export const MOCK_PROVIDER_REVIEWS = [
    {
        feedbackId: 1,
        userId: { userId: 101, name: 'Alice Johnson', profilePicture: 'https://i.pravatar.cc/150?img=1' },
        serviceId: { serviceId: 's1', serviceName: 'General Plumbing' },
        orderId: { orderId: 'BK-003' },
        comment: 'Excellent service! Very professional and fixed the issue quickly. Highly recommend!',
        rating: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        providerResponse: null
    },
    {
        feedbackId: 2,
        userId: { userId: 102, name: 'Marcus Lee', profilePicture: 'https://i.pravatar.cc/150?img=2' },
        serviceId: { serviceId: 's2', serviceName: 'Emergency Repairs' },
        orderId: { orderId: 'BK-005' },
        comment: 'Good work but arrived a bit late. Overall satisfied with the repair quality.',
        rating: 4,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        providerResponse: 'Thank you for your feedback! We apologize for the delay and appreciate your understanding.'
    },
    {
        feedbackId: 3,
        userId: { userId: 103, name: 'Priya Kapoor', profilePicture: 'https://i.pravatar.cc/150?img=3' },
        serviceId: { serviceId: 's3', serviceName: 'Water Heater Installation' },
        orderId: { orderId: 'BK-007' },
        comment: 'Very knowledgeable and polite. Replaced our old pipes and offered great advice on maintenance.',
        rating: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        providerResponse: 'Thank you so much! We\'re glad we could help you.'
    },
    {
        feedbackId: 4,
        userId: { userId: 104, name: 'Robert Smith', profilePicture: 'https://i.pravatar.cc/150?img=4' },
        serviceId: { serviceId: 's1', serviceName: 'General Plumbing' },
        orderId: { orderId: 'BK-009' },
        comment: 'Average service. Got the job done but expected better communication.',
        rating: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        providerResponse: null
    },
    {
        feedbackId: 5,
        userId: { userId: 105, name: 'Jennifer Brown', profilePicture: 'https://i.pravatar.cc/150?img=5' },
        serviceId: { serviceId: 's2', serviceName: 'Emergency Repairs' },
        orderId: { orderId: 'BK-012' },
        comment: 'Fast response and great work! Saved us from a major water damage issue.',
        rating: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
        providerResponse: null
    },
    {
        feedbackId: 6,
        userId: { userId: 106, name: 'David Wilson', profilePicture: 'https://i.pravatar.cc/150?img=6' },
        serviceId: { serviceId: 's1', serviceName: 'General Plumbing' },
        orderId: { orderId: 'BK-015' },
        comment: 'Not satisfied. Work was done hastily and I had to call another plumber to fix it properly.',
        rating: 2,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
        providerResponse: null
    },
    {
        feedbackId: 7,
        userId: { userId: 107, name: 'Sarah Martinez', profilePicture: 'https://i.pravatar.cc/150?img=7' },
        serviceId: { serviceId: 's3', serviceName: 'Water Heater Installation' },
        orderId: { orderId: 'BK-018' },
        comment: 'Outstanding! Very professional and cleaned up after themselves. Will definitely use again.',
        rating: 5,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
        providerResponse: 'We appreciate your kind words! Looking forward to serving you again.'
    },
    {
        feedbackId: 8,
        userId: { userId: 108, name: 'James Taylor', profilePicture: 'https://i.pravatar.cc/150?img=8' },
        serviceId: { serviceId: 's2', serviceName: 'Emergency Repairs' },
        orderId: { orderId: 'BK-020' },
        comment: 'Decent service but a bit overpriced for what was done.',
        rating: 3,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
        providerResponse: null
    }
];
