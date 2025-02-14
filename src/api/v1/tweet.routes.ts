import { Hono } from "hono";
import { TweetController } from "./tweet.controller";
import { AppBindings } from "./bindings.types";

export const tweetRoutes = new Hono<{ Bindings: AppBindings }>();


// Registers routes from TweetController into the Hono instance.
TweetController.registerRoutes(tweetRoutes);