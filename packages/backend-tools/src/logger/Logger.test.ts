import { expect, formatCompact, mockFn } from 'earl'

import { LogFormatterEcs } from './LogFormatterEcs'
import { LogFormatterJson } from './LogFormatterJson'
import { LogFormatterPretty } from './LogFormatterPretty'
import { Logger } from './Logger'
import type { LogEntry } from './types'

describe(Logger.name, () => {
  it('calls correct transport', () => {
    const transport = createTestTransport()
    const logger = new Logger({
      transports: [
        {
          transport: transport,
          formatter: new LogFormatterJson(),
        },
      ],
      logLevel: 'TRACE',
    })

    logger.trace('foo')
    logger.debug('foo')
    expect(transport.debug).toHaveBeenCalledTimes(2)

    logger.info('foo')
    expect(transport.log).toHaveBeenCalledTimes(1)

    logger.warn('foo')
    expect(transport.warn).toHaveBeenCalledTimes(1)

    logger.error('foo')
    logger.critical('foo')
    expect(transport.error).toHaveBeenCalledTimes(2)
  })

  it('supports bigint values in json output', () => {
    const transport = createTestTransport()
    const logger = new Logger({
      transports: [
        {
          transport: transport,
          formatter: new LogFormatterJson(),
        },
      ],
      logLevel: 'TRACE',
      getTime: () => new Date(0),
      utc: true,
    })

    logger.info({ foo: 123n, bar: [4n, 56n] })
    expect(transport.log).toHaveBeenOnlyCalledWith(
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
    const transport = createTestTransport()
    const logger = new Logger({
      transports: [
        {
          transport: transport,
          formatter: new LogFormatterPretty({ colors: false, utc: true }),
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
    expect(transport.log).toHaveBeenOnlyCalledWith(lines.join(''))
  })

  describe('for', () => {
    function setup(
      formatter: LogFormatterPretty | LogFormatterEcs = new LogFormatterPretty({
        colors: false,
        utc: true,
      }),
    ) {
      const transport = createTestTransport()
      const baseLogger = new Logger({
        transports: [
          {
            transport: transport,
            formatter,
          },
        ],
        logLevel: 'TRACE',
        getTime: () => new Date(0),
        utc: true,
      })
      return { transport, baseLogger }
    }

    it('single service (string)', () => {
      const { transport, baseLogger } = setup()

      const logger = baseLogger.for('FooService')
      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith(
        '00:00:00.000Z INFO [ FooService ] hello',
      )
    })

    it('single service (object)', () => {
      const { transport, baseLogger } = setup()

      class FooService {}
      const instance = new FooService()
      const logger = baseLogger.for(instance)
      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith(
        '00:00:00.000Z INFO [ FooService ] hello',
      )
    })

    it('service with member', () => {
      const { transport, baseLogger } = setup()

      const logger = baseLogger.for('FooService').for('queue')
      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith(
        '00:00:00.000Z INFO [ FooService.queue ] hello',
      )
    })

    it('service with tag', () => {
      const { transport, baseLogger } = setup()

      const logger = baseLogger.tag({ tag: 'Red' }).for('FooService')
      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith(
        '00:00:00.000Z INFO [ FooService:Red ] hello',
      )
    })

    it('service with tag and member', () => {
      const { transport, baseLogger } = setup()

      const logger = baseLogger
        .tag({ tag: 'Red' })
        .for('FooService')
        .for('queue')
      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith(
        '00:00:00.000Z INFO [ FooService.queue:Red ] hello',
      )
    })

    it('lone tag', () => {
      const { transport, baseLogger } = setup()

      const logger = baseLogger.tag({ tag: 'Red' })
      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith(
        '00:00:00.000Z INFO [ :Red ] hello',
      )
    })

    it('module', () => {
      const { transport, baseLogger } = setup(new LogFormatterEcs())

      const logger = baseLogger.tag({
        module: 'module',
      })

      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith(
        JSON.stringify({
          '@timestamp': '1970-01-01T00:00:00.000Z',
          log: { level: 'INFO' },
          service: {},
          labels: {
            module: 'module',
          },
          message: 'hello',
        }),
      )
    })

    it('feature', () => {
      const { transport, baseLogger } = setup(new LogFormatterEcs())

      const logger = baseLogger.tag({
        module: 'module',
        feature: 'feature',
      })

      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith(
        JSON.stringify({
          '@timestamp': '1970-01-01T00:00:00.000Z',
          log: { level: 'INFO' },
          service: {},
          labels: {
            feature: 'feature',
            module: 'module',
          },
          message: 'hello',
        }),
      )
    })

    it('source', () => {
      const { transport, baseLogger } = setup(new LogFormatterEcs())

      const logger = baseLogger.tag({
        source: 'source',
      })

      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith(
        JSON.stringify({
          '@timestamp': '1970-01-01T00:00:00.000Z',
          log: { level: 'INFO' },
          service: {},
          labels: {
            source: 'source',
          },
          message: 'hello',
        }),
      )
    })

    it('service tag', () => {
      const { transport, baseLogger } = setup(new LogFormatterEcs())

      const logger = baseLogger.tag({
        tag: 'tag',
        feature: 'feature',
        module: 'module',
      })

      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith(
        JSON.stringify({
          '@timestamp': '1970-01-01T00:00:00.000Z',
          log: { level: 'INFO' },
          service: {
            name: ':tag',
          },
          labels: {
            feature: 'feature',
            module: 'module',
          },
          message: 'hello',
        }),
      )
    })

    it('project', () => {
      const { transport, baseLogger } = setup(new LogFormatterEcs())

      const logger = baseLogger.tag({
        feature: 'feature',
        module: 'module',
        project: 'project',
      })

      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith(
        JSON.stringify({
          '@timestamp': '1970-01-01T00:00:00.000Z',
          log: { level: 'INFO' },
          service: {},
          labels: {
            feature: 'feature',
            module: 'module',
            project: 'project',
          },
          message: 'hello',
        }),
      )
    })

    it('chain', () => {
      const { transport, baseLogger } = setup(new LogFormatterEcs())

      const logger = baseLogger.tag({
        feature: 'feature',
        module: 'module',
        chain: 'chain',
      })

      logger.info('hello')

      expect(transport.log).toHaveBeenOnlyCalledWith(
        JSON.stringify({
          '@timestamp': '1970-01-01T00:00:00.000Z',
          log: { level: 'INFO' },
          service: {},
          labels: {
            feature: 'feature',
            module: 'module',
            chain: 'chain',
          },
          message: 'hello',
        }),
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
        feature: undefined,
        module: undefined,
        chain: undefined,
        project: undefined,
        source: undefined,
        message: 'foo',
        parameters: undefined,
        error: undefined,
        resolvedError: undefined,
      })
      expect(mockReportError).toHaveBeenNthCalledWith(2, {
        level: 'CRITICAL',
        time: expect.a(Date),
        service: undefined,
        feature: undefined,
        module: undefined,
        chain: undefined,
        project: undefined,
        source: undefined,
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
            feature: undefined,
            module: undefined,
            chain: undefined,
            project: undefined,
            source: undefined,
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
            feature: undefined,
            module: undefined,
            chain: undefined,
            project: undefined,
            source: undefined,
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
            feature: undefined,
            module: undefined,
            chain: undefined,
            project: undefined,
            source: undefined,
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
            feature: undefined,
            module: undefined,
            chain: undefined,
            project: undefined,
            source: undefined,
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
            feature: undefined,
            module: undefined,
            chain: undefined,
            project: undefined,
            source: undefined,
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
            feature: undefined,
            module: undefined,
            chain: undefined,
            project: undefined,
            source: undefined,
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
            feature: undefined,
            module: undefined,
            chain: undefined,
            project: undefined,
            source: undefined,
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
            feature: undefined,
            module: undefined,
            chain: undefined,
            project: undefined,
            source: undefined,
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
        [
          [
            'message',
            {
              chain: 'chain',
              project: 'project',
              x: 4,
              y: 5,
            },
          ],
          {
            level: 'ERROR',
            time: expect.a(Date),
            service: undefined,
            feature: undefined,
            module: undefined,
            chain: 'chain',
            project: 'project',
            source: undefined,
            message: 'message',
            parameters: { x: 4, y: 5 },
            error: undefined,
            resolvedError: undefined,
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

function createTestTransport() {
  return {
    debug: mockFn((_: string): void => {}),
    log: mockFn((_: string): void => {}),
    warn: mockFn((_: string): void => {}),
    error: mockFn((_: string): void => {}),
  }
}
