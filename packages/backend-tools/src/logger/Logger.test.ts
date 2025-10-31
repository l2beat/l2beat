import { expect, mockFn } from 'earl'
import { Logger } from './Logger'
import type { LoggerTransport } from './types'

class TestTransport implements LoggerTransport {
  log = mockFn<LoggerTransport['log']>().returns()
  flush = mockFn<LoggerTransport['flush']>().returns()
}

describe(Logger.name, () => {
  it('calls all transports', () => {
    const transport1 = new TestTransport()
    const transport2 = new TestTransport()
    const logger = new Logger({
      transports: [transport1, transport2],
    })
    logger.info('Hello')
    expect(transport1.log).toHaveBeenCalled()
    expect(transport2.log).toHaveBeenCalled()
  })

  describe('configuration', () => {
    it('can be reconfigured', () => {
      let logger = new Logger({ level: 'INFO' })
      expect(logger.options.level).toEqual('INFO')
      logger = logger.configure({ level: 'ERROR' })
      expect(logger.options.level).toEqual('ERROR')
    })

    it('supports tags', () => {
      const getTime = () => new Date(0)
      const transport = new TestTransport()
      const logger = new Logger(
        { getTime, transports: [transport] },
        { foo: 'bar' },
      )
      logger.info('Hello', { baz: false })
      expect(transport.log).toHaveBeenCalledWith(new Date(0), 'INFO', 'Hello', {
        foo: 'bar',
        baz: false,
      })
    })

    it('can reconfigure tags', () => {
      const getTime = () => new Date(0)
      const transport = new TestTransport()
      let logger = new Logger(
        { getTime, transports: [transport] },
        { foo: 'bar' },
      )
      logger = logger.tag({ foo: 'oof', baz: false })
      logger.info('Hello', { x: 1 })
      expect(transport.log).toHaveBeenCalledWith(new Date(0), 'INFO', 'Hello', {
        foo: 'oof',
        baz: false,
        x: 1,
      })
    })

    it('for string', () => {
      const logger = Logger.INFO.for('FooService')
      expect(logger.tags).toEqual({ service: 'FooService' })
    })

    it('for class instance', () => {
      const fooService = new (class FooService {})()
      const logger = Logger.INFO.for(fooService)
      expect(logger.tags).toEqual({ service: 'FooService' })
    })

    it('for member', () => {
      const logger = Logger.INFO.for('FooService').for('queue')
      expect(logger.tags).toEqual({ service: 'FooService.queue' })
    })
  })

  describe('parameters', () => {
    const getTime = () => new Date(0)

    it('just message', () => {
      const transport = new TestTransport()
      const logger = new Logger({ getTime, transports: [transport] })
      logger.info('Hello')
      expect(transport.log).toHaveBeenCalledWith(
        new Date(0),
        'INFO',
        'Hello',
        {},
      )
    })

    it('message and parameters', () => {
      const transport = new TestTransport()
      const logger = new Logger({ getTime, transports: [transport] })
      logger.info('Hello', { foo: 'bar' })
      expect(transport.log).toHaveBeenCalledWith(new Date(0), 'INFO', 'Hello', {
        foo: 'bar',
      })
    })

    it('message in parameters', () => {
      const transport = new TestTransport()
      const logger = new Logger({ getTime, transports: [transport] })
      logger.info({ message: 'Hello', foo: 'bar' })
      expect(transport.log).toHaveBeenCalledWith(new Date(0), 'INFO', 'Hello', {
        foo: 'bar',
      })
    })

    it('only parameters', () => {
      const transport = new TestTransport()
      const logger = new Logger({ getTime, transports: [transport] })
      logger.info({ foo: 'bar' })
      expect(transport.log).toHaveBeenCalledWith(new Date(0), 'INFO', '', {
        foo: 'bar',
      })
    })

    it('multiple parameters', () => {
      const transport = new TestTransport()
      const logger = new Logger({ getTime, transports: [transport] })
      logger.info({ foo: 'bar' }, { baz: false })
      expect(transport.log).toHaveBeenCalledWith(new Date(0), 'INFO', '', {
        foo: 'bar',
        baz: false,
      })
    })

    it('value', () => {
      const transport = new TestTransport()
      const logger = new Logger({ getTime, transports: [transport] })
      logger.info(123)
      expect(transport.log).toHaveBeenCalledWith(new Date(0), 'INFO', '', {
        value: 123,
      })
    })

    it('values', () => {
      const transport = new TestTransport()
      const logger = new Logger({ getTime, transports: [transport] })
      logger.info(123, false)
      expect(transport.log).toHaveBeenCalledWith(new Date(0), 'INFO', '', {
        values: [123, false],
      })
    })

    it('values and message', () => {
      const transport = new TestTransport()
      const logger = new Logger({ getTime, transports: [transport] })
      logger.info(123, false, 'foo', 'bar')
      expect(transport.log).toHaveBeenCalledWith(new Date(0), 'INFO', 'foo', {
        values: [123, false, 'bar'],
      })
    })

    it('standalone error', () => {
      const error = new Error('Oops')
      const transport = new TestTransport()
      const logger = new Logger({ getTime, transports: [transport] })
      logger.info(error)
      expect(transport.log).toHaveBeenCalledWith(new Date(0), 'INFO', '', {
        error: {
          name: 'Error',
          error: 'Oops',
          stack: expect.a(Array),
        },
      })
    })

    it('error in parameters', () => {
      const error = new Error('Oops')
      const transport = new TestTransport()
      const logger = new Logger({ getTime, transports: [transport] })
      logger.info({ error })
      expect(transport.log).toHaveBeenCalledWith(new Date(0), 'INFO', '', {
        error: {
          name: 'Error',
          error: 'Oops',
          stack: expect.a(Array),
        },
      })
    })
  })
})
