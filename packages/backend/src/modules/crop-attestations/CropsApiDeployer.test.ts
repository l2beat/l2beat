import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { HttpClient } from '@l2beat/shared'
import { expect, mockFn, mockObject } from 'earl'
import { CropsApiDeployer } from './CropsApiDeployer'

describe(CropsApiDeployer.name, () => {
  it('deploys once per new attestation', async () => {
    const http = github()
    const deployer = createDeployer(inMemory(), http)

    await deployer.ensureDeployed('0x01')
    await deployer.ensureDeployed('0x01')
    expect(http.fetchRaw).toHaveBeenCalledTimes(1)

    await deployer.ensureDeployed('0x02')
    expect(http.fetchRaw).toHaveBeenCalledTimes(2)
  })

  it('deploys when the attestation goes away', async () => {
    const http = github()
    const deployer = createDeployer(inMemory(), http)
    await deployer.ensureDeployed('0x01')

    await deployer.ensureDeployed(undefined)
    await deployer.ensureDeployed(undefined)

    expect(http.fetchRaw).toHaveBeenCalledTimes(2)
  })

  it('retries a deploy GitHub rejected, even after a restart', async () => {
    const db = inMemory()
    const http = github(500)
    await expect(
      createDeployer(db, http).ensureDeployed('0x01'),
    ).toBeRejectedWith('crops-api deploy dispatch failed')

    const restarted = createDeployer(db, http)
    await restarted.ensureDeployed('0x01')
    await restarted.ensureDeployed('0x01')

    expect(http.fetchRaw).toHaveBeenCalledTimes(2)
  })
})

/** GitHub answering the dispatch, first with `firstStatus`, then with 204. */
function github(firstStatus = 204) {
  return mockObject<HttpClient>({
    fetchRaw: mockFn()
      .resolvesToOnce(new Response(null, { status: firstStatus }))
      .resolvesTo(new Response(null, { status: 204 })),
  })
}

/** Keeps the deployed uid, so later calls and restarts see it. */
function inMemory() {
  let deployedUid: string | undefined
  return mockObject<Database>({
    appState: mockObject<Database['appState']>({
      // Generic in the key, so typed loosely: only one key is ever read.
      findByKey: mockFn().executes(async () =>
        deployedUid === undefined ? undefined : { value: deployedUid },
      ),
      insert: async (record) => {
        deployedUid = record.value as string
      },
      deleteByKey: async () => {
        deployedUid = undefined
        return 1
      },
    }),
  })
}

function createDeployer(db: Database, http: HttpClient) {
  return new CropsApiDeployer(db, http, 'token', Logger.SILENT)
}
