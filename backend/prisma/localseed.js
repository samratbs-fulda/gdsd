require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    await prisma.listing.createMany({
        data: [
            { name: "Outskrits and Peace", postcode: "1231", apartment_type: "Single-Room Apartment", rent: 450.0 },
            { name: "Center", postcode: "12312", apartment_type: "Shared Apartment", rent: 320.0 },
            { name: "New", postcode: "7457", apartment_type: "Sublet", rent: 550.0 },
        ],
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
