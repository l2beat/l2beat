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
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
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
  DATABASE_LOG_ENABLED: coerceBoolean.default('false'),
  DISABLE_CACHE: coerceBoolean.default('false'),
  ETHEREUM_RPC_URL: z.string().url().default('https://cloudflare-eth.com'),
  MOCK: coerceBoolean.default('false'),
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
    if (env[key as keyof Env] === '') {
      delete env[key as keyof Env]
    }
  }

  const parsed = isClient ? ClientEnv.parse(env) : ServerEnv.parse(env)
  return new Proxy<Env>(parsed as Env, {
    get(target, key, receiver) {
      if (!Reflect.has(SERVER_CONFIG, key)) {
        throw new Error(`Accessing invalid env: ${key.toString()}`)
      }

      return Reflect.get(target, key, receiver)
    },
  })
}

function getEnv(): Record<keyof z.infer<typeof ServerEnv>, string | undefined> {
  if (typeof process === 'undefined') {
    return window.__ENV__
  }

  // As NextJS bundler inlines the env variables, we need to do this manually
  // https://nextjs.org/docs/pages/guides/environment-variables#bundling-environment-variables-for-the-browser
  return {
    // Server
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_LOG_ENABLED: process.env.DATABASE_LOG_ENABLED,
    DISABLE_CACHE: process.env.DISABLE_CACHE,
    ETHEREUM_RPC_URL: process.env.ETHEREUM_RPC_URL,
    MOCK: process.env.MOCK,
    NODE_ENV: process.env.NODE_ENV,
    CRON_SECRET: process.env.CRON_SECRET,
    VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
    VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    EXCLUDED_ACTIVITY_PROJECTS: process.env.EXCLUDED_ACTIVITY_PROJECTS,
    EXCLUDED_TVS_PROJECTS: process.env.EXCLUDED_TVS_PROJECTS,
    // Client
    NEXT_PUBLIC_FEATURE_FLAG_STAGE_SORTING:
      process.env.NEXT_PUBLIC_FEATURE_FLAG_STAGE_SORTING,
    NEXT_PUBLIC_GITCOIN_ROUND_LIVE: process.env.FEATURE_FLAG_GITCOIN_OPTION,
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    NEXT_PUBLIC_PLAUSIBLE_ENABLED: process.env.NEXT_PUBLIC_PLAUSIBLE_ENABLED,
    NEXT_PUBLIC_SHOW_HIRING_BADGE: process.env.FEATURE_FLAG_HIRING,
    NEXT_PUBLIC_ECOSYSTEMS: process.env.NEXT_PUBLIC_ECOSYSTEMS,
  }
}
