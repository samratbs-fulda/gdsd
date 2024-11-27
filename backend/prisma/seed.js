require("dotenv").config({ path: ".env.local" });

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Reset the database
  console.log("Resetting database...");
  await prisma.listing.deleteMany();

  // Populate the database
  console.log("Seeding database...");
  const listings = [
    { name: 'Apartment A', postcode: '10001', apartment_type: 'single apartment', rent: 1200.5 },
    { name: 'Apartment B', postcode: '10002', apartment_type: 'shared apartment', rent: 750.0 },
    { name: 'Apartment C', postcode: '10003', apartment_type: 'sublet', rent: 950.0 },
    { name: 'Apartment D', postcode: '10004', apartment_type: 'single apartment', rent: 1400.0 },
    { name: 'Apartment E', postcode: '10005', apartment_type: 'shared apartment', rent: 800.0 },
    { name: 'Apartment F', postcode: '10006', apartment_type: 'sublet', rent: 1000.0 },
    { name: 'Apartment G', postcode: '10007', apartment_type: 'single apartment', rent: 1250.0 },
    { name: 'Apartment H', postcode: '10008', apartment_type: 'shared apartment', rent: 850.0 },
    { name: 'Apartment I', postcode: '10009', apartment_type: 'sublet', rent: 1100.0 },
    { name: 'Apartment J', postcode: '10010', apartment_type: 'single apartment', rent: 1300.0 },
  ];

  for (const listing of listings) {
    await prisma.listing.create({ data: listing });
  }

  console.log("Database seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
