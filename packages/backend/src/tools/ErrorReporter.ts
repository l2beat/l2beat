import Bugsnag, { Event } from '@bugsnag/js'
import BugsnagPluginKoa from '@bugsnag/plugin-koa'
import { LogEntry } from '@l2beat/backend-tools'

export function initializeErrorReporting(apiKey: string, environment: string) {
  Bugsnag.start({
    apiKey,
    releaseStage: environment,
    plugins: [BugsnagPluginKoa],
    logger: null,
    sendCode: true,
  })
  console.log('Bugsnag integration enabled')
}

export function reportError(logEntry: LogEntry): void {
  if (logEntry.error) {
    Bugsnag.notify(logEntry.error, modifyError(logEntry))
  } else if (logEntry.message) {
    Bugsnag.notify(logEntry.message, modifyError(logEntry))
  } else {
    Bugsnag.notify('Unknown error', modifyError(logEntry))
  }
}

function modifyError({ parameters, service }: LogEntry) {
  return (event: Event) => {
    event.severity = 'error'
    if (service) event.context = service
    if (parameters) event.addMetadata('parameters', parameters)
  }
}
