import 'dotenv/config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { AuraImage } from '@auraimage/sdk'

const PORT = Number(process.env.PORT) || 3002
const CDN_URL = process.env.CDN_URL || 'https://cdn.auraimage.ai'

const aura = new AuraImage({
  secretKey: process.env.AURAIMAGE_SECRET_KEY!,
  projectName: process.env.AURAIMAGE_PROJECT_NAME!
})

const app = new Hono()

app.use(
  '/api/*',
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:4200']
  })
)

app.get('/api/health', (c) => {
  return c.json({ status: 'ok' })
})

app.post('/api/upload-token', async (c) => {
  try {
    const token = await aura.signUpload()
    return c.json({ token, cdnUrl: CDN_URL })
  } catch (err) {
    console.error(err)
    return c.json({ error: 'Failed to sign upload token' }, 500)
  }
})

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`AuraImage Hono example running at http://localhost:${info.port}`)
})
