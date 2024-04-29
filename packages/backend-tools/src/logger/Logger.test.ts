import { expect, formatCompact, mockFn } from 'earl'

import { LogEntry } from './interfaces'
import { LogFormatterJson } from './LogFormatterJson'
import { LogFormatterPretty } from './LogFormatterPretty'
import { Logger } from './Logger'

describe(Logger.name, () => {
  it('calls correct backend', () => {
    const backend = createTestBackend()
    const logger = new Logger({
      backends: [
        {
          backend,
          formatter: new LogFormatterJson(),
        },
      ],
      logLevel: 'TRACE',
    })

    logger.trace('foo')
    logger.debug('foo')
    expect(backend.debug).toHaveBeenCalledTimes(2)

    logger.info('foo')
    expect(backend.log).toHaveBeenCalledTimes(1)

    logger.warn('foo')
    expect(backend.warn).toHaveBeenCalledTimes(1)

    logger.error('foo')
    logger.critical('foo')
    expect(backend.error).toHaveBeenCalledTimes(2)
  })

  it('supports bigint values in json output', () => {
    const backend = createTestBackend()
    const logger = new Logger({
      backends: [
        {
          backend,
          formatter: new LogFormatterJson(),
        },
      ],
      logLevel: 'TRACE',
      getTime: () => new Date(0),
      utc: true,
    })

    logger.info({ foo: 123n, bar: [4n, 56n] })
    expect(backend.log).toHaveBeenOnlyCalledWith(
      JSON.stringify({
        time: '1970-01-01T00:00:00.000Z',
        level: 'INFO',
        parameters: {
          foo: '123',
          bar: ['4', '56'],
        },
      }),
    )
  })

  it('supports bigint values in pretty output', () => {
    const backend = createTestBackend()
    const logger = new Logger({
      backends: [
        {
          backend,
          formatter: new LogFormatterPretty(false, true),
        },
      ],
      logLevel: 'TRACE',
      getTime: () => new Date(0),
      utc: true,
    })

    logger.info({ foo: 123n, bar: [4n, 56n] })
    const lines = [
      '00:00:00.000Z INFO\n',
      "    { foo: '123', bar: [ '4', '56' ] }",
      '',
    ]
    expect(backend.log).toHaveBeenOnlyCalledWith(lines.join(''))
  })

  describe('for', () => {
    function setup() {
      const backend = createTestBackend()
      const baseLogger = new Logger({
        backends: [
          {
            backend,
            formatter: new LogFormatterPretty(false, true),
          },
        ],
        logLevel: 'TRACE',
        getTime: () => new Date(0),
        utc: true,
      })
      return { backend, baseLogger }
    }

    it('single service (string)', () => {
      const { backend, baseLogger } = setup()

      const logger = baseLogger.for('FooService')
      logger.info('hello')

      expect(backend.log).toHaveBeenOnlyCalledWith(
        '00:00:00.000Z INFO [ FooService ] hello',
      )
    })

    it('single service (object)', () => {
      const { backend, baseLogger } = setup()

      // eslint-disable-next-line @typescript-eslint/no-extraneous-class
      class FooService {}
      const instance = new FooService()
      const logger = baseLogger.for(instance)
      logger.info('hello')

      expect(backend.log).toHaveBeenOnlyCalledWith(
        '00:00:00.000Z INFO [ FooService ] hello',
      )
    })

    it('service with member', () => {
      const { backend, baseLogger } = setup()

      const logger = baseLogger.for('FooService').for('queue')
      logger.info('hello')

      expect(backend.log).toHaveBeenOnlyCalledWith(
        '00:00:00.000Z INFO [ FooService.queue ] hello',
      )
    })

    it('service with tag', () => {
      const { backend, baseLogger } = setup()

      const logger = baseLogger.tag('Red').for('FooService')
      logger.info('hello')

      expect(backend.log).toHaveBeenOnlyCalledWith(
        '00:00:00.000Z INFO [ FooService:Red ] hello',
      )
    })

    it('service with tag and member', () => {
      const { backend, baseLogger } = setup()

      const logger = baseLogger.tag('Red').for('FooService').for('queue')
      logger.info('hello')

      expect(backend.log).toHaveBeenOnlyCalledWith(
        '00:00:00.000Z INFO [ FooService.queue:Red ] hello',
      )
    })

    it('lone tag', () => {
      const { backend, baseLogger } = setup()

      const logger = baseLogger.tag('Red')
      logger.info('hello')

      expect(backend.log).toHaveBeenOnlyCalledWith(
        '00:00:00.000Z INFO [ :Red ] hello',
      )
    })
  })

  describe('error reporting', () => {
    const oldConsoleError = console.error
    beforeEach(() => {
      console.error = () => {}
    })
    afterEach(() => {
      console.error = oldConsoleError
    })

    it('reports error and critical error', () => {
      const mockReportError = mockFn((_: unknown) => {})
      const logger = new Logger({
        reportError: mockReportError,
      })

      logger.error('foo')
      logger.critical('bar')

      expect(mockReportError).toHaveBeenNthCalledWith(1, {
        level: 'ERROR',
        time: expect.a(Date),
        service: undefined,
        message: 'foo',
        parameters: undefined,
        error: undefined,
        resolvedError: undefined,
      })
      expect(mockReportError).toHaveBeenNthCalledWith(2, {
        level: 'CRITICAL',
        time: expect.a(Date),
        service: undefined,
        message: 'bar',
        parameters: undefined,
        error: undefined,
        resolvedError: undefined,
      })
    })

    describe('usage patterns', () => {
      const patterns: [unknown[], LogEntry][] = [
        [
          ['message'],
          {
            level: 'ERROR',
            time: expect.a(Date),
            service: undefined,
            message: 'message',
            parameters: undefined,
            error: undefined,
            resolvedError: undefined,
          },
        ],
        [
          [new Error('message')],
          {
            level: 'ERROR',
            time: expect.a(Date),
            service: undefined,
            message: undefined,
            parameters: undefined,
            error: new Error('message'),
            resolvedError: {
              name: 'Error',
              error: 'message',
              stack: expect.a(Array),
            },
          },
        ],
        [
          ['foo', new Error('bar')],
          {
            level: 'ERROR',
            time: expect.a(Date),
            service: undefined,
            message: 'foo',
            parameters: undefined,
            error: new Error('bar'),
            resolvedError: {
              name: 'Error',
              error: 'bar',
              stack: expect.a(Array),
            },
          },
        ],
        [
          [{ x: 1, y: 2 }],
          {
            level: 'ERROR',
            time: expect.a(Date),
            service: undefined,
            message: undefined,
            parameters: { x: 1, y: 2 },
            error: undefined,
            resolvedError: undefined,
          },
        ],
        [
          ['message', { x: 1, y: 2 }],
          {
            level: 'ERROR',
            time: expect.a(Date),
            service: undefined,
            message: 'message',
            parameters: { x: 1, y: 2 },
            error: undefined,
            resolvedError: undefined,
          },
        ],
        [
          [{ x: 1, y: 2, message: 'message' }],
          {
            level: 'ERROR',
            time: expect.a(Date),
            service: undefined,
            message: 'message',
            parameters: { x: 1, y: 2 },
            error: undefined,
            resolvedError: undefined,
          },
        ],
        [
          [{ x: 1, y: 2, message: true }],
          {
            level: 'ERROR',
            time: expect.a(Date),
            service: undefined,
            message: undefined,
            parameters: { x: 1, y: 2, message: true },
            error: undefined,
            resolvedError: undefined,
          },
        ],
        [
          [new Error('foo'), 'bar', { x: 1, y: 2 }],
          {
            level: 'ERROR',
            time: expect.a(Date),
            service: undefined,
            message: 'bar',
            parameters: { x: 1, y: 2 },
            error: new Error('foo'),
            resolvedError: {
              name: 'Error',
              error: 'foo',
              stack: expect.a(Array),
            },
          },
        ],
      ]

      for (const [args, expected] of patterns) {
        it(`supports ${formatCompact(args, 60)}`, () => {
          const mockReportError = mockFn((_: unknown) => {})
          const logger = new Logger({ reportError: mockReportError })

          logger.error(...args)
          expect(mockReportError).toHaveBeenOnlyCalledWith(expected)
        })
      }
    })
  })
})

function createTestBackend() {
  return {
    debug: mockFn((_: string): void => {}),
    log: mockFn((_: string): void => {}),
    warn: mockFn((_: string): void => {}),
    error: mockFn((_: string): void => {}),
  }
}
