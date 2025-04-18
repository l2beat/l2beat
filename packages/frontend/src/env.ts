import { z } from 'zod'

const coerceBoolean = z.string().transform((val) => {
  return val !== 'false' && val !== '0'
})
const stringArray = z.string().transform((val) => {
  if (!val) {
    return []
  }
  return val.split(',')
})

const featureFlag = coerceBoolean.optional()

const CLIENT_CONFIG = {
  NEXT_PUBLIC_FEATURE_FLAG_STAGE_SORTING: featureFlag.default('false'),
  NEXT_PUBLIC_GITCOIN_ROUND_LIVE: featureFlag.default('false'),
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().default('localhost'),
  NEXT_PUBLIC_PLAUSIBLE_ENABLED: coerceBoolean.optional(),
  NEXT_PUBLIC_SHOW_HIRING_BADGE: featureFlag.default('false'),
  NEXT_PUBLIC_ECOSYSTEMS: coerceBoolean.default('false'),
}
const ClientEnv = z.object(CLIENT_CONFIG)

const SERVER_CONFIG = {
  ...CLIENT_CONFIG,
  DATABASE_URL: z
    .string()
    .url()
    .default('postgresql://postgres:password@localhost:5432/l2beat_local'),
  ETHEREUM_RPC_URL: z.string().url().default('https://cloudflare-eth.com'),
  MOCK: coerceBoolean.default('false'),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  CRON_SECRET: z.string().optional(),
  VERCEL_GIT_COMMIT_REF: z.string().optional(),
  VERCEL_GIT_COMMIT_SHA: z.string().default('local'),
  VERCEL_URL: z.string().optional(),
  VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
  EXCLUDED_ACTIVITY_PROJECTS: stringArray.optional(),
  EXCLUDED_TVS_PROJECTS: stringArray.optional(),
}
const ServerEnv = z.object(SERVER_CONFIG)

export type Env = z.infer<typeof ServerEnv>

export const env = createEnv()

function createEnv(): Env {
  const env = getEnv()
  const isClient = typeof window !== 'undefined'

  for (const key in env) {
    if (env[key] === '') {
      delete env[key]
    }
  }

  const parsed = isClient ? ClientEnv.parse(env) : ServerEnv.parse(env)
  return new Proxy<Env>(parsed as Env, {
    get(target, key, receiver) {
      if (!Reflect.has(SERVER_CONFIG, key)) {
        throw new Error(`Accessing invalid env: ${key.toString()}`)
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return Reflect.get(target, key, receiver)
    },
  })
}

function getEnv(): Record<string, string | undefined> {
  if (typeof process === 'undefined') {
    // @ts-expect-error - window.__ENV__ is not typed
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return window.__ENV__
  }
  return { ...process.env }
}
