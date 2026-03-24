import {
  type LogEntry,
  Logger,
  type LoggerTransport,
} from '@l2beat/backend-tools'
import { TRPCError } from '@trpc/server'
import { expect } from 'earl'
import { logTrpcError } from './logTrpcError'

describe(logTrpcError.name, () => {
  it('logs unauthorized failures at debug level', () => {
    const transport = new TestTransport()
    const logger = new Logger({ level: 'DEBUG', transports: [transport] })

    logTrpcError(logger, {
      error: new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'insufficient access',
      }),
      input: { token: 'missing' },
      path: 'plan.execute',
      type: 'mutation',
    })

    const entry = transport.entries[0]
    if (!entry) {
      throw new Error('Expected a log entry')
    }

    expect(entry.level).toEqual('DEBUG')
    expect(entry.message).toEqual('insufficient access')
    expect(entry.parameters.code).toEqual('UNAUTHORIZED')
  })

  it('logs unexpected failures at error level', () => {
    const transport = new TestTransport()
    const logger = new Logger({ level: 'DEBUG', transports: [transport] })

    logTrpcError(logger, {
      error: new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'boom',
      }),
      input: { token: 'missing' },
      path: 'plan.execute',
      type: 'mutation',
    })

    const entry = transport.entries[0]
    if (!entry) {
      throw new Error('Expected a log entry')
    }

    expect(entry.level).toEqual('ERROR')
    expect(entry.message).toEqual('boom')
    expect(entry.parameters.code).toEqual('INTERNAL_SERVER_ERROR')
  })
})

class TestTransport implements LoggerTransport {
  entries: LogEntry[] = []

  log(entry: LogEntry) {
    this.entries.push(entry)
  }

  flush() {}
}
