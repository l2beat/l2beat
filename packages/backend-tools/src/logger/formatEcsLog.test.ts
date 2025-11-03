import { expect } from 'earl'
import { formatEcsLog } from './formatEcsLog'

describe(formatEcsLog.name, () => {
  it('module', () => {
    const message = formatEcsLog(new Date(0), 'INFO', 'hello', {
      module: 'module',
    })
    expect(message).toEqual(
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
    const message = formatEcsLog(new Date(0), 'INFO', 'hello', {
      module: 'module',
      feature: 'feature',
    })
    expect(message).toEqual(
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
    const message = formatEcsLog(new Date(0), 'INFO', 'hello', {
      source: 'source',
    })
    expect(message).toEqual(
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
    const message = formatEcsLog(new Date(0), 'INFO', 'hello', {
      tag: 'tag',
      feature: 'feature',
      module: 'module',
    })
    expect(message).toEqual(
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
    const message = formatEcsLog(new Date(0), 'INFO', 'hello', {
      feature: 'feature',
      module: 'module',
      project: 'project',
    })
    expect(message).toEqual(
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
    const message = formatEcsLog(new Date(0), 'INFO', 'hello', {
      feature: 'feature',
      module: 'module',
      chain: 'chain',
    })
    expect(message).toEqual(
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

  it('parameters', () => {
    const message = formatEcsLog(new Date(0), 'INFO', 'hello', {
      foo: 'bar',
    })
    expect(message).toEqual(
      JSON.stringify({
        '@timestamp': '1970-01-01T00:00:00.000Z',
        log: { level: 'INFO' },
        service: {},
        labels: {},
        message: 'hello',
        parameters: {
          foo: 'bar',
        },
      }),
    )
  })

  it('error', () => {
    const message = formatEcsLog(new Date(0), 'INFO', 'hello', {
      error: {
        name: 'Error',
        error: 'oops, something went wrong',
        stack: ['here', 'there'],
      },
    })
    expect(message).toEqual(
      JSON.stringify({
        '@timestamp': '1970-01-01T00:00:00.000Z',
        log: { level: 'INFO' },
        service: {},
        labels: {},
        message: 'hello',
        error: {
          message: 'oops, something went wrong',
          type: 'Error',
          stack_trace: ['here', 'there'],
        },
      }),
    )
  })
})
