// The API is static files on its own host; the website only documents it.
export const CROPS_API_URL = 'https://crops.l2beat.com'
export const CROPS_API_DOCS_URL = `${CROPS_API_URL}/`
export const CROPS_API_SPEC_URL = `${CROPS_API_URL}/v1/openapi.json`

// The OpenAPI description in crops-api says the same, at length.
export const API_NOTES = [
  'Every response is a static file generated from the L2BEAT repository, so it is served from a CDN with no API key and no rate limit.',
  'Not found means not reviewed. The project and address files answer 404 with an empty body when we have not reviewed the project or the address - treat it as "not reviewed", not as an error.',
  'Address files are keyed by EIP-155 chain id and lowercase address. Lowercase the address before you build the URL.',
]

export const VERIFY_STEPS = [
  'Read the attestation from the EAS contract with the uid in `attestations.current`: `getAttestation(uid)`.',
  'Check `revocationTime == 0`. When the set changes we revoke the old attestation and issue the next revision, so a revoked attestation is a stale claim and must not be shown.',
  'Check `attester` and `schema` against the values below, so an attestation someone else made cannot be mistaken for ours.',
  'Decode `projectIds` - these are the protocols we have reviewed, as of `reviewedAt`, at revision `revision`.',
  'For details on the rating per crop, the reasoning, what we did not look at - read `/v1/project/{id}.json`. Ratings might change as protocols change.',
]

export const BADGE_RULES = [
  'Link the badge to the garden, so a visitor can read the evaluation rather than only see that one exists.',
  'The badge says we have reviewed you and named you onchain. It is not a certification, an audit, or an endorsement - please do not describe it as any of those.',
  'Your rating can change. Make sure to check the API for the latest status before showing the badge.',
]
