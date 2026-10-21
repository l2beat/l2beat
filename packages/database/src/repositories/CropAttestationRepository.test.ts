import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type CropAttestationRecord,
  CropAttestationRepository,
} from './CropAttestationRepository'

describeDatabase(CropAttestationRepository.name, (db) => {
  const repository = db.cropAttestation

  afterEach(async () => {
    await repository.deleteAll()
  })

  it('stores one attestation per source and replaces it', async () => {
    await repository.upsert(attestation('aaaaaaaaaaaa', 1, ['aztecnetwork']))
    await repository.upsert(
      attestation('aaaaaaaaaaaa', 2, ['aztecnetwork', 'umbra']),
    )

    expect(await repository.findCurrent()).toEqual(
      attestation('aaaaaaaaaaaa', 2, ['aztecnetwork', 'umbra']),
    )
  })

  it('finds the most recently written source', async () => {
    await repository.upsert(attestation('bbbbbbbbbbbb', 5, ['safe']))
    await repository.upsert(attestation('aaaaaaaaaaaa', 6, ['umbra']))

    expect((await repository.findCurrent())?.configId).toEqual('aaaaaaaaaaaa')
  })

  it('finds nothing when empty', async () => {
    expect(await repository.findCurrent()).toEqual(undefined)
  })

  it('deletes the attestation of one source', async () => {
    await repository.upsert(attestation('aaaaaaaaaaaa', 1, ['umbra']))
    expect(await repository.delete('aaaaaaaaaaaa')).toEqual(1)
    expect(await repository.findCurrent()).toEqual(undefined)
  })

  it('deletes the attestations of every other source', async () => {
    await repository.upsert(attestation('aaaaaaaaaaaa', 6, ['umbra']))
    await repository.upsert(attestation('bbbbbbbbbbbb', 5, ['safe']))

    expect(await repository.deleteAllExcept('bbbbbbbbbbbb')).toEqual(1)
    expect((await repository.findCurrent())?.configId).toEqual('bbbbbbbbbbbb')
  })
})

function attestation(
  configId: string,
  revision: number,
  projectIds: string[],
): CropAttestationRecord {
  return {
    configId,
    network: 'ethereum',
    chainId: 1,
    eas: '0xA1207F3BBa224E2c9c3c6D5aF63D0eb1582Ce587',
    explorer: 'https://easscan.org',
    schemaUid: `0x${'be'.repeat(32)}`,
    schema: 'string[] projectIds,uint64 reviewedAt,uint32 revision',
    attester: '0xa34C25578519beaa7A5F24e38BBa89A34594e4ee',
    uid: `0x${revision.toString().padStart(64, '0')}`,
    revision,
    reviewedAt: UnixTime(1792022400),
    projectIds,
    txHash: `0x${'ab'.repeat(32)}`,
    blockNumber: 11921020 + revision,
    updatedAt: UnixTime(1792100000 + revision),
  }
}
