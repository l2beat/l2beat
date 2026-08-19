export interface EndpointDoc {
  path: string
  summary: string
  description: string
  /** Query parameters, if any. */
  params?: { name: string; description: string }[]
  /** The full url, shown on its own line with a copy button. */
  request: string
  /** The response body, abbreviated. */
  response: string
}

const BASE = 'https://l2beat.com'

export const ENDPOINTS: EndpointDoc[] = [
  {
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
    request: `${BASE}/api/garden/project/lookup?addresses=eth:0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc`,
    response: `{
  "attestations": { ... },
  "results": [
    {
      "query": "eth:0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc",
      "matches": [
        {
          "id": "tornado-cash",
          "name": "Tornado Cash",
          "href": "${BASE}/privacy/projects/tornado-cash",
          "contractName": "Pool_0.1_ETH",
          "crops": {
            "censorshipResistance": { "sentiment": "good", "status": "reviewed" },
            "openSource": { "sentiment": "good", "status": "reviewed" },
            "privacy": { "sentiment": "good", "status": "reviewed" },
            "security": { "sentiment": "good", "status": "partiallyReviewed" }
          },
          "attestation": { "uid": "0x…", "revision": 3 }
        }
      ]
    }
  ]
}`,
  },
  {
    path: '/api/garden/project/{id}',
    summary: 'Everything about one protocol',
    description:
      '`{id}` is the project id or its slug; anything we have not reviewed answers 404.',
    request: `${BASE}/api/garden/project/tornado-cash`,
    response: `{
  "attestations": { ... },
  "id": "tornado-cash",
  "name": "Tornado Cash",
  "href": "${BASE}/privacy/projects/tornado-cash",
  "attested": true,
  "attestation": { "uid": "0x…", "revision": 3, "explorerUrl": "…" },
  "crops": {
    "censorshipResistance": {
      "sentiment": "good",
      "status": "reviewed",
      "points": ["Pools are immutable and adminless: …"],
      "missing": [],
      "notReviewed": ["The routers and interfaces users actually reach …"]
    },
    "openSource": { "sentiment": "good", "status": "reviewed", ... },
    "privacy": { "sentiment": "good", "status": "reviewed", ... },
    "security": { "sentiment": "good", "status": "partiallyReviewed", ... }
  }
}`,
  },
  {
    path: '/api/garden/crops',
    summary: 'The whole garden',
    description:
      'Every reviewed protocol in one response, and the attestation that names them.',
    request: `${BASE}/api/garden/crops`,
    response: `{
  "attestations": {
    "network": "ethereum",
    "chainId": 1,
    "isTestnet": false,
    "eas": "0x…",
    "schemaUid": "0x…",
    "schema": "string[] projectIds,uint64 reviewedAt,uint32 revision",
    "attester": "0x…",
    "current": {
      "uid": "0x…",
      "revision": 3,
      "reviewedAt": 1787132641,
      "projectIds": ["aztecnetwork", "ethscriptions", "tornado-cash", ...],
      "txHash": "0x…",
      "explorerUrl": "…"
    }
  },
  "projects": [ { "id": "aztecnetwork", ... }, ... ]
}`,
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
  'Link the badge to your page in the garden, so a visitor can read the evaluation rather than only see that one exists.',
  'The badge says we have reviewed you and named you onchain. It is not a certification, an audit, or an endorsement - please do not describe it as any of those.',
  'Your rating can change. Make sure to check the API for the latest status before showing the badge.',
]
