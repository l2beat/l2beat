import type {
  PrivacyAdversariesConfig,
  PrivacyAdversary,
  PrivacyAdversaryAssessment,
  PrivacyAdversaryCell,
  PrivacyAdversaryId,
  PrivacyAdversarySentiment,
  PrivacyExposure,
  PrivacyField,
  PrivacyFieldExposure,
  PrivacyFieldInfo,
  ProjectPrivacyAdversaries,
} from '../types'

/**
 * Each cell carries one judgment, its sentiment (see PrivacyAdversaryAssessment).
 * Its value is derived: the subject the protocol promises to protect
 * (`promise.protects`) plus the state that matches the sentiment. Identity and
 * other leaks beyond the public observer are derived markers (`identity`,
 * `alsoExposed`), never a change of subject. Default-path footguns never affect
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
        'Anyone with a block explorer, today. Sees every transaction, event and storage slot, but does no correlation beyond following links.',
      examples: 'A curious counterparty, an employer, a journalist.',
    },
    chainAnalyst: {
      id: 'chainAnalyst',
      label: 'Chain analyst',
      description:
        'Keeps a copy of the whole chain forever and correlates it: timing, amounts, gas and wallet fingerprints, address clusters, and offchain data such as exchange KYC. Cannot coerce anyone.',
      examples:
        'Chain analytics firms, tax authorities, data brokers, anyone who buys their data later.',
    },
    networkObserver: {
      id: 'networkObserver',
      label: 'Network observer',
      description:
        'Sits between the user and the chain and sees traffic only: RPC providers, relayers and broadcasters, indexers, ISPs, and services that never receive keys or plaintext. Learns IP addresses, timing, ciphertext and what becomes public a block later.',
      examples:
        'Infura or Alchemy, a Tornado relayer, a wallet vendor selling telemetry.',
    },
    privilegedInsider: {
      id: 'privilegedInsider',
      label: 'Privileged insider',
      description:
        'Holds a protocol role or receives keys or plaintext by design: upgrade admin, sequencer, decryption or view key holder, TEE vendor, association set provider, hosted prover, note registry. Can SEE more than the public, or EXCLUDE users, which also partitions anonymity sets.',
      examples:
        'A DAO with an upgrade key, a KMS committee, an ASP operator, or whoever can compel them.',
    },
    futureAdversary: {
      id: 'futureAdversary',
      label: 'Future adversary',
      description:
        'Harvest now, decrypt later. Holds every byte ever written onchain plus any retained logs, and future cryptanalysis such as a large quantum computer that breaks elliptic-curve key exchange and pairings, but not hashes, symmetric ciphers or lattices.',
      examples: 'Anyone, once the cryptography or the operator logs fail.',
    },
  }

export const PRIVACY_FIELDS: Record<PrivacyField, PrivacyFieldInfo> = {
  sender: {
    id: 'sender',
    label: 'Sender',
    subject: 'Sender',
    description:
      'The Ethereum address that funds entered from, or that initiated a transfer.',
  },
  recipient: {
    id: 'recipient',
    label: 'Recipient',
    subject: 'Recipient',
    description:
      'The Ethereum address that funds exit to, or that receives a transfer.',
  },
  amount: {
    id: 'amount',
    label: 'Amount',
    subject: 'Amounts',
    description: 'The value moved.',
  },
  asset: {
    id: 'asset',
    label: 'Asset',
    subject: 'Asset',
    description: 'Which token is moved.',
  },
  linkage: {
    id: 'linkage',
    label: 'Link',
    subject: 'Link',
    description:
      'Whether the entry and exit of the same funds, or sender and recipient of the same transfer, can be tied together.',
  },
  identity: {
    id: 'identity',
    label: 'Identity',
    subject: 'Identity',
    description:
      'The person behind an address: IP address, API key, exchange KYC record.',
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

function worse(a: PrivacyExposure, b: PrivacyExposure): PrivacyExposure {
  return EXPOSURE_SEVERITY[a] >= EXPOSURE_SEVERITY[b] ? a : b
}

const SEGMENTS = ['boundary', 'interior'] as const

/** Worst verdict of a field across the segments a cell has. */
export function getFieldExposure(
  cell: PrivacyAdversaryAssessment,
  field: PrivacyField,
): PrivacyExposure {
  let result: PrivacyExposure = 'private'
  for (const segment of SEGMENTS) {
    const map = cell[segment]
    if (map) result = worse(result, getExposure(map[field]))
  }
  return result
}

/**
 * Fields, other than the promised one and identity, that this adversary
 * learns more about than the public observer does in some segment.
 */
export function getAlsoExposed(
  protects: PrivacyField,
  cell: PrivacyAdversaryAssessment,
  baseline: PrivacyAdversaryAssessment,
): PrivacyField[] {
  return PRIVACY_FIELD_ORDER.filter((field) => {
    if (field === protects || field === 'identity') return false
    return SEGMENTS.some((segment) => {
      const map = cell[segment]
      const base = baseline[segment]
      if (!map || !base) return false
      return (
        EXPOSURE_SEVERITY[getExposure(map[field])] >
        EXPOSURE_SEVERITY[getExposure(base[field])]
      )
    })
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
  'identity',
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
            identity: getFieldExposure(cell, 'identity'),
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
