import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

export class TweetRepository {
    /**
     * Handles database interactions for tweets and notifications using Prisma and NeonDB.
     */
    private prisma: PrismaClient;

    constructor(dbUrl: string) {
        const pool = new Pool({ connectionString: dbUrl });
        const adapter = new PrismaNeon(pool);
        this.prisma = new PrismaClient({ adapter });
    }

    async createTweet(userId: number, content: string) {
        return this.prisma.tweet.create({
            data: { userId, content },
        });
    }

    async createNotification(userId: number, tweetId: string, message: string) {
        return this.prisma.notification.create({
            data: { userId, tweetId, message },
        });
    }
}