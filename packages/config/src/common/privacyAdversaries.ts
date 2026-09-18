import type {
  PrivacyAdversariesConfig,
  PrivacyAdversary,
  PrivacyAdversaryAssessment,
  PrivacyAdversaryCell,
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyAlsoExposed,
  PrivacyExposure,
  PrivacyField,
  PrivacyFieldExposure,
  PrivacyFieldInfo,
  ProjectPrivacyAdversaries,
} from '../types'

/**
 * Each cell carries one judgment, its sentiment (see PrivacyAdversaryAssessment).
 * Its value is derived: the subject the protocol promises to protect
 * (`promise.protects`) plus the state that matches the sentiment. Other leaks
 * beyond the public observer are a derived marker (`alsoExposed`), never a
 * change of subject. Default-path footguns never affect
 * the sentiment; they are `atRisk` verdicts in the exposure maps, and "at risk"
 * means the same thing at field and cell level: private only under the
 * condition in the note.
 *
 * Ordered along the "spine": the first, second and fifth adversary see the
 * same public data with increasing time and effort, so protection against a
 * later one implies protection against an earlier one. The network observer
 * and the privileged insider are positional and do not nest with the spine.
 */
export const PRIVACY_ADVERSARIES: Record<PrivacyAdversaryId, PrivacyAdversary> =
  {
    publicObserver: {
      id: 'publicObserver',
      label: 'Public observer',
      description:
        'Everyone with a block explorer and some basic tools. Sees every public onchain event, but does no correlation beyond following links.',
      examples: 'A curious counterparty, an employer, a journalist.',
    },
    chainAnalyst: {
      id: 'chainAnalyst',
      label: 'Chain analyst',
      description:
        'Scrapes all public data and correlates it: timing, amounts, gas and wallet fingerprints, address clusters.',
      examples: 'Chain analytics firms, ZachXBT, data brokers.',
    },
    networkObserver: {
      id: 'networkObserver',
      label: 'Network observer',
      description:
        'Sits between the user and the chain and sees web2 traffic only: RPC providers, relayers and broadcasters, indexers, ISPs. Learns IP addresses, timing, browser fingerprints, ciphertext and what becomes public. Assumes Tor to send transactions and, where the client has an RPC setting, an own node to read the blockchain.',
      examples:
        'Infura or Alchemy, a Tornado relayer, a wallet vendor selling telemetry, Google captcha or analytics in the dapp frontend.',
    },
    privilegedInsider: {
      id: 'privilegedInsider',
      label: 'Privileged insider',
      description:
        'Holds a protocol operator role or receives keys or plaintext by design: upgrade admin, sequencer, decryption or view key holder, TEE vendor, association set provider, hosted prover, note registry.',
      examples:
        'A compliance backdoor key, a DAO with an upgrade key, a KMS committee, an ASP operator.',
    },
    futureAdversary: {
      id: 'futureAdversary',
      label: 'Future adversary',
      description:
        'Harvest now, decrypt later. Holds every byte ever written onchain plus any retained logs, and future cryptanalysis such as a large quantum computer that breaks elliptic-curve key exchange and pairings, but not hashes, symmetric ciphers or lattices.',
      examples:
        'First well-funded insiders, then everyone in a potential post-quantum future.',
    },
  }

export const PRIVACY_FIELDS: Record<PrivacyField, PrivacyFieldInfo> = {
  sender: {
    id: 'sender',
    label: 'Sender',
    subject: 'Sender',
    promiseLabel: 'Sender privacy',
    description:
      'The Ethereum address that funds entered from, or that initiated a transfer.',
  },
  recipient: {
    id: 'recipient',
    label: 'Recipient',
    subject: 'Recipient',
    promiseLabel: 'Recipient privacy',
    description:
      'The Ethereum address that funds exit to, or that receives a transfer.',
  },
  amount: {
    id: 'amount',
    label: 'Amount',
    subject: 'Amounts',
    promiseLabel: 'Amount privacy',
    description: 'The value moved.',
  },
  asset: {
    id: 'asset',
    label: 'Asset',
    subject: 'Asset',
    promiseLabel: 'Asset privacy',
    description: 'Which token is moved.',
  },
  linkage: {
    id: 'linkage',
    label: 'Link',
    subject: 'Link',
    promiseLabel: 'Link privacy',
    description:
      'Whether the entry and exit of the same funds, or sender and recipient of the same transfer, can be tied together.',
  },
}

const SENTIMENT_STATE: Record<PrivacyAdversarySentiment, string> = {
  good: 'private',
  warning: 'at risk',
  bad: 'exposed',
}

/** "Link private", "Amounts exposed": the derived table value of a cell. */
export function getPrivacyAdversaryValue(
  protects: PrivacyField,
  cell: PrivacyAdversaryAssessment,
): string {
  return `${PRIVACY_FIELDS[protects].subject} ${SENTIMENT_STATE[cell.sentiment]}`
}

const EXPOSURE_SEVERITY: Record<PrivacyExposure, number> = {
  private: 0,
  unverifiable: 1,
  atRisk: 2,
  exposed: 3,
}

export function getExposure(leak: PrivacyFieldExposure): PrivacyExposure {
  return typeof leak === 'string' ? leak : leak.verdict
}

/** Verdict of a field inside the protocol; private when there is no interior. */
export function getFieldExposure(
  cell: PrivacyAdversaryAssessment,
  field: PrivacyField,
): PrivacyExposure {
  return cell.interior ? getExposure(cell.interior[field]) : 'private'
}

