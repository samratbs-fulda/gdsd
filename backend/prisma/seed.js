// to update schemas: npx prisma migrate dev --name <migration_name>
require("dotenv").config({ path: ".env.local" });
const { execSync } = require("child_process");
const {
  PrismaClient,
  Role,
  GroupMemberStatus,
  Furnished,
  ListingStatus,
  ApartmentType,
} = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Reset the database
  console.log("Resetting database...");
  execSync("npx prisma migrate reset --force", { stdio: "inherit" });

  // // Populate the database
  console.log("Seeding database...");

  // Seed users
  const student = await prisma.user.create({
    data: {
      username: "student_user",
      email: "student@hs-fulda.de",
      password: "$2b$10$Mq9sRJlv8tUvgQrrH9EmY.8wcUmXMmNtXEfe.ffAqoUvwiodJ2AVO", // Password1!
      firstname: "Student",
      lastname: "User",
      role: Role.STUDENT,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      username: "student_user2",
      email: "student2@hs-fulda.de",
      password: "$2b$10$Mq9sRJlv8tUvgQrrH9EmY.8wcUmXMmNtXEfe.ffAqoUvwiodJ2AVO", // Password1!
      firstname: "Student",
      lastname: "User2",
      role: Role.STUDENT,
    },
  });

  const student3 = await prisma.user.create({
    data: {
      username: "student_user3",
      email: "student3@hs-fulda.de",
      password: "$2b$10$Mq9sRJlv8tUvgQrrH9EmY.8wcUmXMmNtXEfe.ffAqoUvwiodJ2AVO", // Password1!
      firstname: "Student",
      lastname: "User3",
      role: Role.STUDENT,
    },
  });

  const landlord = await prisma.user.create({
    data: {
      username: "landlord_user",
      email: "landlord@example.com",
      password: "$2b$10$Mq9sRJlv8tUvgQrrH9EmY.8wcUmXMmNtXEfe.ffAqoUvwiodJ2AVO", // Password1!
      firstname: "Landlord",
      lastname: "User",
      role: Role.LANDLORD,
    },
  });

  const moderator = await prisma.user.create({
    data: {
      username: "moderator_user",
      email: "moderator@example.com",
      password: "$2b$10$Mq9sRJlv8tUvgQrrH9EmY.8wcUmXMmNtXEfe.ffAqoUvwiodJ2AVO", // Password1!
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

  const student2Profile = await prisma.profile.create({
    data: {
      userId: student2.id,
      age: 24,
      gender: "Female",
      nationality: "German",
      phone: "+4915123456788",
      bio: "Student at Hochschule Fulda, looking for a shared apartment.",
    },
  });

  const student3Profile = await prisma.profile.create({
    data: {
      userId: student3.id,
      age: 24,
      gender: "Female",
      nationality: "German",
      phone: "+4915123456787",
      bio: "Student at Hochschule Fulda, looking for a shared apartment. Not accepted to a gorup yet.",
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
  console.log(`Created Profile for Student: ${student2Profile.phone}`);
  console.log(`Created Profile for Student: ${student3Profile.phone}`);
  console.log(`Created Profile for Landlord: ${landlordProfile.phone}`);

  // Addresses
  const addresses = [
    {
      street: "Leipziger Straße",
      postalCode: "36037",
      houseNumber: "12",
      latitude: 50.55797,
      longitude: 9.677550252183902,
      distanceFromUni: 1.2,
    },
    {
      street: "Lindenstraße",
      postalCode: "36037",
      houseNumber: "20",
      latitude: 50.551987249999996,
      longitude: 9.681748944536894,
      distanceFromUni: 2.0,
    },
    {
      street: "Magdeburger Straße",
      postalCode: "36037",
      houseNumber: "85",
      latitude: 50.55720305,
      longitude: 9.691745000000003,
      distanceFromUni: 0.5,
    },
    {
      street: "Haimbacher Straße",
      postalCode: "36041",
      houseNumber: "13",
      latitude: 50.55390375,
      longitude: 9.6595057515278,
      distanceFromUni: 2.6,
    },
    {
      street: "Leipziger Straße",
      postalCode: "36039",
      houseNumber: "170",
      latitude: 50.57041505,
      longitude: 9.69783598204605,
      distanceFromUni: 0.9,
    },
    {
      street: "Marienstraße",
      postalCode: "36039",
      houseNumber: "49",
      latitude: 50.5620484,
      longitude: 9.664035812969663,
      distanceFromUni: 2.4,
    },
    {
      street: "Königstraße",
      postalCode: "36037",
      houseNumber: "42",
      latitude: 50.5505402,
      longitude: 9.6733727,
      distanceFromUni: 2.4,
    },
    {
      street: "Kanalstraße",
      postalCode: "36037",
      houseNumber: "51",
      latitude: 50.549918149999996,
      longitude: 9.675501708522724,
      distanceFromUni: 2.4,
    },
    {
      street: "Heinrichstraße",
      postalCode: "36037",
      houseNumber: "61",
      latitude: 50.5511663,
      longitude: 9.68554596221869,
      distanceFromUni: 2.0,
    },
    {
      street: "Rhönstraße",
      postalCode: "36037",
      houseNumber: "19A",
      latitude: 50.5521851,
      longitude: 9.68557202070096,
      distanceFromUni: 1.9,
    },
    {
      street: "Am Ziegelberg",
      postalCode: "36100",
      houseNumber: "8",
      latitude: 50.5578612,
      longitude: 9.7087642,
      distanceFromUni: 2.3,
    },
    {
      street: "Am Waldschlösschen",
      postalCode: "36037",
      houseNumber: "83A",
      latitude: 50.56189315,
      longitude: 9.68855627215045,
      distanceFromUni: 0.5,
    },
    {
      street: "Tannenweg",
      postalCode: "36039",
      houseNumber: "4",
      latitude: 50.56870525,
      longitude: 9.7033554,
      distanceFromUni: 1.5,
    },
    {
      street: "Richard-Müller-Straße",
      postalCode: "36039",
      houseNumber: "7",
      latitude: 50.56879255,
      longitude: 9.690949829882456,
      distanceFromUni: 0.6,
    },
    {
      street: "Donaustraße",
      postalCode: "36043",
      houseNumber: "5",
      latitude: 50.539889099999996,
      longitude: 9.68467490610464,
      distanceFromUni: 3.5,
    },
    {
      street: "Neißerstraße",
      postalCode: "36100",
      houseNumber: "14",
      latitude: 50.562087000000005,
      longitude: 9.698007518317974,
      distanceFromUni: 1.3,
    },
    {
      street: "Leipziger Straße",
      postalCode: "36037",
      houseNumber: "108C",
      latitude: 50.5631885,
      longitude: 9.687901400149116,
      distanceFromUni: 0.2,
    },
    {
      street: "Marquardstraße",
      postalCode: "36039",
      houseNumber: "30",
      latitude: 50.5625794,
      longitude: 9.683479174166543,
      distanceFromUni: 0.4,
    },
    {
      street: "Birkenallee",
      postalCode: "36037",
      houseNumber: "31",
      latitude: 50.560891600000005,
      longitude: 9.690567961640207,
      distanceFromUni: 0.5,
    },
    {
      street: "Am Rasen",
      postalCode: "36041",
      houseNumber: "15",
      latitude: 50.5488696,
      longitude: 9.663510580394087,
      distanceFromUni: 3.0,
    },
  ];

  // Seed Listings
  for (let i = 1; i <= addresses.length; i++) {
    const apartmentType =
      i % 2 === 0 ? ApartmentType.SUBLET : ApartmentType.SINGLE;
    const furnishedType =
      i % 3 === 0
        ? "Furnished"
        : i % 3 === 1
        ? "Partially Furnished"
        : "Unfurnished";
    const floorInfo = i % 5 === 0 ? "Ground Floor" : `Floor ${i % 5}`;
    const location = addresses[i - 1].street;
    const size = 10 + (i % 10) * 10;

    const listing = await prisma.listing.create({
      data: {
        landlordId: landlord.id,
        title: `${apartmentType} in ${location} - ${size} sqm, ${floorInfo}`,
        description: `A ${furnishedType} ${apartmentType} located at ${location}. This ${size} sqm unit is situated on ${floorInfo}, offering a comfortable living space with modern amenities.`,
        type: apartmentType,
        availableFrom: new Date(),
        availableTill: new Date(new Date().setMonth(new Date().getMonth() + 6)),
        status: i % 4 === 0 ? ListingStatus.PENDING : ListingStatus.APPROVED,
        coldRent: 50 + (i % 10) * 75,
        deposit: 1000,
        heatingCost: 50 + (i % 10) * 5,
        additionalCosts: 75 + (i % 4) * 5,
        warmRent: 50 + (i % 10) * 75 + 50 + (i % 10) * 5 + 75 + (i % 4) * 5,
        size: 10 + (i % 10) * 10,
        floor: i % 5,
        totalRooms: 1 + (i % 8),
        freeRooms: 1 + (i % 4),
        energyRating: "A",
        furnished:
          i % 3 === 0
            ? Furnished.FURNISHED
            : i % 3 === 1
            ? Furnished.PARTIALLY
            : Furnished.NONFURNISHED,
        street: addresses[i - 1].street,
        postalCode: addresses[i - 1].postalCode,
        houseNumber: addresses[i - 1].houseNumber,
        latitude: addresses[i - 1].latitude,
        longitude: addresses[i - 1].longitude,
        distanceFromUni: addresses[i - 1].distanceFromUni,
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

  // Seed chats
  // Seed Individual Chat (Student 1 and Landlord)
  const individualChat = await prisma.chat.create({
    data: {
      listingId: 1, // Associate with the first listing
      ChatParticipant: {
        create: [
          { userId: student.id }, // Student 1
          { userId: landlord.id }, // Landlord
        ],
      },
      Messages: {
        create: [
          {
            senderId: student.id,
            content: "Hello, I'm interested in this listing!",
          },
          {
            senderId: landlord.id,
            content: "Great! Do you have any specific questions?",
          },
          {
            senderId: student.id,
            content: "Yes, is the apartment still available?",
          },
          {
            senderId: landlord.id,
            content: "Yes, it's available for immediate move-in.",
          },
        ],
      },
    },
  });

  console.log(`Created Individual Chat with ID: ${individualChat.id}`);

  //seed group
  const group = await prisma.group.create({
    data: {
      creatorId: student.id, // The creator of the group (can be landlord too)
    },
  });

  console.log(
    `Created Group with ID: ${group.id} and creatorId: ${group.creatorId}`
  );

  //add student_user2 as a group member
  await prisma.groupMember.createMany({
    data: [
      { groupId: group.id, studentId: student.id, status: "ACCEPTED" }, //creator
      { groupId: group.id, studentId: student2.id, status: "ACCEPTED" },
    ],
  });

  console.log(`Added Student 1 and 2 to Group with ID: ${group.id}`);
  // Seed Group Chat (Student 1, Student 2, and Landlord)
  const groupChat = await prisma.chat.create({
    data: {
      listingId: 2, // Associate with another listing
      ChatParticipant: {
        create: [
          { userId: student.id }, // Student 2
          { userId: student2.id }, // Student 3
          { userId: landlord.id }, // Landlord
        ],
      },
      Messages: {
        create: [
          {
            senderId: student2.id,
            content: "Hi, we're interested in the apartment!",
          },
          {
            senderId: landlord.id,
            content: "Awesome! Do you both want to rent together?",
          },
          {
            senderId: student.id,
            content: "Yes, we would like to know more about the terms.",
          },
          {
            senderId: landlord.id,
            content: "The rent is $1,800 per month for the two of you.",
          },
          {
            senderId: student2.id,
            content: "What about the deposit and utilities?",
          },
          {
            senderId: landlord.id,
            content: "Deposit is $1,500, and utilities are not included.",
          },
          {
            senderId: student.id,
            content: "Got it. Is there a parking spot available?",
          },
          {
            senderId: landlord.id,
            content: "Yes, one parking spot is included in the rent.",
          },
          {
            senderId: student2.id,
            content: "Can we visit the apartment this weekend?",
          },
          {
            senderId: landlord.id,
            content: "Sure! Saturday afternoon works for me.",
          },
        ],
      },
    },
  });

  console.log(`Created Group Chat with ID: ${groupChat.id}`);

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
