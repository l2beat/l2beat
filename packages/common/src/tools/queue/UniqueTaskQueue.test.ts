import { expect } from 'earljs'
import { setTimeout } from 'timers/promises'
import waitForExpect from 'wait-for-expect'

import { Logger } from '../Logger'
import { UniqueTaskQueue } from './UniqueTaskQueue'

describe(UniqueTaskQueue.name, () => {
  it('adds only unique tasks', async () => {
    const completed: number[] = []

    async function execute(value: number) {
      await setTimeout(1)
      completed.push(value)
    }

    const queue = new UniqueTaskQueue(execute, Logger.SILENT)

    queue.addToBack(1)
    queue.addToBack(1)

    await waitForExpect(() => {
      expect(completed).toEqual([1])
    })
  })

  it('removes task from memory after the execution', async () => {
    const completed: number[] = []

    async function execute(value: number) {
      await setTimeout(1)
      completed.push(value)
    }

    const queue = new UniqueTaskQueue(execute, Logger.SILENT)

    queue.addToBack(1)

    await waitForExpect(() => {
      expect(completed).toEqual([1])
    })

    queue.addToBack(1)

    await waitForExpect(() => {
      expect(completed).toEqual([1, 1])
    })
  })

  it('adds only unique tasks with bigger set', async () => {
    const completed: number[] = []

    async function execute(value: number) {
      await setTimeout(1)
      completed.push(value)
    }

    const queue = new UniqueTaskQueue(execute, Logger.SILENT)

    for (let i = 0; i < 10; i++) {
      queue.addToBack(i)
    }

    for (let i = 0; i < 10; i = i + 2) {
      queue.addToFront(i)
    }

    await waitForExpect(() => {
      expect(completed).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    })
  })
})
