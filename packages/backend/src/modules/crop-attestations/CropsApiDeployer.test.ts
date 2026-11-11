import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { HttpClient } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { CropsApiDeployer } from './CropsApiDeployer'

describe(CropsApiDeployer.name, () => {
  it('does nothing while the live API serves the attestation', async () => {
    const http = github(live('0x01'))
    const deployer = createDeployer(inMemory(), http)

    await deployer.ensureDeployed('0x01')

    expect(http.fetchRaw).not.toHaveBeenCalled()
  })

  it('deploys once while the run is under way', async () => {
    const http = github(live('0x01'))
    const deployer = createDeployer(inMemory(), http)

    await deployer.ensureDeployed('0x02')
    await deployer.ensureDeployed('0x02')

    expect(http.fetchRaw).toHaveBeenCalledTimes(1)
  })

  it('deploys again when the last run did not reach the live API', async () => {
    const http = github(live('0x01'))
    const stale = UnixTime.now() - 31 * 60
    const deployer = createDeployer(inMemory('0x02', stale), http)

    await deployer.ensureDeployed('0x02')

    expect(http.fetchRaw).toHaveBeenCalledTimes(1)
  })

  it('deploys when the attestation goes away', async () => {
    const http = github(live('0x01'))
    const deployer = createDeployer(inMemory(), http)
    await deployer.ensureDeployed(undefined)
    expect(http.fetchRaw).toHaveBeenCalledTimes(1)

    const settled = github(live(null))
    await createDeployer(inMemory(), settled).ensureDeployed(undefined)
    expect(settled.fetchRaw).not.toHaveBeenCalled()
  })

  it('deploys when the live API cannot be read', async () => {
    const http = github(Promise.reject(new Error('HTTP error')))
    const deployer = createDeployer(inMemory(), http)

    await deployer.ensureDeployed('0x01')

    expect(http.fetchRaw).toHaveBeenCalledTimes(1)
  })

  it('retries a deploy GitHub rejected, even after a restart', async () => {
    const db = inMemory()
    const http = github(live(null), 500)
    await expect(
      createDeployer(db, http).ensureDeployed('0x01'),
    ).toBeRejectedWith('crops-api deploy dispatch failed')

    const restarted = createDeployer(db, http)
    await restarted.ensureDeployed('0x01')
    await restarted.ensureDeployed('0x01')

    expect(http.fetchRaw).toHaveBeenCalledTimes(2)
  })
})

/** The live API's body naming `uid` as the current attestation. */
function live(uid: string | null) {
  return Promise.resolve({
    attestations: { current: uid === null ? null : { uid } },
  })
}

/**
 * The live API answering with `body`, and GitHub answering the dispatch, first
 * with `firstStatus`, then with 204.
 */
function github(body: Promise<unknown>, firstStatus = 204) {
  body.catch(() => {})
  return mockObject<HttpClient>({
    fetch: mockFn().executes(() => body),
    fetchRaw: mockFn()
      .resolvesToOnce(new Response(null, { status: firstStatus }))
      .resolvesTo(new Response(null, { status: 204 })),
  })
}

/** Keeps the last dispatch, so later calls and restarts see it. */
function inMemory(uid?: string, updatedAt = UnixTime.now()) {
  let dispatched = uid === undefined ? undefined : { value: uid, updatedAt }
  return mockObject<Database>({
    appState: mockObject<Database['appState']>({
      // Generic in the key, so typed loosely: only one key is ever read.
      findByKey: mockFn().executes(async () => dispatched),
      insert: async (record) => {
        dispatched = {
          value: record.value as string,
          updatedAt: UnixTime.now(),
        }
      },
    }),
  })
}

function createDeployer(db: Database, http: HttpClient) {
  return new CropsApiDeployer(db, http, 'token', Logger.SILENT)
}
