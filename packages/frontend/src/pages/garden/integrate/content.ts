export type IntegrateEndpoint = 'lookup' | 'project' | 'crops'

export interface EndpointDoc {
  key: IntegrateEndpoint
  path: string
  summary: string
  description: string
  /** Query parameters, if any. */
  params?: { name: string; description: string }[]
}

/**
 * The prose for each endpoint. The request and the response shown next to it
 * are not written here: they are produced from the live API when the page is
 * rendered, so the examples cannot drift from what the endpoints return.
 */
export const ENDPOINTS: EndpointDoc[] = [
  {
    key: 'lookup',
    path: '/api/garden/project/lookup',
    summary: 'Which protocol is this address?',
    description:
      'Hand it the contracts a user is about to touch; it answers with the protocols they belong to and a rating per crop.',
    params: [
      {
        name: 'addresses',
        description:
          'Up to 50 comma-separated chain:address pairs. The chain may be a short name (eth), a long name (ethereum) or a chain id (1).',
      },
    ],
  },
  {
    key: 'project',
    path: '/api/garden/project/{id}',
    summary: 'Everything about one protocol',
    description:
      '`{id}` is the project id or its slug; anything we have not reviewed answers 404.',
  },
  {
    key: 'crops',
    path: '/api/garden/crops',
    summary: 'The whole garden',
    description:
      'Every reviewed protocol in one response, and the attestation that names them.',
  },
]

export const VERIFY_STEPS = [
  'Read the attestation from the EAS contract with the uid in `attestations.current`: `getAttestation(uid)`.',
  'Check `revocationTime == 0`. When the set changes we revoke the old attestation and issue the next revision, so a revoked attestation is a stale claim and must not be shown.',
  'Check `attester` and `schema` against the values below, so an attestation someone else made cannot be mistaken for ours.',
  'Decode `projectIds` - these are the protocols we have reviewed, as of `reviewedAt`, at revision `revision`.',
  'For details on the rating per crop, the reasoning, what we did not look at - call `/api/garden/project/{id}`. Ratings might change as protocols change.',
]

/** What a reviewed protocol may and may not say with the badge. */
export const BADGE_RULES = [
  'Link the badge to the garden, so a visitor can read the evaluation rather than only see that one exists.',
  'The badge says we have reviewed you and named you onchain. It is not a certification, an audit, or an endorsement - please do not describe it as any of those.',
  'Your rating can change. Make sure to check the API for the latest status before showing the badge.',
]
