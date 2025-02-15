import { Hono } from "hono";
import { tweetRoutes } from "./api/v1/tweet.routes";
import consumer from "./queue.consumer";

/**
 * Main application entry point for handling HTTP requests and queue processing.
 * It registers API routes for tweets and integrates the queue consumer for async processing.
 */

const app = new Hono();

app.route("/tweet/v1", tweetRoutes);

export default {
    fetch: app.fetch,
    ...consumer,
};