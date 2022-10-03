import { Context } from 'koa'
import Rollbar from 'rollbar'

const accessToken = process.env.ROLLBAR_ACCESS_TOKEN
const rollbar = accessToken
  ? new Rollbar({
      accessToken,
      captureUncaught: true,
      captureUnhandledRejections: true,
    })
  : undefined

if (rollbar) {
  console.log('Rollbar integration enabled')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function reportError(...args: any[]): void {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  rollbar?.error(...args)
}

export function handleServerError(error: Error, ctx: Context) {
  reportError(error, ctx)
}
