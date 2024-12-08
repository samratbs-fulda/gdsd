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
    { name: 'Alice', lastname: 'Smith', status: 'pending', email: 'alice.smith@example.com', password: 'pass123', role: 'student' },
    { name: 'Diana', lastname: 'Jones', status: 'pending', email: 'diana.jones@example.com', password: 'diana12', role: 'landlord' },
    { name: 'Bob', lastname: 'Johnson', status: 'clear', email: 'bob.johnson@example.com', password: 'bob1234', role: 'landlord' },
    { name: 'Edward', lastname: 'Williams', status: 'clear', email: 'edward.williams@example.com', password: 'edward1', role: 'student' },
    { name: 'Charlie', lastname: 'Brown', status: 'banned', email: 'charlie.brown@example.com', password: 'charlie6', role: 'student' },
    { name: 'Fiona', lastname: 'Taylor', status: 'clear', email: 'fiona.taylor@example.com', password: 'fiona11', role: 'landlord' },
    { name: 'George', lastname: 'Miller', status: 'pending', email: 'george.miller@example.com', password: 'george1', role: 'student' },
    { name: 'Hannah', lastname: 'Clark', status: 'clear', email: 'hannah.clark@example.com', password: 'hannah2', role: 'landlord' },
    { name: 'Ian', lastname: 'Walker', status: 'clear', email: 'ian.walker@example.com', password: 'ianpass', role: 'student' },
    { name: 'Jane', lastname: 'Adams', status: 'banned', email: 'jane.adams@example.com', password: 'admin12', role: 'admin' }
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
