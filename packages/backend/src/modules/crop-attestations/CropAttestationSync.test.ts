import { Logger } from '@l2beat/backend-tools'
import type { Database } from '@l2beat/database'
import type { CropAttestation } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { CropAttestationSync } from './CropAttestationSync'

const CHAIN_ID = 1
const ATTESTER = '0x19BEC50A4e61B0e1540C37cEB3F62f56AAfb74DB'

const CURRENT: CropAttestation = {
  uid: '0x2f31d8c9018e2718ea82f4df9612ff7f95534cd0f41d44337f5d75e92adad112',
  revision: 1,
  reviewedAt: 1792022400,
  projectIds: ['aztecnetwork'],
  txHash: '0x4eb819ead5f0b61142f0b567214eddd83ba653b9735592a6485d982ce7361116',
  blockNumber: 11921020,
}

describe(CropAttestationSync.name, () => {
  it('stores the current attestation of the configured attester', async () => {
    const repository = mockObject<Database['cropAttestation']>({
      upsert: mockFn().resolvesTo(undefined),
    })
    const sync = createSync(repository, async () => CURRENT)

    const before = UnixTime.now()
    await sync.run()

    expect(repository.upsert).toHaveBeenOnlyCalledWith({
      chainId: CHAIN_ID,
      attester: ATTESTER,
      uid: CURRENT.uid,
      revision: 1,
      reviewedAt: UnixTime(1792022400),
      projectIds: ['aztecnetwork'],
      txHash: CURRENT.txHash,
      blockNumber: 11921020,
      updatedAt: expect.a(Number),
    })
    expect(repository.upsert.calls[0].args[0].updatedAt >= before).toEqual(true)
  })

  it('removes the stored attestation when the attester has none', async () => {
    const repository = mockObject<Database['cropAttestation']>({
      delete: mockFn().resolvesTo(1),
    })
    const sync = createSync(repository, async () => undefined)

    await sync.run()

    expect(repository.delete).toHaveBeenOnlyCalledWith(CHAIN_ID, ATTESTER)
  })

  it('keeps the stored attestation when the read fails', async () => {
    const repository = mockObject<Database['cropAttestation']>({
      upsert: mockFn().resolvesTo(undefined),
      delete: mockFn().resolvesTo(0),
    })
    const sync = createSync(repository, async () => {
      throw new Error('RPC down')
    })

    await expect(sync.run()).toBeRejectedWith('RPC down')
    expect(repository.upsert).not.toHaveBeenCalled()
    expect(repository.delete).not.toHaveBeenCalled()
  })
})

function createSync(
  cropAttestation: Database['cropAttestation'],
  readCurrent: () => Promise<CropAttestation | undefined>,
) {
  return new CropAttestationSync(
    {
      db: mockObject<Database>({ cropAttestation }),
      chainId: CHAIN_ID,
      attester: ATTESTER,
      readCurrent,
      intervalMs: 1000,
    },
    Logger.SILENT,
  )
}
