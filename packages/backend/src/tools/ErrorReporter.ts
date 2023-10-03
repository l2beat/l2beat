import { getEnv, Logger, ReportedError } from '@l2beat/backend-tools'
import * as Sentry from '@sentry/node'
import { Context } from 'koa'

const sentryDsn = getEnv().optionalString('SENTRY_DSN')
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

export function reportError({
  error,
  message,
  parameters,
}: ReportedError): void {
  if (error) {
    Sentry.captureException(error, {
      extra: { message, parameters },
    })
  } else if (message) {
    Sentry.captureMessage(message, {
      level: 'error',
      extra: { parameters },
    })
  } else {
    Sentry.captureMessage('Unknown error', {
      level: 'error',
      extra: { parameters },
    })
  }
}

export async function flushErrors(): Promise<void> {
  if (sentryDsn) {
    const flushed = await Sentry.flush(5_000)
    if (!flushed) {
      console.error('Sentry.flush() timeout')
    }
  }
}

export function handleServerError(logger: Logger, error: Error, ctx: Context) {
  Sentry.withScope((scope) => {
    scope.setSDKProcessingMetadata({ request: ctx.request })
    logger.error({ path: ctx.path, error }) // logging error eventually calls reportError
  })
}
