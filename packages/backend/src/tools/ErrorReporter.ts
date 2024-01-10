import Bugsnag, { Event } from '@bugsnag/js'
import BugsnagPluginKoa from '@bugsnag/plugin-koa'
import { ReportedError } from '@l2beat/backend-tools'

import { Config } from '../config/Config'

export function initializeErrorReporting(config: Config) {
  if (config.errorReporting) {
    Bugsnag.start({
      apiKey: config.errorReporting.bugsnagApiKey,
      releaseStage: config.errorReporting.environment,
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
