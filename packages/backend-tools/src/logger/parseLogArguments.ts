export interface ParsedLogArguments {
  message?: string
  chain?: string
  project?: string
  error?: Error
  parameters?: object
}

export function parseLogArguments(args: unknown[]): ParsedLogArguments {
  let message: string | undefined
  let error: Error | undefined
  let chain: string | undefined
  let project: string | undefined
  const values: unknown[] = []
  let parameters = {}

  for (const arg of args) {
    if (typeof arg === 'string') {
      if (message === undefined) {
        message = arg
      } else {
        values.push(arg)
      }
    } else if (arg instanceof Error) {
      if (error === undefined) {
        error = arg
      } else {
        values.push(arg)
      }
    } else if (typeof arg !== 'object' || arg === null || Array.isArray(arg)) {
      values.push(arg)
    } else {
      parameters = { ...parameters, ...arg }
    }
  }

  // place values in parameters
  if (values.length === 1) {
    parameters = { value: values[0], ...parameters }
  } else if (values.length > 1) {
    parameters = { values, ...parameters }
  }

  // optionally extract message from parameters
  const parameterMessage: unknown = Reflect.get(parameters, 'message')
  if (message === undefined && typeof parameterMessage === 'string') {
    message = parameterMessage
    Reflect.deleteProperty(parameters, 'message')
  }

  // optionally extract error from parameters
  const parameterError: unknown = Reflect.get(parameters, 'error')
  if (error === undefined && parameterError instanceof Error) {
    error = parameterError
    Reflect.deleteProperty(parameters, 'error')
  }

  const parameterChain: unknown = Reflect.get(parameters, 'chain')
  if (typeof parameterChain === 'string') {
    chain = parameterChain
    Reflect.deleteProperty(parameters, 'chain')
  }

  const parameterProject: unknown = Reflect.get(parameters, 'project')
  if (typeof parameterProject === 'string') {
    project = parameterProject
    Reflect.deleteProperty(parameters, 'project')
  }

  return {
    message,
    chain,
    project,
    error,
    parameters: Object.keys(parameters).length > 0 ? parameters : undefined,
  }
}
