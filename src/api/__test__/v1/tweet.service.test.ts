import { describe, expect, test, beforeEach} from "vitest";
import { TweetService } from "../../v1/tweet.service";
import { TweetRepository } from "../../v1/tweet.repository";
import { mockDeep } from "vitest-mock-extended";

describe("TweetService", () => {
    let mockRepository: ReturnType<typeof mockDeep<TweetRepository>>;
    let tweetService: TweetService;

    beforeEach(() => {
        mockRepository = mockDeep<TweetRepository>();
        tweetService = new TweetService("mock-db-url");
        (tweetService as any).repository = mockRepository;
    });

    // ✅ Test: createTweet()
    test("should create a tweet when valid userId and content are provided", async () => {
        mockRepository.createTweet.mockResolvedValue({
            id: 1,
            userId: 42,
            content: "Hello world!",
            createdAt: new Date(),
        });

        const result = await tweetService.createTweet(42, "Hello world!");

        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("userId", 42);
        expect(result).toHaveProperty("content", "Hello world!");
    });

    test("should return an error when userId or content is missing", async () => {
        const result1 = await tweetService.createTweet(42, "");
        expect(result1).toEqual({ error: "The usedId and content are required" });

        const result2 = await tweetService.createTweet(0, "Hello!");
        expect(result2).toEqual({ error: "The usedId and content are required" });
    });

    // ✅ Test: createNotification()
    test("should create a notification when a mention is detected", async () => {
        mockRepository.createNotification.mockResolvedValue({
            id: "1",
            userId: 42,
            tweetId: "123",
            message: 'You have been mentioned in a tweet: "@charlie check this out!"',
            mentionedUser: "@charlie",
            createdAt: new Date(),
        });

        const result = await tweetService.createNotification(42, "tweet123", "@charlie check this out!");

        expect(result).not.toBeNull();
        expect(result).toHaveProperty("message", 'You have been mentioned in a tweet: "@charlie check this out!"');
    });

    test("should return null when no mention is found", async () => {
        const result = await tweetService.createNotification(42, "tweet123", "Just a normal tweet.");
        expect(result).toBeNull();
    });
});