import { expect } from 'earljs'
import { setTimeout } from 'timers/promises'
import waitForExpect from 'wait-for-expect'

import { Logger } from '../../src/tools/Logger'
import { TaskQueue } from '../../src/tools/TaskQueue'

describe(TaskQueue.name, () => {
  it('executes all jobs', async () => {
    const completed: number[] = []

    async function execute(value: number) {
      await setTimeout(1)
      completed.push(value)
    }

    const queue = new TaskQueue(execute, Logger.SILENT)

    for (let i = 0; i < 10; i++) {
      queue.addToBack(i)
    }

    await waitForExpect(() => {
      expect(completed).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    })
  })

  it('can handle occasional failure', async () => {
    const completed: number[] = []
    let failures = 10

    async function execute(i: number) {
      await setTimeout(1)
      if (failures > 0) {
        failures--
        throw new Error('oops')
      }
      completed.push(i)
    }

    const queue = new TaskQueue(execute, Logger.SILENT)
    for (let i = 0; i < 10; i++) {
      queue.addToBack(i)
    }

    await waitForExpect(() => {
      expect(completed).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    })
  })

  it('can add jobs to front', async () => {
    const completed: number[] = []

    async function execute(value: number) {
      await setTimeout(1)
      completed.push(value)
    }

    const queue = new TaskQueue(execute, Logger.SILENT)

    for (let i = 0; i < 10; i++) {
      queue.addToFront(i)
    }

    await waitForExpect(() => {
      expect(completed).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0])
    })
  })

  it('can add jobs to front', async () => {
    const completed: number[] = []

    async function execute(value: number) {
      await setTimeout(1)
      completed.push(value)
    }

    const queue = new TaskQueue(execute, Logger.SILENT)

    for (let i = 0; i < 10; i++) {
      queue.addToFront(i)
    }

    await waitForExpect(() => {
      expect(completed).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1, 0])
    })
  })

  it('can add jobs only if empty', async () => {
    const completed: number[] = []

    async function execute(value: number) {
      await setTimeout(1)
      completed.push(value)
    }

    const queue = new TaskQueue(execute, Logger.SILENT)

    for (let i = 0; i < 10; i++) {
      queue.addIfEmpty(i)
    }
    queue.addToBack(420)

    await waitForExpect(() => {
      expect(completed).toEqual([0, 420])
    })
  })
})
