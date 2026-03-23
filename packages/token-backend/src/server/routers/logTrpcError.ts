import type { Logger } from '@l2beat/backend-tools'
import type { TRPCError } from '@trpc/server'

interface LogTrpcErrorParameters {
  error: TRPCError
  input: unknown
  path: string | undefined
  type: string
}

export function logTrpcError(
  logger: Logger,
  parameters: LogTrpcErrorParameters,
) {
  const { error, input, path, type } = parameters

  const log = error.code === 'UNAUTHORIZED' ? logger.debug : logger.error

  log(error.message, {
    code: error.code,
    input,
    path,
    stack: error.stack,
    type,
  })
}
