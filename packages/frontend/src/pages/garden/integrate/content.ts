export interface EndpointDoc {
  path: string
  summary: string
  description: string
  /** Query parameters, if any. */
  params?: { name: string; description: string }[]
  example: string
}

const BASE = 'https://l2beat.com'

export const ENDPOINTS: EndpointDoc[] = [
  {
    path: '/api/garden/lookup',
    summary: 'Which protocol is this address?',
    description:
      'The endpoint for wallets: hand it the contracts a user is about to touch and it answers with the protocols they belong to, plus a compact rating per crop. Addresses are matched against L2BEAT discovery - the contracts, their implementations, and the accounts holding permissions over them - for reviewed protocols only, so anything else comes back as an empty match rather than a guess.',
    params: [
      {
        name: 'addresses',
        description:
          'Up to 50 comma-separated chain:address pairs. The chain may be an ERC-3770 short name (eth), a long name (ethereum) or a chain id (1). Address casing does not matter.',
      },
    ],
    example: `GET ${BASE}/api/garden/lookup?addresses=eth:0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc

{
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
          "role": "implementation",
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
    path: '/api/garden/crops/:slug',
    summary: 'Everything about one protocol',
    description:
      'The full evaluation for a single protocol: the rating for each crop, the reasoning behind it, what is missing, and what we have not looked at. This is where the detail lives - the attestation onchain names the id, this endpoint says what the id is worth. Accepts a slug or a project id, and answers 404 for anything we have not reviewed.',
    example: `GET ${BASE}/api/garden/crops/tornado-cash

{
  "framework": {
    "crops": [
      {
        "key": "censorshipResistance",
        "letter": "CR",
        "label": "Censorship resistance",
        "description": "Whether a user can transact without anyone being able to stop them: …"
      },
      ...
    ],
    "sentiments": { "good": "Good", "warning": "Medium", "bad": "Bad", ... },
    "statuses": { "reviewed": "Reviewed", "partiallyReviewed": "Partially reviewed", ... }
  },
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
    ...
  }
}`,
  },
  {
    path: '/api/garden/crops',
    summary: 'The whole garden',
    description:
      'Every reviewed protocol in one response, in the same shape. Use it to mirror the garden or to warm a cache; for a single lookup on a request path, prefer the two endpoints above.',
    example: `GET ${BASE}/api/garden/crops

{
  "framework": { ... },
  "attestations": {
    "network": "sepolia",
    "isTestnet": true,
    "schemaUid": "0x…",
    "attester": "0x…",
    "current": {
      "uid": "0x…",
      "revision": 3,
      "reviewedAt": 1787126071,
      "projectIds": ["aztecnetwork", "ethscriptions", "tornado-cash", ...],
      "explorerUrl": "…"
    }
  },
  "projects": [ { "id": "aztecnetwork", ... }, ... ]
}`,
  },
]

/** The rules a consumer would otherwise have to infer from our markup. */
export const VOCABULARY_NOTES = [
  '`sentiment` is the colour of the crop - how good it is. `status` is how thoroughly we looked. They are independent, and both are always present in a response: we resolve the defaults so you do not have to.',
  'A crop with `status: "notReviewed"` always reads `sentiment: "neutral"`. It is not a claim that the protocol is mediocre; it is the absence of a claim, and it should render as grey or as nothing at all.',
  '`points` is what an evaluation rests on, `missing` is what we checked and did not find, and `notReviewed` is what we have not assessed. Never present `notReviewed` as a criticism of the protocol.',
  'Every label and definition we render is in `framework`, so you can build the same tooltip we do without paraphrasing us into something subtly different.',
  'A protocol may appear with `attested: false`. The evaluation is still ours and still current - it simply has not been named onchain yet.',
]

export const VERIFY_STEPS = [
  'Read the attestation from the EAS contract with the uid in `attestations.current`: `getAttestation(uid)`.',
  'Check `revocationTime == 0`. When the set changes we revoke the old attestation and issue the next revision, so a revoked attestation is a stale claim and must not be shown.',
  'Check `attester` and `schema` against the values below, so an attestation someone else made cannot be mistaken for ours.',
  'Decode `projectIds`. That array is the whole claim: these are the protocols we have reviewed, as of `reviewedAt`, at revision `revision`.',
  'For what any of those ids is actually worth - the rating per crop, the reasoning, what we did not look at - call `/api/garden/crops/:id`. Ratings move as protocols change; the set moves far less, which is why only the set is onchain.',
]

/** What a reviewed protocol may and may not say with the badge. */
export const BADGE_RULES = [
  'Link the badge to your page in the garden, so a visitor can read the evaluation rather than only see that one exists.',
  'The badge says we have reviewed you and named you onchain. It is not a certification, an audit, or an endorsement - please do not describe it as any of those.',
  'Do not recolour the badge, change the wording, or use it if we have removed you from the set. Adding your own frame or placing it in a footer row is fine.',
  'Your rating can change. The badge deliberately does not show the four crops, so it never goes stale on your site - the link behind it always shows the current evaluation.',
]
