// Import the PrismaClient
const { PrismaClient } = require('@prisma/client');

// Create an instance of PrismaClient
const prisma = new PrismaClient();

// Define your seed data
const categoriesData = [
    {
        name: 'Telefonlar',
        children: {
            create: [
                {
                    name: 'Android',
                    products: {
                        create: [
                            {
                                name: 'Vestel Venüs z20',
                                picture: 'vestel_venus_z20.jpg',
                            },
                            {
                                name: 'Samsung Galaxy s23',
                                picture: 'samsung_galaxy_s23.jpg',
                            },
                            {
                                name: 'Xiaomi Poco x3 Pro',
                                picture: 'xiaomi_poco_x3_pro.jpg',
                            },
                        ],
                    },
                },
                {
                    name: 'İphone',
                    products: {
                        create: [
                            {
                                name: 'iPhone 13',
                                picture: 'iphone_13.jpg',
                            },
                            {
                                name: 'iPhone 13 Pro',
                                picture: 'iphone_13_pro.jpg',
                            },
                            {
                                name: 'iPhone SE',
                                picture: 'iphone_se.jpg',
                            },
                        ],
                    },
                },
            ],
        },
    },
    {
        name: 'Ev Eşyaları',
        children: {
            create: [
                {
                    name: 'Buzdolabı',
                    products: {
                        create: [
                            {
                                name: 'Vestel Buzdolabı 11211',
                                picture: 'vestel_buzdolabi.jpg',
                            },
                            {
                                name: 'Bosch Buzdolabı 11@s3',
                                picture: 'bosch_buzdolabi.jpg',
                            },
                            {
                                name: 'Vestel Buzdolabı 12313',
                                picture: 'vestel_buzdolabi.jpg',
                            },
                            {
                                name: 'Bosch Buzdolabı 7q@1',
                                picture: 'bosch_buzdolabi.jpg',
                            },
                        ],
                    },
                },
                {
                    name: 'Çamaşır Makinesi',
                    products: {
                        create: [
                            {
                                name: 'Samsung Çamaşır Makinesi 1C23',
                                picture: 'samsung_camasir_makinesi.jpg',
                            },
                            {
                                name: 'Beko Çamaşır Makinesi 11q333',
                                picture: 'beko_camasir_makinesi.jpg',
                            },
                            {
                                name: 'Samsung Çamaşır Makinesi 12312312',
                                picture: 'samsung_camasir_makinesi.jpg',
                            },
                            {
                                name: 'Beko Çamaşır Makinesi 1ZYFX',
                                picture: 'beko_camasir_makinesi.jpg',
                            },
                        ],
                    },
                },
                {
                    name: 'Fırın',
                    products: {
                        create: [
                            {
                                name: 'Beko Fırın 1ZYFX',
                                picture: 'beko_fırın.jpg',
                            },
                            {
                                name: 'Siemens Fırın ACA333',
                                picture: 'siemens_fırın.png',
                            },
                            {
                                name: 'Beko Fırın 1XACCCA',
                                picture: 'beko_fırın.jpg',
                            },
                        ]
                    },
                },
            ],
        },
    },
];

async function seed() {
    for (const categoryData of categoriesData) {
        await prisma.categories.create({
            data: categoryData,
        });
    }
}

seed()
    .catch((error) => {
        console.error(error);
    })
    .finally(async () => {
        console.log('Seeding complete!');
        // Close the PrismaClient connection
        await prisma.$disconnect();
    });


