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
      'Hand it the contracts a user is about to touch; it answers with the protocols they belong to and a rating per crop. Addresses are matched against L2BEAT discovery - proxies, implementations, and the accounts holding permissions over them - for reviewed protocols only, so anything else comes back empty rather than as a guess.',
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
      'The same crops, plus the reasoning behind each one: what the rating rests on, what is missing, and what we have not assessed. `{id}` is the project id or its slug; anything we have not reviewed answers 404.',
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
      'Every reviewed protocol in one response, plus `framework` - the label and definition of each crop, and of every sentiment and status we might send. Use it to mirror the garden or to warm a cache.',
    request: `${BASE}/api/garden/crops`,
    response: `{
  "framework": {
    "crops": [
      { "key": "censorshipResistance", "letter": "CR", "label": "Censorship resistance", "description": "…" },
      ...
    ],
    "sentiments": { "good": "Good", "warning": "Medium", "bad": "Bad", ... },
    "statuses": { "reviewed": "Reviewed", "partiallyReviewed": "Partially reviewed", ... }
  },
  "attestations": {
    "schemaUid": "0x…",
    "attester": "0x…",
    "current": {
      "uid": "0x…",
      "revision": 3,
      "reviewedAt": 1787132641,
      "projectIds": ["aztecnetwork", "ethscriptions", "tornado-cash", ...],
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
  'Decode `projectIds`. That array is the whole claim: these are the protocols we have reviewed, as of `reviewedAt`, at revision `revision`.',
  'For what any of those ids is actually worth - the rating per crop, the reasoning, what we did not look at - call `/api/garden/project/{id}`. Ratings move as protocols change; the set moves far less, which is why only the set is onchain.',
]

/** What a reviewed protocol may and may not say with the badge. */
export const BADGE_RULES = [
  'Link the badge to your page in the garden, so a visitor can read the evaluation rather than only see that one exists.',
  'The badge says we have reviewed you and named you onchain. It is not a certification, an audit, or an endorsement - please do not describe it as any of those.',
  'Do not recolour the badge, change the wording, or use it if we have removed you from the set. Adding your own frame or placing it in a footer row is fine.',
  'Your rating can change. The badge deliberately does not show the four crops, so it never goes stale on your site - the link behind it always shows the current evaluation.',
]
