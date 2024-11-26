import { init, apm as rum } from '@elastic/apm-rum'
import { env } from '~/env'

export function initRum() {
  const appName = 'test-local-tomek'
  init({
    serviceName: `rum-${appName}`,
    serverUrl: env.NEXT_PUBLIC_APM_URL ?? '',
    environment: env.NEXT_PUBLIC_ENVIRONMENT ?? 'development',
    active: true,
  })
}

export function captureError(error: Error | string) {
  rum.captureError(error)
}
