import { expect } from 'earl'
import { getProjects } from '../processing/getProjects'
import { CROP_ATTESTATIONS } from './attestations'

// The site claims "attested" straight from the committed ledger, so a crop
// evaluation added or removed in config without re-attesting would ship a
// false claim. Comparing the two sets here blocks that PR until
// `l2b crops-attest` has run and its ledger is committed.
describe('crop attestations', () => {
  const reviewed = getProjects()
    .filter((p) => p.crops !== undefined)
    .map((p) => p.id.toString())
    .sort()
  const current = CROP_ATTESTATIONS.live.filter(
    (x) => x.schema.toLowerCase() === CROP_ATTESTATIONS.schemaUid.toLowerCase(),
  )

  it('exactly one attestation is live under the current schema', () => {
    expect(current.length).toEqual(1)
  })

  it('the live attestation names exactly the projects with crop evaluations', () => {
    const attested = [...(current[0]?.projectIds ?? [])].sort()
    expect(attested).toEqual(reviewed)
  })
})
