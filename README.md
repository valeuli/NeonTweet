# 🐧 Neon Tweet - Cloudflare Worker + Prisma + NeonDB

Neon Tweet is a **serverless API** built with **Cloudflare Workers**, **Cloudflare Queues**, and **NeonDB** to handle **tweet creation**, **mention processing**, and **async notifications**.

## 🚀 Tech Stack

- **Cloudflare Workers** – Serverless API runtime
- **Cloudflare Queues** – Asynchronous task processing
- **NeonDB + Prisma** – PostgreSQL database with ORM
- **Hono** – Lightweight API framework
- **Vitest** – Unit testing framework

---

## 🛠 Installation

### 1️⃣ Clone the repository

```sh
git clone https://github.com/valeuli/NeonTweet.git
cd neon-tweet
```

### 2️⃣ Install dependencies

```sh
npm install
```

### 3️⃣ Configure `wrangler.toml`

Edit `wrangler.toml` and set your **database URL**:

```toml
name = "neon-tweet"
main = "src/index.ts"
compatibility_date = "2025-02-14"

[vars]
DATABASE_URL = "postgresql://your_neon_db_url"

[[queues.producers]]
queue = "tweet-processing"
binding = "tweet_processing"

[[queues.consumers]]
queue = "tweet-processing"
```

---

## 🚀 Running the Project

### 🌍 Local Development

```sh
npm run dev
```

Starts a local Cloudflare Worker with `wrangler dev`.

### 🚀 Deploy to Cloudflare Workers

```sh
npm run deploy
```

---

## 🛫 Configuring Cloudflare Queues

**Before running the project, make sure Cloudflare Queues are set up correctly.**

### 1️⃣ Authenticate with Cloudflare
```sh
npx wrangler login
npx wrangler whoami
```

### 2️⃣ Create the queue manually
```sh
npx wrangler queues create tweet-processing
```

### 3️⃣ Link the queue to the worker
```sh
npx wrangler queues add-consumer tweet-processing --destination=neon-tweet
```

### 4️⃣ Verify the queue
```sh
npx wrangler queues list
```

If everything is correct, you should see `tweet-processing` in the list.

---

## API Endpoints

### Create a Tweet

```http
POST /tweet/v1/post
```

#### 👉 Request:

```json
{
  "userId": 42,
  "content": "Hello @charlie!"
}
```

#### 👉 Response:

```json
{
  "message": "Tweet was successfully created",
  "result": {
    "id": "1",
    "userId": 42,
    "content": "Hello @charlie!",
    "createdAt": "2025-02-14T12:00:00Z"
  }
}
```

## 🔬 Running Tests

```sh
npm test
```

To run a specific test:

```sh
npx vitest src/api/__test__/v1/tweet.controller.test.ts
```

---
