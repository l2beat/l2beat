import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { CropAttestation } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import {
  CropAttestationSync,
  type CropAttestationSyncSource,
} from './CropAttestationSync'
import type { CropsApiDeployer } from './CropsApiDeployer'

const SOURCE: CropAttestationSyncSource = {
  network: 'ethereum',
  chainId: 1,
  eas: '0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587',
  explorer: 'https://easscan.org',
  schema: 'string[] projectIds,uint64 reviewedAt,uint32 revision',
  schemaUid:
    '0xbe00b10abb2fbae864b99c6ace4e0e622d5f690f822466e167353c32534dc3fb',
  attester: '0x19BEC50A4e61B0e1540C37cEB3F62f56AAfb74DB',
}

const CURRENT: CropAttestation = {
  uid: '0x2f31d8c9018e2718ea82f4df9612ff7f95534cd0f41d44337f5d75e92adad112',
  revision: 1,
  reviewedAt: 1792022400,
  projectIds: ['aztecnetwork'],
  txHash: '0x4eb819ead5f0b61142f0b567214eddd83ba653b9735592a6485d982ce7361116',
  blockNumber: 11921020,
}

describe(CropAttestationSync.name, () => {
  it('stores the current attestation with its source', async () => {
    const repository = mockObject<Database['cropAttestation']>({
      replace: mockFn().resolvesTo(undefined),
    })
    const sync = createSync(repository, async () => CURRENT)

    const before = UnixTime.now()
    await sync.run()

    expect(repository.replace).toHaveBeenOnlyCalledWith({
      ...SOURCE,
      uid: CURRENT.uid,
      revision: 1,
      reviewedAt: UnixTime(1792022400),
      projectIds: ['aztecnetwork'],
      txHash: CURRENT.txHash,
      blockNumber: 11921020,
      updatedAt: expect.a(Number),
    })
    expect(repository.replace.calls[0].args[0].updatedAt >= before).toEqual(
      true,
    )
  })

  it('removes the stored attestation when the attester has none', async () => {
    const repository = mockObject<Database['cropAttestation']>({
      deleteAll: mockFn().resolvesTo(1),
    })
    const sync = createSync(repository, async () => undefined)

    await sync.run()

    expect(repository.deleteAll).toHaveBeenOnlyCalledWith()
  })

  it('keeps the stored attestation when the read fails', async () => {
    const repository = mockObject<Database['cropAttestation']>({
      replace: mockFn().resolvesTo(undefined),
      deleteAll: mockFn().resolvesTo(0),
    })
    const sync = createSync(repository, async () => {
      throw new Error('RPC down')
    })

    await expect(sync.run()).toBeRejectedWith('RPC down')
    expect(repository.replace).not.toHaveBeenCalled()
    expect(repository.deleteAll).not.toHaveBeenCalled()
  })

  it('has the CROPS API deployed with what it read', async () => {
    const repository = mockObject<Database['cropAttestation']>({
      replace: mockFn().resolvesTo(undefined),
      deleteAll: mockFn().resolvesTo(1),
    })
    const deployer = mockObject<CropsApiDeployer>({
      ensureDeployed: mockFn().resolvesTo(undefined),
    })
    let current: CropAttestation | undefined = CURRENT
    const sync = createSync(repository, async () => current, deployer)

    await sync.run()
    current = undefined
    await sync.run()

    expect(deployer.ensureDeployed).toHaveBeenNthCalledWith(1, CURRENT.uid)
    expect(deployer.ensureDeployed).toHaveBeenNthCalledWith(2, undefined)
  })
})

function createSync(
  cropAttestation: Database['cropAttestation'],
  readCurrent: () => Promise<CropAttestation | undefined>,
  deployer?: CropsApiDeployer,
) {
  return new CropAttestationSync(
    {
      db: mockObject<Database>({ cropAttestation }),
      source: SOURCE,
      readCurrent,
      deployer,
      intervalMs: 1000,
    },
    Logger.SILENT,
  )
}
