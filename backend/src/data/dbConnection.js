const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//query logs for development
if (process.env.NODE_ENV === "development") {
    prisma.$on("query", (e) => {
        console.log("Query:", e.query);
    });
}

process.on("SIGINT", async () => {
    console.log("Shutting down Prisma...");
    await prisma.$disconnect();
    process.exit(0);
});

module.exports = prisma;
