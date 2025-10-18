import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { coches } from './api/coches'
import { vendedores } from './api/vendedores'
import { auth } from './api/auth'
import { ai } from './api/ai'
import { upload } from './api/upload'

type Bindings = {
  DB: D1Database
  OPENAI_API_KEY: string
  AWS_ACCESS_KEY_ID: string
  AWS_SECRET_ACCESS_KEY: string
  CLOUDFLARE_API_TOKEN: string
  CLOUDFLARE_ACCOUNT_ID: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors({
  origin: ['http://localhost:3000', 'https://your-domain.pages.dev'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

app.route('/api/coches', coches)
app.route('/api/vendedores', vendedores)
app.route('/api/auth', auth)
app.route('/api/ai', ai)
app.route('/api/upload', upload)

app.get('/', (c) => {
  return c.json({ message: 'SitioCoches API - Cloudflare Workers' })
})

export default app