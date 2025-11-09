import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully!");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
}

export default prisma;
