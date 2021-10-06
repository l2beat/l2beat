import { expect } from 'chai'
import waitForExpect from 'wait-for-expect'

import { JobQueue } from '../../src/tools/JobQueue'
import { Logger } from '../../src/tools/Logger'

describe('JobQueue', () => {
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  it('works with 1 concurrent jobs', async () => {
    const queue = new JobQueue({ maxConcurrentJobs: 1 }, Logger.SILENT)
    let inProgress = 0
    let max = 0
    let completed = 0

    async function job() {
      inProgress++
      max = Math.max(max, inProgress)
      await sleep(1)
      inProgress--
      completed++
    }

    for (let i = 0; i < 10; i++) {
      queue.add({ name: i.toString(), execute: job })
    }

    await waitForExpect(() => {
      expect(completed).to.equal(10)
    })
    expect(max).to.equal(1)
  })

  it('works with 3 concurrent jobs', async () => {
    const queue = new JobQueue({ maxConcurrentJobs: 3 }, Logger.SILENT)
    let inProgress = 0
    let max = 0
    let completed = 0

    async function job() {
      inProgress++
      max = Math.max(max, inProgress)
      await sleep(1)
      inProgress--
      completed++
    }

    for (let i = 0; i < 10; i++) {
      queue.add({ name: i.toString(), execute: job })
    }

    await waitForExpect(() => {
      expect(completed).to.equal(10)
    })
    expect(max).to.equal(3)
  })

  it('can handle occasional failure', async () => {
    const queue = new JobQueue({ maxConcurrentJobs: 3 }, Logger.SILENT)

    const completed: number[] = []
    let failures = 10

    async function job(i: number) {
      await sleep(1)
      if (failures > 0) {
        failures--
        throw new Error('oops')
      }
      completed.push(i)
    }

    for (let i = 0; i < 10; i++) {
      queue.add({ name: i.toString(), execute: () => job(i) })
    }

    await waitForExpect(() => {
      expect(completed.length).to.equal(10)
    })
    expect(completed.sort()).to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })
})
