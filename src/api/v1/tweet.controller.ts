import { Hono } from "hono";
import { TweetService } from "./tweet.service";
import { MentionService } from "./mention.service";
import {AppBindings} from "./bindings.types";

export class TweetController {
    /**
     * Registers a tweet in the application and enqueues the notification to processing.
     */
    public static registerRoutes(app:  Hono<{ Bindings: AppBindings }>) {
        app.post("/post", async (c) => {
            const dbUrl = c.env.DATABASE_URL;
            const queue = c.env.tweet_processing;

            if (!dbUrl) return c.json({ error: "DATABASE_URL is not defined" }, 500);
            if (!queue) return c.json({ error: "TWEET_QUEUE is not defined" }, 500);

            const { userId, content } = await c.req.json();
            if (!userId || !content) {
                return c.json({ error: "There are missing required fields" }, 400);
            }

            const service = new TweetService(dbUrl);
            const result = await service.createTweet(userId, content);
            if ("id" in result) {
                const mentionedUser = MentionService.extractMention(content);
                await queue.send({ userId, content, tweetId: String(result.id), mentionedUser });
                return c.json({ message: "Tweet was successfully created", result });
            } else {
                return c.json(result, 500)
            }
        });
    }
}