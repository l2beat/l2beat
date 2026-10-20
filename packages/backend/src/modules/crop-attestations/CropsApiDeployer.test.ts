import { Logger } from '@l2beat/backend-tools'
import type { CropAttestationRecord, Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { CropsApiDeployer } from './CropsApiDeployer'

const ATTESTATION: CropAttestationRecord = {
  chainId: 1,
  attester: '0x19bec50a4e61b0e1540c37ceb3f62f56aafb74db',
  uid: '0x01',
  revision: 1,
  reviewedAt: UnixTime(1792022400),
  projectIds: ['aztecnetwork'],
  txHash: '0x4e',
  blockNumber: 11921020,
  updatedAt: UnixTime(1792022400),
}

describe(CropsApiDeployer.name, () => {
  it('deploys once per new attestation', async () => {
    const { db, setCurrent } = inMemory(ATTESTATION)
    const deploy = mockFn().resolvesTo(undefined)
    const deployer = createDeployer(db, deploy)

    await deployer.run()
    await deployer.run()
    expect(deploy).toHaveBeenCalledTimes(1)

    setCurrent({ ...ATTESTATION, uid: '0x02', revision: 2 })
    await deployer.run()
    expect(deploy).toHaveBeenCalledTimes(2)
  })

  it('deploys when the attestation goes away', async () => {
    const { db, setCurrent } = inMemory(ATTESTATION)
    const deploy = mockFn().resolvesTo(undefined)
    const deployer = createDeployer(db, deploy)
    await deployer.run()

    setCurrent(undefined)
    await deployer.run()
    await deployer.run()

    expect(deploy).toHaveBeenCalledTimes(2)
  })

  it('retries a failed deploy, even after a restart', async () => {
    const { db } = inMemory(ATTESTATION)
    const deploy = mockFn()
      .rejectsWithOnce(new Error('GitHub down'))
      .resolvesTo(undefined)
    await expect(createDeployer(db, deploy).run()).toBeRejectedWith(
      'GitHub down',
    )

    const restarted = createDeployer(db, deploy)
    await restarted.run()
    await restarted.run()

    expect(deploy).toHaveBeenCalledTimes(2)
  })
})

/** Keeps what the deployer writes, so later runs and restarts see it. */
function inMemory(initial: CropAttestationRecord | undefined) {
  let current = initial
  let deployedUid: string | undefined
  const db = mockObject<Database>({
    cropAttestation: mockObject<Database['cropAttestation']>({
      find: async () => current,
    }),
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
  const setCurrent = (record: CropAttestationRecord | undefined) => {
    current = record
  }
  return { db, setCurrent }
}

function createDeployer(db: Database, deploy: () => Promise<void>) {
  return new CropsApiDeployer(
    {
      db,
      chainId: ATTESTATION.chainId,
      attester: ATTESTATION.attester,
      deploy,
      intervalMs: 1000,
    },
    Logger.SILENT,
  )
}
