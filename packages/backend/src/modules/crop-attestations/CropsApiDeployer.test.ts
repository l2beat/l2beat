import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import { expect, mockFn, mockObject } from 'earl'
import { CropsApiDeployer } from './CropsApiDeployer'

describe(CropsApiDeployer.name, () => {
  it('deploys once per new attestation', async () => {
    const deploy = mockFn().resolvesTo(undefined)
    const deployer = new CropsApiDeployer(inMemory(), deploy, Logger.SILENT)

    await deployer.ensureDeployed('0x01')
    await deployer.ensureDeployed('0x01')
    expect(deploy).toHaveBeenCalledTimes(1)

    await deployer.ensureDeployed('0x02')
    expect(deploy).toHaveBeenCalledTimes(2)
  })

  it('deploys when the attestation goes away', async () => {
    const deploy = mockFn().resolvesTo(undefined)
    const deployer = new CropsApiDeployer(inMemory(), deploy, Logger.SILENT)
    await deployer.ensureDeployed('0x01')

    await deployer.ensureDeployed(undefined)
    await deployer.ensureDeployed(undefined)

    expect(deploy).toHaveBeenCalledTimes(2)
  })

  it('retries a failed deploy, even after a restart', async () => {
    const db = inMemory()
    const deploy = mockFn()
      .rejectsWithOnce(new Error('GitHub down'))
      .resolvesTo(undefined)
    await expect(
      new CropsApiDeployer(db, deploy, Logger.SILENT).ensureDeployed('0x01'),
    ).toBeRejectedWith('GitHub down')

    const restarted = new CropsApiDeployer(db, deploy, Logger.SILENT)
    await restarted.ensureDeployed('0x01')
    await restarted.ensureDeployed('0x01')

    expect(deploy).toHaveBeenCalledTimes(2)
  })
})

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
