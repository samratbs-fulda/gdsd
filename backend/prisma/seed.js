// to update schemas: npx prisma migrate dev --name <migration_name>
require("dotenv").config({ path: ".env.local" });

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Reset the database
  console.log("Resetting database...");
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  // Populate the database
  console.log("Seeding database...");

  // Seed Listings
  const listings = [
    { name: 'Apartment A', postcode: '10001', apartment_type: 'single apartment', rent: 1200.5, status: 'pending' },
    { name: 'Apartment D', postcode: '10004', apartment_type: 'single apartment', rent: 1400.0, status: 'pending' },
    { name: 'Apartment G', postcode: '10007', apartment_type: 'single apartment', rent: 1250.0, status: 'pending' },
    { name: 'Apartment J', postcode: '10010', apartment_type: 'single apartment', rent: 1300.0, status: 'pending' },
    { name: 'Apartment B', postcode: '10002', apartment_type: 'shared apartment', rent: 750.0, status: 'approved' },
    { name: 'Apartment E', postcode: '10005', apartment_type: 'shared apartment', rent: 800.0, status: 'approved' },
    { name: 'Apartment H', postcode: '10008', apartment_type: 'shared apartment', rent: 850.0, status: 'approved' },
    { name: 'Apartment C', postcode: '10003', apartment_type: 'sublet', rent: 950.0, status: 'rejected' },
    { name: 'Apartment F', postcode: '10006', apartment_type: 'sublet', rent: 1000.0, status: 'rejected' },
    { name: 'Apartment I', postcode: '10009', apartment_type: 'sublet', rent: 1100.0, status: 'rejected' },
  ];

  for (const listing of listings) {
    await prisma.listing.create({ data: listing });
  }

  // Seed Users
  const users = [
    { name: 'Alice', lastname: 'Smith', status: 'pending' },
    { name: 'Diana', lastname: 'Jones', status: 'pending' },
    { name: 'Bob', lastname: 'Johnson', status: 'clear' },
    { name: 'Edward', lastname: 'Williams', status: 'clear' },
    { name: 'Charlie', lastname: 'Brown', status: 'banned' },
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
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
