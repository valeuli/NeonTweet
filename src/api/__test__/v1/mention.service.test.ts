import { describe, expect, test } from "vitest";
import { MentionService } from "../../v1/mention.service";

describe("MentionService.extractMention", () => {
    test("Should extract the mentioned username with @", () => {
        const content = "Hello @diana.manriquear, happy day!";
        const mention = MentionService.extractMention(content);
        expect(mention).toBe("@diana.manriquear");
    });

    test("Should extract the first mentioned user if there are multiple", () => {
        const content = "Hello @charlie, how are you @juliana?";
        const mention = MentionService.extractMention(content);
        expect(mention).toBe("@charlie");
    });

    test("Should return null if there is no mention", () => {
        const content = "Hello, happy day!";
        const mention = MentionService.extractMention(content);
        expect(mention).toBeNull();
    });

    test("Should handle an @ at the end without a name", () => {
        const content = "Hello @";
        const mention = MentionService.extractMention(content);
        expect(mention).toBeNull();
    });

    test("Should handle usernames with numbers and underscores", () => {
        const content = "Hello @user_123!";
        const mention = MentionService.extractMention(content);
        expect(mention).toBe("@user_123");
    });
});