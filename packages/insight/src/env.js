import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  /**
   * Server-only environment variables.
   */
  server: {
    DATABASE_URL: z
      .string()
      .url()
      .default('postgresql://postgres:password@localhost:5432/l2beat_local'),
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    VERCEL_GIT_COMMIT_SHA: z.string().default('local'),
    VERCEL_GIT_COMMIT_REF: z.string().optional(),
    VERCEL_ENV: z.enum(['production', 'preview', 'development']).optional(),
  },

  /**
   * Environment variables exposed to the client (should be prefixed with `NEXT_PUBLIC_`)
   */
  client: {},

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    // Server
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA,
    VERCEL_GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF,
    VERCEL_ENV: process.env.VERCEL_ENV,
    // Client
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
