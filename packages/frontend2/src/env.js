import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const coerceBoolean = z.string().transform((val) => {
  return val !== 'false' && val !== '0'
})

const featureFlag = coerceBoolean.optional()

export const env = createEnv({
  /**
   * Server-only environment variables.
   */
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    FEATURE_FLAG_ACTIVITY: featureFlag.default('true'),
    FEATURE_FLAG_ASSET_RISKS: featureFlag.default('false'),
    FEATURE_FLAG_COSTS: featureFlag.default('true'),
    FEATURE_FLAG_FINALITY: featureFlag.default('true'),
    FEATURE_FLAG_GITCOIN_OPTION: featureFlag.default('false'),
    FEATURE_FLAG_GLOSSARY: featureFlag.default('true'),
    FEATURE_FLAG_GOVERNANCE: featureFlag.default('true'),
    FEATURE_FLAG_HIRING: featureFlag.default('true'),
    FEATURE_FLAG_LIVENESS: featureFlag.default('true'),
    FEATURE_FLAG_ZK_CATALOG: featureFlag.default('false'),
    ETHEREUM_RPC_URL: z.string().url().default('https://cloudflare-eth.com'),
  },

  /**
   * Environment variables exposed to the client (should be prefixed with `NEXT_PUBLIC_`)
   */
  client: {
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().default('localhost'),
    NEXT_PUBLIC_PLAUSIBLE_ENABLED: coerceBoolean.optional(),
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    FEATURE_FLAG_ACTIVITY: process.env.FEATURE_FLAG_ACTIVITY,
    FEATURE_FLAG_ASSET_RISKS: process.env.FEATURE_FLAG_ASSET_RISKS,
    FEATURE_FLAG_COSTS: process.env.FEATURE_FLAG_COSTS,
    FEATURE_FLAG_FINALITY: process.env.FEATURE_FLAG_FINALITY,
    FEATURE_FLAG_GITCOIN_OPTION: process.env.FEATURE_FLAG_GITCOIN_OPTION,
    FEATURE_FLAG_GLOSSARY: process.env.FEATURE_FLAG_GLOSSARY,
    FEATURE_FLAG_GOVERNANCE: process.env.FEATURE_FLAG_GOVERNANCE,
    FEATURE_FLAG_HIRING: process.env.FEATURE_FLAG_HIRING,
    FEATURE_FLAG_LIVENESS: process.env.FEATURE_FLAG_LIVENESS,
    FEATURE_FLAG_ZK_CATALOG: process.env.FEATURE_FLAG_ZK_CATALOG,
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    NEXT_PUBLIC_PLAUSIBLE_ENABLED: process.env.NEXT_PUBLIC_PLAUSIBLE_ENABLED,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    ETHEREUM_RPC_URL: process.env.ETHEREUM_RPC_URL,
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
