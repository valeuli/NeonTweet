
import { TweetService } from "./api/v1/tweet.service";


/**
 * Queue consumer for processing tweet-related messages asynchronously.
 * It extracts tweet details from the queue, creates notifications if necessary,
 * and logs the processing status.
 */
export default {
    async queue(batch: { messages: { body: any }[] }, env: any) {
        const service = new TweetService(env.DATABASE_URL);

        for (const msg of batch.messages) {
            const { userId, content, tweetId, mentionedUser } = msg.body;
            console.log(`📩 Processing tweet in Queue - User: ${userId}, Content: "${content}"`);

            try {
                const notification = await service.createNotification(userId, tweetId, content);

                if (notification) {
                    console.log(`Notification was created for the user: ${mentionedUser}`);
                }
            } catch (error) {
                console.error("Error processing the Queue:", error);
            }
        }
    },
};