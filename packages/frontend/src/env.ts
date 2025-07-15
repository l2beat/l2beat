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
  DEPLOYMENT_ENV: z.enum(['preview', 'production']).optional(),
  CLIENT_SIDE_FEATURE_FLAG_STAGE_SORTING: featureFlag.default(false),
  CLIENT_SIDE_GITCOIN_ROUND_LIVE: featureFlag.default(false),
  CLIENT_SIDE_PLAUSIBLE_DOMAIN: z.string().default('localhost'),
  CLIENT_SIDE_PLAUSIBLE_ENABLED: coerceBoolean.optional(),
  CLIENT_SIDE_SHOW_HIRING_BADGE: featureFlag.default(false),
  CLIENT_SIDE_PARTNERS: coerceBoolean.default(false),
  CLIENT_SIDE_ZK_CATALOG_V2: featureFlag.default(false),
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
  ETHEREUM_RPC_URL: z
    .string()
    .check((v) => !!new URL(v))
    .default('https://cloudflare-eth.com'),
  MOCK: coerceBoolean.default(false),
  CRON_SECRET: z.string().optional(),
  EXCLUDED_ACTIVITY_PROJECTS: stringArray.optional(),
  EXCLUDED_TVS_PROJECTS: stringArray.optional(),

  // Heroku specific (available only on previews)
  HEROKU_APP_NAME: z.string().optional(),

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
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    DEPLOYMENT_ENV: process.env.DEPLOYMENT_ENV,
    CRON_SECRET: process.env.CRON_SECRET,
    EXCLUDED_ACTIVITY_PROJECTS: process.env.EXCLUDED_ACTIVITY_PROJECTS,
    EXCLUDED_TVS_PROJECTS: process.env.EXCLUDED_TVS_PROJECTS,
    ES_ENABLED: process.env.ES_ENABLED,
    ES_NODE: process.env.ES_NODE,
    ES_API_KEY: process.env.ES_API_KEY,
    ES_INDEX_PREFIX: process.env.ES_INDEX_PREFIX,
    ES_FLUSH_INTERVAL: process.env.ES_FLUSH_INTERVAL,

    // Client
    CLIENT_SIDE_FEATURE_FLAG_STAGE_SORTING:
      process.env.CLIENT_SIDE_FEATURE_FLAG_STAGE_SORTING,
    CLIENT_SIDE_GITCOIN_ROUND_LIVE: process.env.FEATURE_FLAG_GITCOIN_OPTION,
    CLIENT_SIDE_PLAUSIBLE_DOMAIN: process.env.CLIENT_SIDE_PLAUSIBLE_DOMAIN,
    CLIENT_SIDE_PLAUSIBLE_ENABLED: process.env.CLIENT_SIDE_PLAUSIBLE_ENABLED,
    CLIENT_SIDE_SHOW_HIRING_BADGE: process.env.FEATURE_FLAG_HIRING,
    CLIENT_SIDE_PARTNERS: process.env.CLIENT_SIDE_PARTNERS,
    CLIENT_SIDE_ZK_CATALOG_V2: process.env.CLIENT_SIDE_ZK_CATALOG_V2,
  }
}
