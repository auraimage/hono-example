# AuraImage Hono Example

A minimal Hono server that signs upload tokens for AuraImage. Hono is the
same lightweight framework that powers AuraImage's own edge infrastructure.
Use this backend together with any AuraImage frontend example.

---

## Prerequisites

- **Node.js** 20 or later — check with `node --version`
- An **AuraImage account** — [sign up here](https://auraimage.ai)
- A **project** with at least one **secret key** — you'll create this in step 2

---

## Quick start

### Step 1 — Clone

```bash
git clone https://github.com/auraimage/hono-example
cd hono-example
```

### Step 2 — Create a project and secret key

**Option A (recommended)**: Let the CLI do everything.

```bash
npx aura init
```

It will create a project, generate a secret key, and write `.env` for you.

**Option B (manual)**: Create `.env` yourself.

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```
AURAIMAGE_SECRET_KEY=sk_live_your_actual_key
AURAIMAGE_PROJECT_NAME=your_project_name
```

> **Never commit `.env`.** It's already in `.gitignore`.

### Step 3 — Install

```bash
npm install
```

### Step 4 — Start

```bash
npm run dev
```

You should see:

```
AuraImage Hono example running at http://localhost:3002
```

### Step 5 — Verify

```bash
curl http://localhost:3002/api/health
```

Expected: `{ "status": "ok" }`.

Now start one of the frontend examples — point their proxy to port 3002.

---

## What if something goes wrong?

| Problem | What to check |
|---|---|
| `Error: AuraImage: secretKey is required` | `.env` is missing or wrong |
| `address already in use :::3002` | Something else is on port 3002 — change `PORT` in `.env` |
| `npm ERR!` during install | Node.js must be 20+ |

---

## How it works

1. Your frontend asks for an upload token (`POST /api/upload-token`)
2. This server uses `@auraimage/sdk` to sign an HMAC token
3. The frontend uploads the image directly to the AuraImage CDN — this
   server never touches image bytes
4. The CDN verifies the token, processes the image, returns a URL

---

## API reference

### `GET /api/health`

Returns `{ "status": "ok" }`.

### `POST /api/upload-token`

**Response:**

```json
{
  "token": "eyJwcm9qZWN0TmFtZSI6ImRlbW8...",
  "cdnUrl": "https://cdn.auraimage.ai"
}
```

---

## Project structure

```
hono-example/
├── .env.example          # Template — copy to .env with your keys
├── package.json
├── tsconfig.json
├── LICENSE
├── README.md
└── src/
    └── server.ts         # Hono server: health check + token endpoint
```

---

## Express vs Hono

If you're comparing this with the [Node.js example](https://github.com/auraimage/node-example):

| | Express (node-example) | Hono (this one) |
|---|---|---|
| Framework | Express 5 | Hono 4 |
| Bundle size | ~2 MB | ~200 KB |
| AuraImage uses | No | Yes (API + CDN workers) |
| API style | `req`/`res` | `c.json()` / `c.req` |

Both do the same thing — pick whichever fits your stack.

---

## Links

- [AuraImage docs](https://auraimage.ai/docs)
- [Dashboard](https://app.auraimage.ai)
- [@auraimage/sdk on npm](https://www.npmjs.com/package/@auraimage/sdk)
