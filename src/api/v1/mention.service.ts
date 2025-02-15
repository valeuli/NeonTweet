/**
 * Class service for extracting mentions from tweet content.
 */
export class MentionService {
    static extractMention(content: string): string | null {
        const mentionMatch = content.match(/@([\w.]+)/);
        return mentionMatch ? mentionMatch[0] : null;
    }
}