/**
 * Fields, other than the promised one, that this adversary learns more about
 * than the public observer does inside the protocol.
 */
export function getAlsoExposed(
  protects: PrivacyField,
  cell: PrivacyAdversaryAssessment,
  baseline: PrivacyAdversaryAssessment,
): PrivacyAlsoExposed[] {
  return PRIVACY_FIELD_ORDER.flatMap((field) => {
    if (field === protects) return []
    const exposure = getFieldExposure(cell, field)
    if (
      EXPOSURE_SEVERITY[exposure] <=
      EXPOSURE_SEVERITY[getFieldExposure(baseline, field)]
    ) {
      return []
    }
    return [{ field, exposure }]
  })
}

export const PRIVACY_ADVERSARY_ORDER: PrivacyAdversaryId[] = [
  'publicObserver',
  'chainAnalyst',
  'networkObserver',
  'privilegedInsider',
  'futureAdversary',
]

export const PRIVACY_FIELD_ORDER: PrivacyField[] = [
  'sender',
  'recipient',
  'amount',
  'asset',
  'linkage',
]

/** Derives cell values and attaches the registries for the frontend. */
export function definePrivacyAdversaries(
  config: PrivacyAdversariesConfig,
): ProjectPrivacyAdversaries {
  const { protects } = config.promise
  const baseline = config.cells.publicObserver
  const cells = Object.fromEntries(
    PRIVACY_ADVERSARY_ORDER.map(
      (id): [PrivacyAdversaryId, PrivacyAdversaryCell] => {
        const cell = config.cells[id]
        return [
          id,
          {
            ...cell,
            id,
            value: getPrivacyAdversaryValue(protects, cell),
            alsoExposed:
              id === 'publicObserver'
                ? []
                : getAlsoExposed(protects, cell, baseline),
          },
        ]
      },
    ),
  ) as Record<PrivacyAdversaryId, PrivacyAdversaryCell>

  return {
    promise: config.promise,
    adversaries: PRIVACY_ADVERSARY_ORDER.map((id) => PRIVACY_ADVERSARIES[id]),
    fields: PRIVACY_FIELD_ORDER.map((id) => PRIVACY_FIELDS[id]),
    cells,
  }
}

export const PRIVACY_ADVERSARY_SNIPPETS = {
  // Public observer
  /** Pools: the public ends of a shielded flow. */
  entryExitPublic: (entryExit = 'Deposits and withdrawals') =>
    `${entryExit} show address, token and amount.`,
  /** Pools. `relayer` is the project's word for it. */
  exitViaRelayer: (relayer: string) =>
    `Exit through a ${relayer}, so no wallet of yours pays gas for the receiving address.`,
  /** Stealth addresses handed out by an operator: the rest of the promise. */
  stealthPromiseTail:
    'The payer knows the address it was given; sender, asset, amount and where the funds go next are public.',
  /** Stealth addresses: receive hygiene. `separate` is the client's way to keep balances apart. */
  freshReceive: (separate: string) =>
    `Generate a fresh address for each receive, ${separate}, and send to destinations with no public link to you.`,

  // Chain analyst
  /** Pools: the self-paid alternative to a relayer. */
  walletFingerprint: (relayer: string) =>
    `Paying gas from your own wallet instead of a ${relayer} exposes that wallet's fingerprint, its account implementation and fee habits, even from a fresh address.`,
  largeAnonymitySet: 'Use a pool with a large anonymity set.',
  commonAmounts: 'Withdraw common amounts rather than everything at once.',
  /** Pools: hygiene every pool needs on top of its specifics. */
  freshExit:
    'Wait before exiting and pick a different time of day than the deposit. Exit to a fresh address every time and spend from it with a different wallet than the one that deposited.',

  // Network observer
  /** Open clients with an RPC setting and a relayer. */
  ownNodeAndTor: (relayer: string) =>
    `Read the chain from your own node, send through a public RPC over Tor, and use a popular ${relayer}. If you settle for a VPN instead of Tor, pick one you trust: it hides your IP from the ${relayer} but sees it itself.`,

  // Privileged insider
  /** Open clients served from a hosted frontend. */
  localBuild:
    'Run an inspected local build of the client instead of the hosted frontend.',
  /** Stealth addresses handed out by an operator. */
  operatorViewingKey: (operator: string) =>
    `${operator} holds the viewing key, so it can regenerate every address and tie its activity to your account.`,
  localClientSpendingKeys: (operator: string) =>
    `Verify address derivations and transactions with an inspected local client. This protects your spending keys but does not remove ${operator}'s view.`,

  // Future adversary
  /** Stealth addresses without onchain announcements. */
  noAnnouncementQuantum: (operator: string) =>
    `No announcement is published, so a quantum computer cannot replay address derivations from the chain alone. The viewing key held by ${operator} exposes the history regardless.`,
  /** Account keys derived from a wallet signature. `extra` names what else is needed, e.g. a PIN. */
  walletSignatureAccounts: (extra?: string) =>
    `Accounts created from a wallet signature reduce to that wallet's key${extra ? ` ${extra}` : ''}.`,
  /** `alternative` is the client's own option, e.g. "from a seed phrase". */
  notWalletSignature: (alternative: string) =>
    `Create your account ${alternative}, not from a wallet signature.`,
  permanentlyDisclosed: (what: string) =>
    `Treat ${what} as permanently disclosed.`,
} as const
