import { TweetRepository } from "./tweet.repository";

export class TweetService {
    /**
     * Service layer for handling tweet-related business logic.
     */
    private repository: TweetRepository;

    constructor(dbUrl: string) {
        this.repository = new TweetRepository(dbUrl);
    }

    async createTweet(userId: number, content: string) {
        if (!userId || !content) {
            return { error: "The usedId and content are required" };
        }

        return this.repository.createTweet(userId, content);
    }

    async createNotification(userId: number, tweetId: string, content: string) {
        const mentionMatch = content.match(/@(\w+)/);

        if (mentionMatch) {
            const mentionedUser = mentionMatch[1];
            return this.repository.createNotification(userId, tweetId, `You have been mentioned in a tweet: "${content}"`);
        }

        return null;
    }
}