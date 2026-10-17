import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { describeDatabase } from '../test/database'
import {
  type CropAttestationRecord,
  CropAttestationRepository,
} from './CropAttestationRepository'

const ATTESTER = '0x19BEC50A4e61B0e1540C37cEB3F62f56AAfb74DB'

describeDatabase(CropAttestationRepository.name, (db) => {
  const repository = db.cropAttestation

  afterEach(async () => {
    await repository.deleteAll()
  })

  it('stores one attestation per attester and replaces it', async () => {
    await repository.upsert(attestation(1, ['aztecnetwork']))
    await repository.upsert(attestation(2, ['aztecnetwork', 'umbra']))

    expect(await repository.find(11155111, ATTESTER)).toEqual(
      attestation(2, ['aztecnetwork', 'umbra']),
    )
  })

  it('keeps attesters and chains apart, matching addresses in any case', async () => {
    await repository.upsert(attestation(1, ['umbra']))
    await repository.upsert({ ...attestation(5, ['safe']), chainId: 1 })

    expect(
      (await repository.find(11155111, ATTESTER.toUpperCase()))?.revision,
    ).toEqual(1)
    expect((await repository.find(1, ATTESTER))?.revision).toEqual(5)
    expect(await repository.find(11155111, `0x${'1'.repeat(40)}`)).toEqual(
      undefined,
    )
  })

  it('deletes the attestation of one attester', async () => {
    await repository.upsert(attestation(1, ['umbra']))
    expect(await repository.delete(11155111, ATTESTER)).toEqual(1)
    expect(await repository.find(11155111, ATTESTER)).toEqual(undefined)
  })
})

function attestation(
  revision: number,
  projectIds: string[],
): CropAttestationRecord {
  return {
    chainId: 11155111,
    attester: ATTESTER.toLowerCase(),
    uid: `0x${revision.toString().padStart(64, '0')}`,
    revision,
    reviewedAt: UnixTime(1792022400),
    projectIds,
    txHash: `0x${'ab'.repeat(32)}`,
    blockNumber: 11921020 + revision,
    updatedAt: UnixTime(1792100000 + revision),
  }
}
