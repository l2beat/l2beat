import Bugsnag, { Event } from '@bugsnag/js'
import BugsnagPluginKoa from '@bugsnag/plugin-koa'
import { getEnv, ReportedError } from '@l2beat/backend-tools'

export function initializeErrorReporting() {
  const bugsnagApiKey = getEnv().optionalString('BUGSNAG_API_KEY')

  if (bugsnagApiKey) {
    Bugsnag.start({
      apiKey: bugsnagApiKey,
      plugins: [BugsnagPluginKoa],
      logger: null,
      sendCode: true,
    })
    console.log('Bugsnag integration enabled')
  } else {
    console.log('Bugsnag integration disabled')
  }
}

export function reportError({
  error,
  message,
  parameters,
}: ReportedError): void {
  if (error) {
    Bugsnag.notify(error, modifyError(parameters))
  } else if (message) {
    Bugsnag.notify(message, modifyError(parameters))
  } else {
    Bugsnag.notify('Unknown error', modifyError(parameters))
  }
}

function modifyError(parameters: unknown) {
  return (event: Event) => {
    event.severity = 'error'
    // TODO: event.context = service
    if (parameters) event.addMetadata('parameters', parameters)
  }
}
