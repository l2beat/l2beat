import { Logger } from '@l2beat/backend-tools'
import type { CropAttestationRecord, Database } from '@l2beat/database'
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
      find: mockFn().resolvesTo(undefined),
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

  it('reports a new attestation once', async () => {
    const onChange = mockFn().resolvesTo(undefined)
    let current = CURRENT
    const sync = createSync(storedInMemory(), async () => current, onChange)

    await sync.run()
    await sync.run()
    expect(onChange).toHaveBeenCalledTimes(1)

    current = { ...CURRENT, uid: '0x02', revision: 2 }
    await sync.run()
    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('reports the attestation going away', async () => {
    const onChange = mockFn().resolvesTo(undefined)
    let current: CropAttestation | undefined = CURRENT
    const sync = createSync(storedInMemory(), async () => current, onChange)
    await sync.run()

    current = undefined
    await sync.run()
    await sync.run()

    expect(onChange).toHaveBeenCalledTimes(2)
  })

  it('retries a failed report on the next run', async () => {
    const onChange = mockFn()
      .rejectsWithOnce(new Error('GitHub down'))
      .resolvesTo(undefined)
    const sync = createSync(storedInMemory(), async () => CURRENT, onChange)

    await expect(sync.run()).toBeRejectedWith('GitHub down')
    await sync.run()
    await sync.run()

    expect(onChange).toHaveBeenCalledTimes(2)
  })
})

/** Holds the one row the sync keeps, so runs see what earlier runs stored. */
function storedInMemory(): Database['cropAttestation'] {
  let row: CropAttestationRecord | undefined
  return mockObject<Database['cropAttestation']>({
    find: async () => row,
    upsert: async (record) => {
      row = record
    },
    delete: async () => {
      const deleted = row ? 1 : 0
      row = undefined
      return deleted
    },
  })
}

function createSync(
  cropAttestation: Database['cropAttestation'],
  readCurrent: () => Promise<CropAttestation | undefined>,
  onChange: () => Promise<void> = async () => {},
) {
  return new CropAttestationSync(
    {
      db: mockObject<Database>({ cropAttestation }),
      chainId: CHAIN_ID,
      attester: ATTESTER,
      readCurrent,
      onChange,
      intervalMs: 1000,
    },
    Logger.SILENT,
  )
}
