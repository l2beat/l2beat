import * as Sentry from '@sentry/node'
import { Context } from 'koa'

const sentryDsn = process.env.SENTRY_DSN

if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })
  console.log('Sentry integration enabled')
}

export function reportError(...args: unknown[]): void {
  // note: we can't be sure that first arg is an error
  if (args[0] instanceof Error) {
    Sentry.captureException(args[0], { extra: { context: args.slice(1) } })
  } else {
    Sentry.captureException(new Error('unknown'), { extra: { context: args } })
  }
}

export function handleServerError(error: Error, ctx: Context) {
  reportError(error, ctx)
}
