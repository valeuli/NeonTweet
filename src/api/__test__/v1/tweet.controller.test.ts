import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { TweetController} from "../../v1/tweet.controller";
import { TweetService} from "../../v1/tweet.service";
import { AppBindings} from "../../v1/bindings.types";


describe('TweetController', () => {
    let app: Hono<{ Bindings: AppBindings }>;
    let baseEnv: AppBindings;

    beforeEach(() => {
        vi.resetAllMocks();

        const mockQueue = {
            send: vi.fn(() => Promise.resolve()),
            sendBatch: vi.fn(() => Promise.resolve()),
        };

        baseEnv = {
            DATABASE_URL: 'http://fake-database-url',
            tweet_processing: mockQueue,
        };

        app = new Hono<{ Bindings: AppBindings }>();
        TweetController.registerRoutes(app);
    });

    it('Should return error when DATABASE_URL is not defined', async () => {
        const env = { ...baseEnv, DATABASE_URL: undefined } as unknown as AppBindings;
        const reqBody = JSON.stringify({ userId: 'user1', content: 'Hola @test' });
        const request = new Request('http://localhost/post', {
            method: 'POST',
            body: reqBody,
        });

        const res = await app.fetch(request, env);
        expect(res.status).toBe(500);
        const jsonResponse = (await res.json()) as { error: string };
        expect(jsonResponse.error).toBe('DATABASE_URL is not defined');
    });

    it('Should return error when tweet_processing (queue) is not defined', async () => {
        const env = { ...baseEnv, tweet_processing: undefined } as unknown as AppBindings;
        const reqBody = JSON.stringify({ userId: 'user1', content: 'Hola @test' });
        const request = new Request('http://localhost/post', {
            method: 'POST',
            body: reqBody,
        });

        const res = await app.fetch(request, env);
        expect(res.status).toBe(500);
        const json = (await res.json()) as { error: string };
        expect(json.error).toBe('TWEET_QUEUE is not defined');
    });

    it('Should return error when required fields are missing', async () => {
        const reqBody = JSON.stringify({ userId: 'user1' });
        const request = new Request('http://localhost/post', {
            method: 'POST',
            body: reqBody,
        });

        const res = await app.fetch(request, baseEnv);
        expect(res.status).toBe(400);
        const json = (await res.json()) as { error: string };
        expect(json.error).toBe('There are missing required fields');
    });

    it('Should return error when tweet creation fails', async () => {
        const errorResult = { error: 'Failed to create tweet' };
        const createTweetSpy = vi
            .spyOn(TweetService.prototype, 'createTweet')
            .mockResolvedValue(errorResult);

        const reqBody = JSON.stringify({ userId: 'user1', content: 'Hola' });
        const request = new Request('http://localhost/post', {
            method: 'POST',
            body: reqBody,
        });

        const res = await app.fetch(request, baseEnv);
        expect(res.status).toBe(500);
        const json = await res.json();
        expect(json).toEqual(errorResult);

        createTweetSpy.mockRestore();
    });

    it('Should create the tweet', async () => {
        const fakeTweet = {
            id: 123,
            userId: 1,
            content: 'Hola @testUser',
            createdAt: new Date()
        };
        const createTweetSpy = vi
            .spyOn(TweetService.prototype, 'createTweet')
            .mockResolvedValue(fakeTweet);

        const reqBody = JSON.stringify({ userId: 'user1', content: 'Hola @testUser' });
        const request = new Request('http://localhost/post', {
            method: 'POST',
            body: reqBody,
        });

        const res = await app.fetch(request, baseEnv );
        expect(res.status).toBe(200);
        const json = (await res.json()) as { message: string; result: typeof fakeTweet };
        expect(json.message).toBe('Tweet was successfully created');
        expect(json.result.id).toEqual(fakeTweet.id);
        expect(new Date(json.result.createdAt).toISOString()).toEqual(fakeTweet.createdAt.toISOString());

        expect(createTweetSpy).toHaveBeenCalledWith('user1', 'Hola @testUser');
    });
});