import { expect } from 'earl'
import { formatPlain, utcTime } from './ConsoleTransport'

describe(formatPlain.name, () => {
  const time = new Date('1970-01-01T12:34:56.789Z')

  it('basic output', () => {
    const format = formatPlain(utcTime)
    const message = format({
      time,
      level: 'INFO',
      message: 'Hello',
      parameters: { foo: 'bar' },
    })
    expect(message).toEqual('12:34:56.789 INFO Hello {"foo":"bar"}')
  })

  it('handles bigints', () => {
    const format = formatPlain(utcTime)
    const message = format({
      time,
      level: 'INFO',
      message: 'Hello',
      parameters: { b: 123n },
    })
    expect(message).toEqual('12:34:56.789 INFO Hello {"b":"123"}')
  })

  it('service without tag', () => {
    const format = formatPlain(utcTime)
    const message = format({
      time,
      level: 'INFO',
      message: 'Hello',
      parameters: {
        service: 'Worker',
        foo: 'bar',
      },
    })
    expect(message).toEqual('12:34:56.789 INFO [Worker] Hello {"foo":"bar"}')
  })

  it('service with tag', () => {
    const format = formatPlain(utcTime)
    const message = format({
      time,
      level: 'INFO',
      message: 'Hello',
      parameters: {
        service: 'Worker',
        tag: 'blue',
        foo: 'bar',
      },
    })
    expect(message).toEqual(
      '12:34:56.789 INFO [Worker:blue] Hello {"foo":"bar"}',
    )
  })

  it('lone tag', () => {
    const format = formatPlain(utcTime)
    const message = format({
      time,
      level: 'INFO',
      message: 'Hello',
      parameters: { tag: 'blue', foo: 'bar' },
    })
    expect(message).toEqual('12:34:56.789 INFO [:blue] Hello {"foo":"bar"}')
  })

  it('non-string service', () => {
    const format = formatPlain(utcTime)
    const message = format({
      time,
      level: 'INFO',
      message: 'Hello',
      parameters: {
        service: 4,
        tag: 'blue',
        foo: 'bar',
      },
    })
    expect(message).toEqual('12:34:56.789 INFO [4:blue] Hello {"foo":"bar"}')
  })

  it('non-string tag', () => {
    const format = formatPlain(utcTime)
    const message = format({
      time,
      level: 'INFO',
      message: 'Hello',
      parameters: {
        service: 'Worker',
        tag: false,
        foo: 'bar',
      },
    })
    expect(message).toEqual(
      '12:34:56.789 INFO [Worker:false] Hello {"foo":"bar"}',
    )
  })

  it('inlines error', () => {
    const format = formatPlain(utcTime)
    const message = format({
      time,
      level: 'INFO',
      message: 'Hello',
      parameters: {
        error: { x: 1, y: 2 },
        z: 3,
      },
    })
    expect(message).toEqual('12:34:56.789 INFO Hello {"x":1,"y":2,"z":3}')
  })
})
