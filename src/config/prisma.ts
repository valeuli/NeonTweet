import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";



/**
 * Initializes and exports a Prisma client instance configured with NeonDB.
 * It uses a connection pool to manage database connections efficiently.
 */
const dbUrl = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient({ adapter });