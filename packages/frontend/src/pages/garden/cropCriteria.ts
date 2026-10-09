import type { CropKey } from '~/components/garden/crops'
import { OSSIFICATION_SCORE_BANDS } from '~/components/ossification/ossificationScoreBands'

/** Marks where `reference` is linked inside a minimum. */
export const REFERENCE_SLOT = '{{reference}}'

/** The bar for each crop, distilled from the evaluations already in the garden. */
export interface CropCriteria {
  question: string
  /** Shown in the plant tooltip, not in the card body. */
  summary: string
  minimums: string[]
  pullsDown: string[]
  /** Linked into the minimum carrying `REFERENCE_SLOT`. */
  reference?: { label: string; href: string }
}

export const CROP_CRITERIA: Record<CropKey, CropCriteria> = {
  censorshipResistance: {
    question: 'Can anyone use it, and can everyone leave?',
    summary:
      'No one, including the team, an operator or governance, can stop a user from using the protocol or withdrawing their funds.',
    minimums: [
      'Anyone can use it and exit it: no allowlist, no KYC, and no operator whose approval is needed.',
      'The core contracts cannot be upgraded or paused, or any change waits at least 30 days, so users can exit first.',
      'Passes the walkaway test: users can still withdraw if the team, the frontend and every relayer disappear.',
      'Any remaining admin power is documented and limited: it applies to all users equally and cannot affect payments or withdrawals.',
    ],
    pullsDown: [
      'Transactions are only included probabilistically, with no guaranteed way to force one in.',
      'A single relayer, or relayers that users cannot bypass by relaying their own transactions.',
      'A pause or a transaction filter that can be applied without notice, in the contracts, the RPC or the node.',
    ],
  },
  openSource: {
    question: 'Can we read it, rebuild it, and run it ourselves?',
    summary:
      'Everything needed to use the protocol is published under a license that allows running, modifying and forking it.',
    minimums: [
      `A license granting the right to run, modify and fork, as listed on ${REFERENCE_SLOT}. Code under a delayed license counts only once that license has converted.`,
      'Every component needed to use the protocol is published, such as the contracts, the interface and, for rollups, the node and prover.',
      'Deployed bytecode is verified against the published source. Where there is a ZK verifier or a program hash, anyone can regenerate it from source.',
      'It can be built and run locally, so it can actually be forked.',
    ],
    pullsDown: [
      'A source-available license that restricts commercial or competing use.',
      'A closed-source component that users depend on, such as the prover, indexer or interface.',
      'Unverified contracts, or a program hash that no one outside the team can reproduce.',
    ],
    reference: {
      label: 'the OSI register of approved licenses',
      href: 'https://opensource.org/licenses',
    },
  },
  privacy: {
    question: 'Does using it cost you your privacy?',
    summary:
      'Privacy is enforced by cryptography, not by policy, and cannot be undone later.',
    minimums: [
      'Outside observers cannot link transactions, thanks to ZK proofs, encrypted state or stealth addresses.',
      'No backdoor: no privileged viewing key and no way for an admin to deanonymize users, now or retroactively.',
      'Private by default, not an optional mode.',
      'The size of the anonymity set is published, together with what remains public.',
    ],
    pullsDown: [
      'Metadata visible to a third party, such as a provider, an oracle or a sequencer, or an anonymity set too small to protect users.',
      'Compliance checks or address screening anywhere in the stack, even if not currently enforced.',
      'Privacy that depends on a relayer staying available, or that users can be excluded from.',
      'Privacy that relies on trusted hardware, such as a TEE.',
    ],
  },
  security: {
    question: 'Can users lose their funds?',
    summary:
      'Who can move or freeze user funds, and how much notice users get before a change.',
    minimums: [
      'Contracts holding user funds cannot be upgraded, or upgrades wait at least 30 days, so users can exit first.',
      'Where the system posts state to L1, that state is validated by proofs, not by an external oracle or a committee.',
      `Few external dependencies, such as oracles, bridges or offchain services, and an ${REFERENCE_SLOT} of at least ${OSSIFICATION_SCORE_BANDS.good}, which takes about a year without a critical change.`,
      'Protection against a single failure, such as a second proof system or circuit breakers, or a clear statement of the maximum possible loss.',
    ],
    pullsDown: [
      'A single proof system with known vulnerabilities, or no limit on what a prover bug could cost.',
      'A multisig that can upgrade contracts or replace state roots without delay.',
      `An ossification score below ${OSSIFICATION_SCORE_BANDS.good} limits Security to medium. Below ${OSSIFICATION_SCORE_BANDS.warning}, which means a critical change in roughly the last five weeks, Security is bad and the project is not listed.`,
    ],
    reference: {
      label: 'ossification score',
      href: '/publications/ossification',
    },
  },
}
