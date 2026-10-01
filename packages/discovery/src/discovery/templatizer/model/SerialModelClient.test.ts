import { expect } from 'earl'
import type { ModelClient, ModelTurn } from './ModelClient'
import { SerialModelClient } from './SerialModelClient'

describe(SerialModelClient.name, () => {
  it('starts a turn only after the previous one settled, failed ones included', async () => {
    const log: string[] = []
    const releases: (() => void)[] = []
    const inner: ModelClient = {
      start: (input) =>
        new Promise<ModelTurn>((resolve, reject) => {
          log.push(`start ${input.prompt}`)
          releases.push(() => {
            log.push(`end ${input.prompt}`)
            if (input.prompt === 'b') {
              reject(new Error('refused'))
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
})

function turn(text: string): ModelTurn {
  return { threadId: 't', text, events: [], durationMs: 0 }
}

function tick(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve))
}
