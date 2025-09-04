import { createYoga } from "graphql-yoga"
import { schema } from "@/graphql/schema"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// -----------------------------
// Type du rate limiter
// -----------------------------
type RateLimitResult = { success: boolean; remaining: number }

// -----------------------------
// Initialisation rate limiter
// -----------------------------
let ratelimit: { limit: (key: string) => Promise<RateLimitResult> }

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 req/minute
  }) as unknown as { limit: (key: string) => Promise<RateLimitResult> }
} else {
  // fallback mémoire (non persistant)
  const store = new Map<string, number[]>()
  ratelimit = {
    async limit(key: string): Promise<RateLimitResult> {
      const now = Date.now()
      const window = 60_000
      const limit = 10
      const records = store.get(key) || []
      const filtered = records.filter((t) => t > now - window)
      filtered.push(now)
      store.set(key, filtered)
      return { success: filtered.length <= limit, remaining: Math.max(0, limit - filtered.length) }
    },
  }
}

// -----------------------------
// Serveur Yoga
// -----------------------------

const yoga = createYoga({
  schema,
  context: async ({ request }) => {
    const headers = Object.fromEntries(request.headers.entries())
    const pw = headers["x-admin-password"] || ""
    const isAdmin = pw === process.env.ADMIN_PASSWORD
    return { isAdmin } // toujours boolean
  },
  graphqlEndpoint: "/api/graphql",
  graphiql: process.env.NODE_ENV !== "production",
})

// -----------------------------
// Récupération IP
// -----------------------------
function getClientIP(request: Request): string {
  const ipHeader = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
  if (!ipHeader) return "unknown"
  return ipHeader.split(",")[0].trim()
}

// -----------------------------
// Handler commun rate-limit + Yoga
// -----------------------------
async function handleRequestWithRateLimit(request: Request) {
  const ip = getClientIP(request)
  const rl = await ratelimit.limit(ip)
  if (!rl.success) return new Response("Too Many Requests", { status: 429 })
  return yoga.handleRequest(request, {}) 
}

// -----------------------------
// Handlers Next.js App Router
// -----------------------------
export { handleRequestWithRateLimit as GET, handleRequestWithRateLimit as POST }
