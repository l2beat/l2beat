import { v as z } from '@l2beat/validate'

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
  DEPLOYMENT_ENV: z.enum(['preview', 'staging', 'production']).optional(),
  CLIENT_SIDE_GITCOIN_ROUND_LIVE: featureFlag.default(false),
  CLIENT_SIDE_PLAUSIBLE_DOMAIN: z.string().default('localhost'),
  CLIENT_SIDE_PLAUSIBLE_ENABLED: coerceBoolean.optional(),
  CLIENT_SIDE_SHOW_HIRING_BADGE: featureFlag.default(false),
  CLIENT_SIDE_TRACKED_TXS_OUTAGE: featureFlag.default(false),
  CLIENT_SIDE_INTEROP_ENABLED: featureFlag.default(false),
}
const ClientEnv = z.object(CLIENT_CONFIG)

const SERVER_CONFIG = {
  ...CLIENT_CONFIG,
  DATABASE_URL: z
    .string()
    .check((v) => !!new URL(v))
    .default('postgresql://postgres:password@localhost:5432/l2beat_local'),
  DATABASE_LOG_ENABLED: coerceBoolean.default(false),
  DISABLE_CACHE: coerceBoolean.default(false),
  MOCK: coerceBoolean.default(false),
  REDIS_URL: z.string().optional(),
  EXCLUDED_ACTIVITY_PROJECTS: stringArray.optional(),
  EXCLUDED_TVS_PROJECTS: stringArray.optional(),

  COOLIFY_URL: z.string().optional(),
  COOLIFY_RESOURCE_UUID: z.string().optional(),

  LOG_LEVEL: z
    .enum(['NONE', 'CRITICAL', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'])
    .default('INFO'),

  // Elastic Search
  ES_ENABLED: coerceBoolean.default(false),
  ES_NODE: z
    .string()
    .check((v) => !!new URL(v))
    .optional(),
  ES_API_KEY: z.string().optional(),
  ES_INDEX_PREFIX: z.string().optional(),
  ES_FLUSH_INTERVAL: z
    .unknown()
    .transform((v) => Number(v))
    .optional(),
}
const ServerEnv = z.object(SERVER_CONFIG)

type Env = z.infer<typeof ServerEnv>

export const rawEnv = getRawEnv()
export const env = parseEnv(rawEnv)

function parseEnv(rawEnv: ReturnType<typeof getRawEnv>): Env {
  const isClient = typeof window !== 'undefined'

  for (const key in rawEnv) {
    if (rawEnv[key as keyof Env] === '') {
      delete rawEnv[key as keyof Env]
    }
  }

  const parsed = isClient ? ClientEnv.parse(rawEnv) : ServerEnv.parse(rawEnv)
  return new Proxy<Env>(parsed as Env, {
    get(target, key, receiver) {
      if (!Reflect.has(SERVER_CONFIG, key) && key !== 'toJSON') {
        throw new Error(`Accessing invalid env: ${key.toString()}`)
      }

      return Reflect.get(target, key, receiver)
    },
  })
}

function getRawEnv(): Record<
  keyof z.infer<typeof ServerEnv>,
  string | undefined
> {
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
    MOCK: process.env.MOCK,
    NODE_ENV: process.env.NODE_ENV,
    COOLIFY_URL: process.env.COOLIFY_URL,
    COOLIFY_RESOURCE_UUID: process.env.COOLIFY_RESOURCE_UUID,
    DEPLOYMENT_ENV: process.env.DEPLOYMENT_ENV,
    REDIS_URL: process.env.REDIS_URL,
    EXCLUDED_ACTIVITY_PROJECTS: process.env.EXCLUDED_ACTIVITY_PROJECTS,
    EXCLUDED_TVS_PROJECTS: process.env.EXCLUDED_TVS_PROJECTS,
    ES_ENABLED: process.env.ES_ENABLED,
    ES_NODE: process.env.ES_NODE,
    ES_API_KEY: process.env.ES_API_KEY,
    ES_INDEX_PREFIX: process.env.ES_INDEX_PREFIX,
    ES_FLUSH_INTERVAL: process.env.ES_FLUSH_INTERVAL,
    LOG_LEVEL: process.env.LOG_LEVEL,
    // Client
    CLIENT_SIDE_GITCOIN_ROUND_LIVE: process.env.CLIENT_SIDE_GITCOIN_ROUND_LIVE,
    CLIENT_SIDE_PLAUSIBLE_DOMAIN: process.env.CLIENT_SIDE_PLAUSIBLE_DOMAIN,
    CLIENT_SIDE_PLAUSIBLE_ENABLED: process.env.CLIENT_SIDE_PLAUSIBLE_ENABLED,
    CLIENT_SIDE_SHOW_HIRING_BADGE: process.env.CLIENT_SIDE_SHOW_HIRING_BADGE,
    CLIENT_SIDE_TRACKED_TXS_OUTAGE: process.env.CLIENT_SIDE_TRACKED_TXS_OUTAGE,
    CLIENT_SIDE_INTEROP_ENABLED: process.env.CLIENT_SIDE_INTEROP_ENABLED,
  }
}
