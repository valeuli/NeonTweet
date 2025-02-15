import { describe, expect, test, beforeEach, vi } from "vitest";
import { TweetRepository } from "../../v1/tweet.repository";
import { mockDeep } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";

vi.mock("@prisma/client", () => ({
    PrismaClient: vi.fn(() => mockDeep<PrismaClient>())
}));

describe("TweetRepository", () => {
    let mockPrisma: ReturnType<typeof mockDeep<PrismaClient>>;
    let tweetRepository: TweetRepository;

    beforeEach(() => {
        mockPrisma = new PrismaClient() as any; // Cast to prevent type errors
        tweetRepository = new TweetRepository("mock-db-url");
        (tweetRepository as any).prisma = mockPrisma; // Override with mock
    });

    // ✅ Test: createTweet()
    test("should create a tweet successfully", async () => {
        mockPrisma.tweet.create.mockResolvedValue({
            id: 1002,
            userId: 42,
            content: "Hello world!",
            createdAt: new Date(),
        });

        const result = await tweetRepository.createTweet(42, "Hello world!");

        expect(result).toHaveProperty("id", 1002);
        expect(result).toHaveProperty("userId", 42);
        expect(result).toHaveProperty("content", "Hello world!");
    });

    // ✅ Test: createNotification()
    test("should create a notification successfully", async () => {
        mockPrisma.notification.create.mockResolvedValue({
            id: "41",
            userId: 42,
            tweetId: "tweet123",
            mentionedUser: "@charlie",
            message: "You have been mentioned in a tweet!",
            createdAt: new Date(),
        });

        const result = await tweetRepository.createNotification(42, "tweet123", "You have been mentioned in a tweet!");

        expect(result).toHaveProperty("id", "41");
        expect(result).toHaveProperty("userId", 42);
        expect(result).toHaveProperty("tweetId", "tweet123");
        expect(result).toHaveProperty("message", "You have been mentioned in a tweet!");
    });
});