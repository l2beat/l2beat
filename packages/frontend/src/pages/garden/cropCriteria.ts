import type { ProjectCrops } from '@l2beat/config'

/**
 * Marks where `reference` is linked inside a minimum, so the authority is
 * named in the sentence that defers to it rather than tacked on underneath.
 */
export const REFERENCE_SLOT = '{{reference}}'

/**
 * The bar for each crop, distilled from the evaluations already published in
 * the garden: every line here is a claim the plant tooltips actually make, not
 * a wish list. `minimums` is what a project has to clear for a healthy green
 * plant; `pullsDown` lists what has actually turned a crop yellow or wilted it.
 * Kept short on purpose - a bar nobody reads to the end is not a bar.
 */
export interface CropCriteria {
  key: keyof ProjectCrops
  question: string
  /** Shown in the plant tooltip, not in the card body. */
  summary: string
  minimums: string[]
  pullsDown: string[]
  /**
   * The outside authority a criterion defers to, where there is one. Linked
   * into the minimum carrying `REFERENCE_SLOT`, so a reader can check the bar
   * rather than take our word for it.
   */
  reference?: { label: string; href: string }
}

export const CROP_CRITERIA: CropCriteria[] = [
  {
    key: 'censorshipResistance',
    question: 'Can anyone use it, and can everyone leave?',
    summary:
      'Nobody - not the team, not an operator, not a governance vote - can stand between a user and their funds.',
    minimums: [
      'Permissionless access and exit: no allowlist, no KYC gate, no operator whose approval you need.',
      'An infinite exit window, or one long enough to leave: the core contracts are immutable, unpausable, and cannot be upgraded.',
      'Passes the walkaway test: with the team, the frontend and every relayer gone, users can still claim and withdraw.',
      'Any power over users is named and bounded - it applies to everyone equally and cannot reach payment or withdrawal logic.',
    ],
    pullsDown: [
      'Inclusion that is only probabilistic, with no forced-transaction path a user can count on.',
      'A single relayer, or a set users cannot bypass by self-relaying.',
      'A pause or a transaction filter a user cannot see coming - in the contracts, the RPC, or the node itself.',
    ],
  },
  {
    key: 'openSource',
    question: 'Can we read it, rebuild it, and run it ourselves?',
    summary:
      'Everything needed to participate is published, under a license that lets you use it.',
    minimums: [
      `A license granting the right to run, modify and fork - one on ${REFERENCE_SLOT}. Delayed-source counts only once the grant is in effect.`,
      'Every component you need in order to participate is published: contracts, node, prover, interface.',
      'Deployed bytecode verified against that source, with verifier contracts and program hashes anyone can regenerate.',
      'It can be built and run locally, so forking is a real option rather than a licence to read.',
    ],
    pullsDown: [
      'A source-available license still reserving commercial or competing use.',
      'A closed component in the critical path - prover, indexer or interface.',
      'Unverified contracts, or a program hash nobody outside the team can reproduce.',
    ],
    reference: {
      label: 'the OSI register of approved licenses',
      href: 'https://opensource.org/licenses',
    },
  },
  {
    key: 'privacy',
    question: 'Does using it cost you your privacy?',
    summary:
      'Privacy enforced by cryptography rather than by policy, with no way to undo it after the fact.',
    minimums: [
      'Unlinkability observers cannot undo: zk proofs, encrypted state or stealth addresses.',
      'No backdoor. No privileged view key, no admin de-anonymization, nothing retroactive.',
      'Private by default, not a mode most users never switch on.',
      'A stated anonymity set, and an honest account of what stays public.',
    ],
    pullsDown: [
      'Metadata that still reaches someone - a provider, an oracle, a sequencer - or an anonymity set too small to hide in.',
      'Compliance gating or address screening anywhere in the stack, whatever the current policy says.',
      'Privacy that depends on a relayer staying available, or that users can be pushed out of.',
    ],
  },
  {
    key: 'security',
    question: 'What has to go right for your funds to stay yours?',
    summary:
      'Less about the audit count than about who can move user funds, and how much warning there would be.',
    minimums: [
      'Contracts holding user funds are immutable, or upgrades sit behind a delay long enough to exit.',
      'State validated by the canonical route - proofs on L1, not an external oracle or a committee.',
      'A small, calm surface: few dependencies, a quiet upgrade history, and time live without incident.',
      'An honest account of what a single failure would cost - a second proof system, circuit breakers, or the bound stated plainly.',
    ],
    pullsDown: [
      'A lone proof system with known vulnerabilities, or a prover bug nobody has bounded.',
      'A multisig that can swap an implementation or a root with no delay.',
      'Cryptography that is not quantum-resistant, exposing users to harvest-now-decrypt-later.',
    ],
  },
]
