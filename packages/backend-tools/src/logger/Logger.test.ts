import { expect, mockFn } from 'earl'

import { Logger } from './Logger'

describe(Logger.name, () => {
  it('calls correct backend', () => {
    const backend = createTestBackend()
    const logger = new Logger({ backend, logLevel: 'TRACE' })

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
      backend,
      logLevel: 'TRACE',
      format: 'json',
      getTime: () => new Date(0),
      utc: true,
    })

    logger.info({ foo: 123n, bar: [4n, 56n] })
    expect(backend.log).toHaveBeenOnlyCalledWith(
      JSON.stringify({
        time: '1970-01-01T00:00:00.000Z',
        level: 'INFO',
        foo: '123',
        bar: ['4', '56'],
      }),
    )
  })

  it('supports bigint values in pretty output', () => {
    const backend = createTestBackend()
    const logger = new Logger({
      backend,
      logLevel: 'TRACE',
      format: 'pretty',
      getTime: () => new Date(0),
      utc: true,
    })

    logger.info({ foo: 123n, bar: [4n, 56n] })
    const lines = [
      '00:00:00.000Z INFO',
      "    { foo: '123', bar: [ '4', '56' ] }",
      '',
    ]
    expect(backend.log).toHaveBeenOnlyCalledWith(lines.join('\n'))
  })

  describe('for', () => {
    function setup() {
      const backend = createTestBackend()
      const baseLogger = new Logger({
        backend,
        logLevel: 'TRACE',
        format: 'pretty',
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
        '00:00:00.000Z INFO [ FooService ] hello\n',
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
        '00:00:00.000Z INFO [ FooService ] hello\n',
      )
    })

    it('service with member', () => {
      const { backend, baseLogger } = setup()

      const logger = baseLogger.for('FooService').for('queue')
      logger.info('hello')

      expect(backend.log).toHaveBeenOnlyCalledWith(
        '00:00:00.000Z INFO [ FooService.queue ] hello\n',
      )
    })

    it('service with tag', () => {
      const { backend, baseLogger } = setup()

      const logger = baseLogger.tag('Red').for('FooService')
      logger.info('hello')

      expect(backend.log).toHaveBeenOnlyCalledWith(
        '00:00:00.000Z INFO [ FooService:Red ] hello\n',
      )
    })

    it('service with tag and member', () => {
      const { backend, baseLogger } = setup()

      const logger = baseLogger.tag('Red').for('FooService').for('queue')
      logger.info('hello')

      expect(backend.log).toHaveBeenOnlyCalledWith(
        '00:00:00.000Z INFO [ FooService.queue:Red ] hello\n',
      )
    })

    it('lone tag', () => {
      const { backend, baseLogger } = setup()

      const logger = baseLogger.tag('Red')
      logger.info('hello')

      expect(backend.log).toHaveBeenOnlyCalledWith(
        '00:00:00.000Z INFO [ :Red ] hello\n',
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

    it('reports error and critical error using reportError if reportCriticalError was not specified', () => {
      const mockReportError = mockFn((_: unknown) => {})
      const logger = new Logger({
        reportError: mockReportError,
      })

      logger.error('foo')
      logger.critical('bar')

      expect(mockReportError).toHaveBeenCalledTimes(2)
      expect(mockReportError).toHaveBeenNthCalledWith(1, {
        message: 'foo',
        parameters: undefined,
        error: undefined,
      })
      expect(mockReportError).toHaveBeenNthCalledWith(2, {
        message: 'bar',
        parameters: undefined,
        error: undefined,
      })
      expect(mockReportError).toHaveBeenExhausted()
    })

    it('reports error and critical error', () => {
      const mockReportError = mockFn((_: unknown) => {})
      const mockReportCriticalError = mockFn((_: unknown) => {})
      const logger = new Logger({
        reportError: mockReportError,
        reportCriticalError: mockReportCriticalError,
      })

      logger.error('foo')
      logger.critical('bar')

      expect(mockReportError).toHaveBeenOnlyCalledWith({
        message: 'foo',
        parameters: undefined,
        error: undefined,
      })
      expect(mockReportCriticalError).toHaveBeenOnlyCalledWith({
        message: 'bar',
        parameters: undefined,
        error: undefined,
      })
    })

    it('reports useful values', () => {
      const mockReportError = mockFn((_: unknown) => {})
      const logger = new Logger({
        reportError: mockReportError,
      })

      logger.error('message')
      expect(mockReportError).toHaveBeenNthCalledWith(1, {
        message: 'message',
        parameters: undefined,
        error: undefined,
      })

      logger.error(new Error('message'))
      expect(mockReportError).toHaveBeenNthCalledWith(2, {
        message: 'message',
        parameters: undefined,
        error: new Error('message'),
      })

      logger.error('foo', new Error('bar'))
      expect(mockReportError).toHaveBeenNthCalledWith(3, {
        message: 'foo',
        parameters: undefined,
        error: new Error('bar'),
      })

      logger.error({ x: 1, y: 2 })
      expect(mockReportError).toHaveBeenNthCalledWith(4, {
        message: undefined,
        parameters: { x: 1, y: 2 },
        error: undefined,
      })

      logger.error('message', { x: 1, y: 2 })
      expect(mockReportError).toHaveBeenNthCalledWith(5, {
        message: 'message',
        parameters: { x: 1, y: 2 },
        error: undefined,
      })

      logger.error({ x: 1, y: 2, message: 'message' })
      expect(mockReportError).toHaveBeenNthCalledWith(6, {
        message: 'message',
        parameters: { x: 1, y: 2, message: 'message' },
        error: undefined,
      })

      logger.error({ x: 1, y: 2, message: true })
      expect(mockReportError).toHaveBeenNthCalledWith(7, {
        message: undefined,
        parameters: { x: 1, y: 2, message: true },
        error: undefined,
      })
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
