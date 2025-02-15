import {describe, test, expect, vi, beforeEach} from "vitest";
import consumer from "../../queue.consumer";
import { TweetService } from "../v1/tweet.service";

// Mock de TweetService
vi.mock("../../api/v1/tweet.service");

describe("Queue Consumer", () => {
    let mockTweetService: any;
    let env: any;

    beforeEach(() => {
        mockTweetService = {
            createNotification: vi.fn().mockResolvedValue({ id: 1, message: "Notification created" }),
        };

        (TweetService as any).mockImplementation(() => mockTweetService);

        env = { DATABASE_URL: "mock-db-url" };
    });

    test("should process messages and create notifications", async () => {
        const batch = {
            messages: [
                {
                    body: {
                        userId: 42,
                        content: "Hello @charlie!",
                        tweetId: "tweet123",
                        mentionedUser: "@charlie",
                    },
                },
            ],
        };

        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        await consumer.queue(batch, env); // Llamamos a la función correctamente
        expect(mockTweetService.createNotification).toHaveBeenCalledWith(42, "tweet123", "Hello @charlie!");
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("📩 Processing tweet in Queue - User: 42"));
        logSpy.mockRestore();
    });

    test("should handle errors gracefully", async () => {
        mockTweetService.createNotification.mockRejectedValue(new Error("Database error"));

        const batch = {
            messages: [
                {
                    body: {
                        userId: 42,
                        content: "Hello @charlie!",
                        tweetId: "tweet123",
                        mentionedUser: "@charlie",
                    },
                },
            ],
        };

        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
        await consumer.queue(batch, env);

        expect(errorSpy).toHaveBeenCalledWith(
            "Error processing the Queue:",
            expect.any(Error)
        );

        errorSpy.mockRestore();
    });

    test("should not create notifications if there are no messages", async () => {
        const batch = { messages: [] };

        await consumer.queue(batch, env); // Llamamos a la función correctamente

        // Verificar que `createNotification` nunca fue llamado
        expect(mockTweetService.createNotification).not.toHaveBeenCalled();
    });
});