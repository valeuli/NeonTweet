/**
  This is a type definition for environment bindings in Cloudflare Workers.
  - DATABASE_URL: A string representing the connection URL for the PostgresSQL database.
  - tweet_processing: A Cloudflare Queue instance used for processing tweet-related tasks.
*/
export type AppBindings = {
    DATABASE_URL: string;
    tweet_processing: Queue;
};