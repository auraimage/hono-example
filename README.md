# AuraImage Hono Example

A minimal Hono server that signs upload tokens for AuraImage. Use this
backend together with any of the AuraImage frontend examples (React, Vue,
Angular) to upload images and serve them through the CDN. Hono is
lighter and faster than Express — the same framework that powers
AuraImage's own edge infrastructure.

## Prerequisites

- **Node.js** 20 or later
- An **AuraImage account** — [sign up](https://auraimage.ai) if you don't have one
- A project with at least one **secret key** — create one in the
  [dashboard](https://app.auraimage.ai) or run `npx aura init`

## Quick start

```bash
# 1. Clone and navigate
git clone https://github.com/auraimage/hono-example
cd hono-example

# 2. Set up your environment
#
# Option A (recommended): use the AuraImage CLI to create a project and key
npx aura init

# Option B: copy .env.example and fill in your secret key manually
cp .env.example .env
# AURAIMAGE_SECRET_KEY=sk_live_...
# AURAIMAGE_PROJECT_NAME=my-project

# 3. Install dependencies
npm install

# 4. Start the server
npm run dev
```

The server starts at `http://localhost:3002`. You should see:

```
AuraImage Hono example running at http://localhost:3002
```

Now start one of the frontend examples and point their proxy to this server.

## How it works

1. Your frontend requests an upload token from `POST /api/upload-token`
2. The server uses `@auraimage/sdk` to sign a short-lived HMAC token with your secret key
3. The frontend uploads the image directly to the AuraImage CDN using `@auraimage/sdk/client`
4. The CDN verifies the token, processes the image, and returns a URL

The server never touches image bytes — images go straight from the browser to the CDN.

## API

### `GET /api/health`

Returns `{ "status": "ok" }`. Frontend examples ping this on load
to confirm the server is reachable.

### `POST /api/upload-token`

Returns an HMAC-signed upload token and the CDN base URL.

**Response:**

```json
{
  "token": "eyJwcm9qZWN0TmFtZSI6...",
  "cdnUrl": "https://cdn.auraimage.ai"
}
```

## Project structure

```
hono-example/
├── .env.example          # Template for environment variables
├── package.json
├── tsconfig.json
├── LICENSE
├── README.md
└── src/
    └── server.ts         # Hono server with health check + token endpoint
```

## Links

- [AuraImage docs](https://auraimage.ai/docs)
- [Dashboard](https://app.auraimage.ai)
- [SDK on npm](https://www.npmjs.com/package/@auraimage/sdk)
