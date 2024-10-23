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
    VERCEL_GIT_COMMIT_REF: z.string().optional(),
    VERCEL_GIT_COMMIT_SHA: z.string().default('local'),
    VERCEL_URL: z.string().optional(),
    VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
    EXCLUDED_ACTIVITY_PROJECTS: stringArray.optional(),
    EXCLUDED_TVL_PROJECTS: stringArray.optional(),
  },

  /**
   * Environment variables exposed to the client (should be prefixed with `NEXT_PUBLIC_`)
   */
  client: {
    NEXT_PUBLIC_FEATURE_FLAG_ASSET_RISKS: featureFlag.default('false'),
    NEXT_PUBLIC_FEATURE_FLAG_DA_BEAT: featureFlag.default('false'),
    NEXT_PUBLIC_FEATURE_FLAG_RECATEGORISATION: featureFlag.default('false'),
    NEXT_PUBLIC_FEATURE_FLAG_OTHER_PROJECTS: featureFlag.default('false'),
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
    VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
    VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    EXCLUDED_ACTIVITY_PROJECTS: process.env.EXCLUDED_ACTIVITY_PROJECTS,
    EXCLUDED_TVL_PROJECTS: process.env.EXCLUDED_TVL_PROJECTS,
    // Client
    NEXT_PUBLIC_FEATURE_FLAG_ASSET_RISKS:
      process.env.NEXT_PUBLIC_FEATURE_FLAG_ASSET_RISKS,
    NEXT_PUBLIC_FEATURE_FLAG_DA_BEAT:
      process.env.NEXT_PUBLIC_FEATURE_FLAG_DA_BEAT,
    NEXT_PUBLIC_FEATURE_FLAG_RECATEGORISATION:
      process.env.NEXT_PUBLIC_FEATURE_FLAG_RECATEGORISATION,
    NEXT_PUBLIC_FEATURE_FLAG_OTHER_PROJECTS:
      process.env.NEXT_PUBLIC_FEATURE_FLAG_OTHER_PROJECTS,
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
