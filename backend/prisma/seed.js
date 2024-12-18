// to update schemas: npx prisma migrate dev --name <migration_name>
require("dotenv").config({ path: ".env.local" });

const {
  PrismaClient,
  Role,
  Furnished,
  ListingStatus,
  ApartmentType,
} = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Reset the database
  console.log("Resetting database...");
  prisma.$executeRaw`TRUNCATE "Listing", "User", "Amenities", "Documents" RESTART IDENTITY CASCADE;`;
  // await prisma.listing.deleteMany();
  // await prisma.user.deleteMany();
  // await prisma.address.deleteMany();
  // await prisma.amenities.deleteMany();
  // await prisma.documents.deleteMany();

  // // Populate the database
  console.log("Seeding database...");

  // Seed users
  const student = await prisma.user.create({
    data: {
      username: "student_user",
      email: "student@example.com",
      password: "password123",
      firstname: "Student",
      lastname: "User",
      role: Role.STUDENT,
    },
  });

  const landlord = await prisma.user.create({
    data: {
      username: "landlord_user",
      email: "landlord@example.com",
      password: "password123",
      firstname: "Landlord",
      lastname: "User",
      role: Role.LANDLORD,
    },
  });

  const moderator = await prisma.user.create({
    data: {
      username: "moderator_user",
      email: "moderator@example.com",
      password: "password123",
      firstname: "Moderator",
      lastname: "User",
      role: Role.MODERATOR,
    },
  });

  // Seed profiles
  const studentProfile = await prisma.profile.create({
    data: {
      userId: student.id,
      age: 22,
      gender: "Male",
      nationality: "German",
      phone: "+4915123456789",
      bio: "Student at Hochschule Fulda, looking for a shared apartment.",
    },
  });
  
  const landlordProfile = await prisma.profile.create({
    data: {
      userId: landlord.id,
      age: 45,
      gender: "Female",
      nationality: "German",
      phone: "+4915123456790",
      bio: "Experienced landlord offering affordable housing for students.",
    },
  });

  console.log(`Created Profile for Student: ${studentProfile.phone}`);
  console.log(`Created Profile for Landlord: ${landlordProfile.phone}`);

  // Seed Listings
  for (let i = 1; i <= 10; i++) {
    const listing = await prisma.listing.create({
      data: {
        landlordId: landlord.id,
        title: `Listing Title ${i}`,
        description: `This is the description for listing ${i}.`,
        type: i % 2 === 0 ? ApartmentType.SUBLET : ApartmentType.SINGLE,
        availableFrom: new Date(),
        availableTill: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        status: i % 2 === 0 ? ListingStatus.APPROVED : ListingStatus.PENDING,
        coldRent: 500 + i * 50,
        deposit: 1000,
        heatingCost: 50,
        additionalCosts: 75,
        warmRent: 675 + i * 50,
        size: 50 + i * 10,
        floor: i % 5,
        totalRooms: 4 + (i % 3),
        freeRooms: 1,
        energyRating: "A",
        furnished:
          i % 3 === 0
            ? Furnished.FURNISHED
            : i % 3 === 1
            ? Furnished.PARTIALLY
            : Furnished.NONFURNISHED,
        street: `Street ${i}`,
        postalCode: "10000" + i,
        houseNumber: i,
        latitude: 52.5 + i * 0.01,
        longitude: 13.4 + i * 0.01,
        distanceFromUni: i * 0.5,
        amenities: {
          create: {
            kitchenFitted: true,
            petsAllowed: i % 2 === 0,
            parkingAvailable: i % 3 === 0,
            balconyAvailable: i % 2 !== 0,
            gardenAvailable: i % 4 === 0,
            wifiAvailable: true,
            storageAvailable: i % 3 !== 0,
            smokingAllowed: i % 2 === 0,
            dishWasherAvailalbe: i % 3 === 0,
            washingMachineAvailable: true,
            tvCableIncluded: i % 4 === 0,
          },
        },
        documents: {
          create: {
            proofOfIncome: true,
            proofOfIdentity: true,
            shufaCreditReport: i % 2 === 0,
            parentalGuarantee: i % 3 === 0,
          },
        },
      },
    });

    console.log(`Created listing ${listing.title}`);
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
