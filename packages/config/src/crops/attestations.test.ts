import { expect } from 'earl'
import { CROP_ATTESTATIONS } from './attestations'

describe('crop attestations', () => {
  it('exactly one attestation is live under the current schema', () => {
    const current = CROP_ATTESTATIONS.live.filter(
      (x) =>
        x.schema.toLowerCase() === CROP_ATTESTATIONS.schemaUid.toLowerCase(),
    )
    expect(current.length).toEqual(1)
  })
})
