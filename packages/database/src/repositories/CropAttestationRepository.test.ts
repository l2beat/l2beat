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

  it('keeps only the last stored attestation', async () => {
    await repository.replace(attestation(1, ['aztecnetwork']))
    await repository.replace(attestation(2, ['aztecnetwork', 'umbra']))

    expect(await repository.find()).toEqual(
      attestation(2, ['aztecnetwork', 'umbra']),
    )
  })

  it('finds nothing when empty', async () => {
    expect(await repository.find()).toEqual(undefined)
  })

  it('deletes the attestation', async () => {
    await repository.replace(attestation(1, ['umbra']))
    expect(await repository.deleteAll()).toEqual(1)
    expect(await repository.find()).toEqual(undefined)
  })
})

function attestation(
  revision: number,
  projectIds: string[],
): CropAttestationRecord {
  return {
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
