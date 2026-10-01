import { expect } from 'earl'
import type { ModelClient, ModelTurn } from './ModelClient'
import { SerialModelClient } from './SerialModelClient'

describe(SerialModelClient.name, () => {
  it('starts a turn only after the previous one settled, unusable answers included', async () => {
    const log: string[] = []
    const releases: (() => void)[] = []
    const inner: ModelClient = {
      start: (input) =>
        new Promise<ModelTurn>((resolve, reject) => {
          log.push(`start ${input.prompt}`)
          releases.push(() => {
            log.push(`end ${input.prompt}`)
            if (input.prompt === 'b') {
              reject(Object.assign(new Error('refused'), { retryable: true }))
            } else {
              resolve(turn(input.prompt))
            }
          })
        }),
      resume: () => Promise.reject(new Error('unused')),
    }
    const client = new SerialModelClient(inner)

    const a = client.start({ prompt: 'a', schema: {} })
    const b = client.start({ prompt: 'b', schema: {} })
    const c = client.start({ prompt: 'c', schema: {} })
    await tick()
    expect(log).toEqual(['start a'])

    releases.shift()?.()
    await a
    await tick()
    releases.shift()?.()
    await expect(b).toBeRejectedWith('refused')
    await tick()
    releases.shift()?.()
    expect((await c).text).toEqual('c')

    expect(log).toEqual([
      'start a',
      'end a',
      'start b',
      'end b',
      'start c',
      'end c',
    ])
  })

  it('starts no queued turn once a turn was not answered', async () => {
    const started: string[] = []
    const inner: ModelClient = {
      start: (input) => {
        started.push(input.prompt)
        return Promise.reject(new Error('rate_limit_exceeded'))
      },
      resume: () => Promise.reject(new Error('unused')),
    }
    const client = new SerialModelClient(inner)

    const a = client.start({ prompt: 'a', schema: {} })
    const b = client.start({ prompt: 'b', schema: {} })

    await expect(a).toBeRejectedWith('rate_limit_exceeded')
    await expect(b).toBeRejectedWith('rate_limit_exceeded')
    expect(started).toEqual(['a'])
  })

  it('reports when each turn of a reporting client really starts, with how many still wait', async () => {
    const releases: (() => void)[] = []
    const inner: ModelClient = {
      start: (input) =>
        new Promise<ModelTurn>((resolve) =>
          releases.push(() => resolve(turn(input.prompt))),
        ),
      resume: (input) =>
        new Promise<ModelTurn>((resolve) =>
          releases.push(() => resolve(turn(input.prompt))),
        ),
    }
    const client = new SerialModelClient(inner)
    const starts: string[] = []
    const registry = client.reporting(({ turn, waiting }) =>
      starts.push(`Registry turn ${turn}, ${waiting} waiting`),
    )
    const rollup = client.reporting(({ turn, waiting }) =>
      starts.push(`Rollup turn ${turn}, ${waiting} waiting`),
    )

    const first = registry.start({ prompt: 'a', schema: {} })
    const other = rollup.start({ prompt: 'b', schema: {} })
    await tick()
    expect(starts).toEqual(['Registry turn 1, 1 waiting'])

    releases.shift()?.()
    await first
    const second = registry.resume({ threadId: 't', prompt: 'c', schema: {} })
    await tick()
    releases.shift()?.()
    await other
    await tick()
    releases.shift()?.()
    await second

    expect(starts).toEqual([
      'Registry turn 1, 1 waiting',
      'Rollup turn 1, 1 waiting',
      'Registry turn 2, 0 waiting',
    ])
  })
})

function turn(text: string): ModelTurn {
  return { threadId: 't', text, events: [], durationMs: 0 }
}

function tick(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve))
}
