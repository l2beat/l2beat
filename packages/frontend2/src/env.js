import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

const coerceBoolean = z.string().transform((val) => {
  return val !== 'false' && val !== '0'
})

const base64url = z.string().regex(/^[a-zA-Z0-9_-]+$/)

export const env = createEnv({
  /**
   * Server-only environment variables.
   */
  server: {
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    FALLBACK_REWRITE_DESTINATION: z
      .enum(['local', 'vercel-mock', 'vercel-staging', 'vercel-production'])
      .transform(
        (val) =>
          ({
            local: 'http://localhost:8080',
            'vercel-mock': 'https://l2beat-mock.vercel.app',
            'vercel-staging': 'https://l2beat-staging.vercel.app',
            'vercel-production': 'https://l2beat-production.vercel.app',
          })[val],
      )
      .default('local'),
    FEATURE_FLAG_ASSET_RISKS: coerceBoolean.optional().default('0'),
  },

  /**
   * Environment variables exposed to the client (should be prefixed with `NEXT_PUBLIC_`)
   */
  client: {
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: z.string().default('localhost'),
    NEXT_PUBLIC_PLAUSIBLE_ENABLED: coerceBoolean.optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    FALLBACK_REWRITE_DESTINATION: process.env.FALLBACK_REWRITE_DESTINATION,
    FEATURE_FLAG_ASSET_RISKS: process.env.FEATURE_FLAG_ASSET_RISKS,
    NEXT_PUBLIC_PLAUSIBLE_DOMAIN: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    NEXT_PUBLIC_PLAUSIBLE_ENABLED: process.env.NEXT_PUBLIC_PLAUSIBLE_ENABLED,
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
