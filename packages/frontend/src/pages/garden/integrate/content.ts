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
    path: '/api/garden/crops',
    summary: 'Every reviewed protocol',
    description:
      'The full evaluations for every protocol in the garden, including the reasoning behind each crop. Use it to mirror the garden, or to cache the whole set.',
    example: `GET ${BASE}/api/garden/crops

{
  "framework": {
    "crops": ["censorshipResistance", "openSource", "privacy", "security"],
    "sentiments": ["good", "warning", "bad", "neutral", "UnderReview"],
    "statuses": ["reviewed", "partiallyReviewed", "notReviewed"]
  },
  "attestations": { "network": "sepolia", "isTestnet": true, ... },
  "projects": [
    {
      "id": "uniswapv3",
      "slug": "uniswapv3",
      "name": "Uniswap V3",
      "href": null,
      "crops": {
        "censorshipResistance": {
          "sentiment": "good",
          "status": "reviewed",
          "points": ["Pools are immutable and adminless: ..."],
          "missing": [],
          "notReviewed": ["The routers and interfaces users actually reach ..."]
        },
        ...
      },
      "attestation": null
    }
  ]
}`,
  },
  {
    path: '/api/garden/crops/:slug',
    summary: 'One protocol',
    description:
      'The same project object on its own. Accepts a slug or a project id, and answers 404 for anything we have not reviewed.',
    example: `GET ${BASE}/api/garden/crops/tornado-cash

{
  "framework": { ... },
  "attestations": { ... },
  "id": "tornado-cash",
  "name": "Tornado Cash",
  "href": "${BASE}/privacy/projects/tornado-cash",
  "crops": { ... },
  "attestation": { "uid": "0x…", "revision": 1, "explorerUrl": "…" }
}`,
  },
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
          "attestation": { "uid": "0x…", "revision": 1 }
        }
      ]
    }
  ]
}`,
  },
]

/** The rules a consumer would otherwise have to infer from our markup. */
export const VOCABULARY_NOTES = [
  '`sentiment` is the colour of the crop - how good it is. `status` is how thoroughly we looked. They are independent, and both are always present in a response: we resolve the defaults so you do not have to.',
  'A crop with `status: "notReviewed"` always reads `sentiment: "neutral"`. It is not a claim that the protocol is mediocre; it is the absence of a claim, and it should render as grey or as nothing at all.',
  '`points` is what an evaluation rests on, `missing` is what we checked and did not find, and `notReviewed` is what we have not assessed. Never present `notReviewed` as a criticism of the protocol.',
  'A protocol may appear with no `attestation` yet. The evaluation is still ours and still current - it simply has not been signed onchain.',
]

export const VERIFY_STEPS = [
  'Read the attestation from the EAS contract with the uid the API gave you: `getAttestation(uid)`.',
  'Check `revocationTime == 0`. When a rating changes we revoke the old attestation and issue a new one, so a revoked attestation is a stale verdict and must not be shown.',
  'Check `attester` and `schema` against the values below, so an attestation someone else made cannot be mistaken for ours.',
  'The four ratings are in the attestation itself, as plain strings. You do not need to call us to read them.',
  'To check the reasoning too, hash the canonical evaluation JSON and compare it to `evaluationHash` in the attestation.',
]
