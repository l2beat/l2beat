import { HttpClient } from '@l2beat/shared'
import { v } from '@l2beat/validate'
import { expect, mockFn } from 'earl'
import { runWatch } from './runWatch'
import type { WatchConfig } from './WatchReader'
import type { WatchTemplate } from './WatchTemplate'

const context = { http: new HttpClient() }

function template(fetch: WatchTemplate['fetch']): WatchTemplate {
  return { name: 'test', params: v.unknown(), fetch }
}

describe(runWatch.name, () => {
  it('returns every key with its value sorted, and the run time', async () => {
    const config: WatchConfig = {
      name: 'alpha',
      watches: [
        {
          key: 'a',
          template: template(async () => ({ b: 1, a: 2 })),
          params: {},
        },
        { key: 'b', template: template(async (p) => p as string), params: 'x' },
      ],
    }
    const before = Math.floor(Date.now() / 1000)
    const run = await runWatch(config, context)
    expect(run.timestamp).toBeGreaterThanOrEqual(before)
    expect(JSON.stringify(run.values)).toEqual('{"a":{"a":2,"b":1},"b":"x"}')
  })

  it('rejects the whole run when one template throws', async () => {
    const after = mockFn().resolvesTo(1)
    const config: WatchConfig = {
      name: 'alpha',
      watches: [
        {
          key: 'a',
          template: template(async () => {
            throw new Error('HTTP error')
          }),
          params: {},
        },
        { key: 'b', template: template(after), params: {} },
      ],
    }
    await expect(runWatch(config, context)).toBeRejectedWith('Watch run failed')
    expect(after).not.toHaveBeenCalled()
  })

  it('rejects a template whose whole value is pending', async () => {
    const config: WatchConfig = {
      name: 'alpha',
      watches: [
        {
          key: 'a',
          template: template(async () => ({ pending: true })),
          params: {},
        },
      ],
    }
    await expect(runWatch(config, context)).toBeRejectedWith(
      'Watch value is a pending item',
    )
  })

  it('rejects a template that places a pending item inside an array', async () => {
    const config: WatchConfig = {
      name: 'alpha',
      watches: [
        {
          key: 'a',
          template: template(async () => [{ pending: true }]),
          params: {},
        },
      ],
    }
    await expect(runWatch(config, context)).toBeRejectedWith(
      'Pending item inside an array',
    )
  })

  it('stops running templates once the context signal is aborted', async () => {
    const controller = new AbortController()
    const second = mockFn().resolvesTo(1)
    const config: WatchConfig = {
      name: 'alpha',
      watches: [
        {
          key: 'a',
          template: template(async () => {
            controller.abort(new Error('Run cancelled'))
            return 1
          }),
          params: {},
        },
        { key: 'b', template: template(second), params: {} },
      ],
    }
    await expect(
      runWatch(config, { ...context, signal: controller.signal }),
    ).toBeRejectedWith('Run cancelled')
    expect(second).not.toHaveBeenCalled()
  })
})
