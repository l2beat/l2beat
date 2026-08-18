import type { ProjectCrops } from '@l2beat/config'

/**
 * The bar for each crop, written from the evaluations already published in the
 * garden. `minimums` is what a project has to clear for a healthy green plant;
 * `pullsDown` lists the findings that have actually turned a crop yellow or
 * wilted it so far.
 */
export interface CropCriteria {
  key: keyof ProjectCrops
  question: string
  /** Shown in the plant tooltip, not in the card body. */
  summary: string
  minimums: string[]
  pullsDown: string[]
}

export const CROP_CRITERIA: CropCriteria[] = [
  {
    key: 'censorshipResistance',
    question: 'Can anyone use it, and can everyone leave?',
    summary:
      'Nobody - not the team, not an operator, not a governance vote - can stand between a user and their funds.',
    minimums: [
      'Permissionless access: no allowlist, no KYC gate, no operator whose approval you need to transact or exit.',
      'If operators are whitelisted, users can self-serve instead, or the set is decentralised enough that no single member can block them.',
      'Passes the walkaway test: with the team, the frontend and every relayer gone, users can still claim and withdraw.',
      'Every power to stop a user transacting is attributed to a named holder - nobody, a DAO, a multisig, an EOA. A separate question from who can upgrade.',
      'No way to single out one user. Governance powers apply to everyone equally and cannot reach payment or withdrawal logic.',
      'Pausing the escape hatch, disabling forced inclusion or adding transaction filters is subject to the same delay as an upgrade.',
    ],
    pullsDown: [
      'Inclusion is only probabilistic - no L1 forced-transaction queue, no bounded inclusion delay.',
      'Forced inclusion can be paused or allowlisted at any level - sequencer, RPC, contracts, or the node state transition function.',
      'Transaction filters that live in the node state transition function or the RPC, where a user cannot see them coming.',
      'A gatekeeper can revoke your private path and force a public exit.',
      'A small relayer set that users cannot bypass by self-relaying.',
      'A single relayer pool, with no independent alternative to switch to.',
    ],
  },
  {
    key: 'openSource',
    question: 'Can we read it, rebuild it, and run it ourselves?',
    summary:
      'Everything needed to participate is published, under a license that lets you use it.',
    minimums: [
      'A license granting the right to run, modify and fork - GPL, Apache 2.0, MIT. Delayed-source counts only once the grant is in effect.',
      'The license is OSI-approved, so the source cannot be captured later.',
      'Every component in the chain of trust is published and named: contracts, nodes, provers, interface.',
      'Deployed bytecode verified against published source, with verifier contracts and program hashes reproducible.',
      'Node builds are reproducible from published source, transaction filters and all.',
    ],
    pullsDown: [
      'A source-available license still reserving commercial or competing use.',
      'Unverified contracts, or a program hash nobody outside the team can reproduce.',
      'A closed component in the critical path - prover, indexer or interface.',
      'Source that is published but not readable - no build instructions, nothing an outside auditor can follow.',
      'A fork could take the code but not the state, the operating stack or the data.',
    ],
  },
  {
    key: 'privacy',
    question: 'Does using it cost you your privacy?',
    summary:
      'Privacy enforced by cryptography rather than by policy, with no way to undo it after the fact.',
    minimums: [
      'Unlinkability observers cannot undo: zk proofs, encrypted state or stealth addresses.',
      'No backdoor. No privileged view key, no admin de-anonymization, nothing retroactive.',
      'Private execution and private transfers are the default, not a mode most users never switch on.',
      'A stated anonymity set, and an honest account of what stays public.',
    ],
    pullsDown: [
      'Compliance gated by a provider that decides which deposits may ever be withdrawn privately.',
      'Address screening anywhere in the stack, or the chain itself blacklisting privacy applications.',
      'Metadata that reaches specific parties - a provider, an oracle, a sequencer - even when it never becomes public.',
      'A history of enforcing KYC, whatever the current policy says.',
      'Transaction data held by a committee or a permissioned DA layer rather than onchain blobs or a public DA layer.',
      'Privacy that depends on a relayer being available.',
      'Privacy that is opt-in, or that users can be pushed out of.',
      'Cryptography that is not quantum-resistant, exposing users to harvest-now-decrypt-later.',
    ],
  },
  {
    key: 'security',
    question: 'What has to go right for your funds to stay yours?',
    summary:
      'Less about the audit count than about who can move user funds, and how much warning there would be.',
    minimums: [
      'Contracts holding user funds are immutable, or upgrades sit behind a delay long enough to exit. No instant implementation swap.',
      'A calm upgrade history. Frequent or complex upgrades force users to keep re-reviewing what they are trusting.',
      'A bound on what a single failure can cost: onchain circuit breakers, or rate limits on withdrawals.',
      'For anything crosschain: state validated by the canonical route, not by an external oracle or a committee.',
      'A bridge that mints its own representation of an asset discloses the mint authority and its limits.',
      'Where proofs are the security model, a detector for soundness or invalid-proof failures.',
      'More than one proof system, or an honest account of what a single prover bug would cost.',
      'Formal verification of the code where a bug would be unrecoverable.',
      'Monitoring that would catch an exploit in progress, run by someone, with a documented response.',
    ],
    pullsDown: [
      'A multisig that can swap an implementation or a root with no delay.',
      'An upgrade every few weeks, so no user can keep up with what they are trusting.',
      'A concentrated prover market, or fees extracted well above L1 costs with no rebate policy.',
    ],
  },
]

/** What a project needs before a review is even possible. */
export const GROUND_RULES = [
  'The protocol is live, with real users.',
  'It can be reviewed from public sources: verified contracts, published source, docs.',
  'There is someone who can answer our questions.',
]

/** The submission process, start to finish. */
export const PROCESS_STEPS = [
  {
    title: 'Send us the details',
    description:
      'A few minutes of to fill in the template and create a forum post.',
  },
  {
    title: 'We check that it fits',
    description:
      'We confirm it is live and reviewable from public sources.',
  },
  {
    title: 'We review it',
    description:
      'We review based on onchain data and the provided sources, and come up with a conclusion. If it is CROPS-y enough, it will be added to the garden. If not, you will get the feedback in the forum.',
  },
  {
    title: 'We monitor and stay open for feedback',
    description:
      'Any changes might affect the assessment, and opinions are welcome in the forum.',
  },
]
