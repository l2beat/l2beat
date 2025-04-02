import { createEnv } from '@t3-oss/env-nextjs'
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

export const env = createEnv({
  /**
   * Server-only environment variables.
   */
  server: {
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
  },

  /**
   * Environment variables exposed to the client (should be prefixed with `NEXT_PUBLIC_`)
   */
  client: {
    NEXT_PUBLIC_FEATURE_FLAG_STAGE_SORTING: featureFlag.default('false'),
    NEXT_PUBLIC_FEATURE_FLAG_DA_THROUGHPUT: featureFlag.default('false'),
    NEXT_PUBLIC_GITCOIN_ROUND_LIVE: featureFlag.default('false'),
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().default('localhost'),
    NEXT_PUBLIC_PLAUSIBLE_ENABLED: coerceBoolean.optional(),
    NEXT_PUBLIC_SHOW_HIRING_BADGE: featureFlag.default('false'),
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    // Server
    DATABASE_URL: process.env.DATABASE_URL,
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
    NEXT_PUBLIC_FEATURE_FLAG_DA_THROUGHPUT:
      process.env.NEXT_PUBLIC_FEATURE_FLAG_DA_THROUGHPUT,
    NEXT_PUBLIC_GITCOIN_ROUND_LIVE: process.env.FEATURE_FLAG_GITCOIN_OPTION,
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    NEXT_PUBLIC_PLAUSIBLE_ENABLED: process.env.NEXT_PUBLIC_PLAUSIBLE_ENABLED,
    NEXT_PUBLIC_SHOW_HIRING_BADGE: process.env.FEATURE_FLAG_HIRING,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  },

  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
})
