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
import {
  PRIVACY_TOOLS,
  type PrivacyTool,
  type PrivacyToolId,
} from './privacyTools'

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
 *
 * Each description is the framework's sentence, which completes the label:
 * "Public observer: reads public transactions…".
 */
export const PRIVACY_ADVERSARIES: Record<PrivacyAdversaryId, PrivacyAdversary> =
  {
    publicObserver: {
      id: 'publicObserver',
      label: 'Public observer',
      description: 'reads public transactions and follows explicit links.',
      examples: 'A curious counterparty, an employer, a journalist.',
    },
    chainAnalyst: {
      id: 'chainAnalyst',
      label: 'Chain analyst',
      description:
        'combines public data to correlate timing, amounts, gas payments and addresses.',
      examples: 'Chain analytics firms, ZachXBT, data brokers.',
    },
    networkObserver: {
      id: 'networkObserver',
      label: 'Network observer',
      description:
        "sees traffic on the user's network path and at third parties, such as ISPs, VPNs, public RPCs and relayers. Services the operator runs count as the insider, a service under the operator's account counts for both.",
      examples:
        'Infura or Alchemy, a Tornado relayer, a wallet vendor selling telemetry, Google captcha or analytics in the dapp frontend.',
    },
    privilegedInsider: {
      id: 'privilegedInsider',
      label: 'Privileged insider',
      description:
        'controls or serves part of the system, holds keys or plaintext, custodies funds, or delivers the app.',
      examples:
        'A compliance backdoor key, a DAO with an upgrade key, a KMS committee, an ASP operator, a custodial bridge.',
    },
    futureAdversary: {
      id: 'futureAdversary',
      label: 'Future adversary',
      description:
        'archives public data, then runs the known quantum attacks, which break elliptic curves, pairings and RSA, and uses every key they recover. Other schemes stand until an attack on them is known, and the cell names the assumption that remains. Retained logs, insider keys and recorded traffic are outside this scenario.',
      examples:
        'An intelligence agency archiving chain data today, then anyone once a break is public.',
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
      'Who receives the funds: the address they exit to, the receiver of a transfer, or whoever controls a one-time receiving address.',
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
    fields: PRIVACY_FIELD_ORDER.map((id) => ({
      ...PRIVACY_FIELDS[id],
      description:
        config.fieldDescriptions?.[id] ?? PRIVACY_FIELDS[id].description,
    })),
    cells,
    advice: config.advice,
  }
}

/** The methodology publication. Its How to stay private section explains the habits steps follow. */
export const PRIVACY_METHODOLOGY_URL = '/publications/privacy-methodology'

/**
 * Anchors in the methodology, rendered by the frontend. Steps link only the
 * list of routes and the tool entries: the project page links the How to stay
 * private section once.
 */
export const ADVICE_ANCHORS = {
  routes: 'routes',
} as const

/** A markdown link into the methodology, for a step's IP-hiding route. */
export function adviceLink(text: string, anchor: keyof typeof ADVICE_ANCHORS) {
  return `[${text}](${PRIVACY_METHODOLOGY_URL}#${ADVICE_ANCHORS[anchor]})`
}
/**
 * Markdown link from a step to a tool's methodology entry, which holds its
 * download. `text` defaults to the tool's first name and must contain one of
 * its names, e.g. "local Ethereum node".
 */
export function toolLink(id: PrivacyToolId, text?: string) {
  const tool: PrivacyTool = PRIVACY_TOOLS[id]
  return `[${text ?? tool.names[0]}](${PRIVACY_METHODOLOGY_URL}#${tool.anchor})`
}

/**
 * Imperative sentences for `advice` steps, one per habit the methodology
 * explains. A step prints one unchanged or writes its own sentence.
 */
export const ADVICE_SNIPPETS = {
  /** Pools. `relayer` is the project's word for it. */
  relayer: (relayer: string) =>
    `Use a ${relayer} for the exit, so no wallet of yours pays gas for the receiving address.`,
  largestPool: 'Use the pool with the most depositors.',
  commonAmounts: 'Move common amounts rather than everything at once.',
  /** Set `randomWait` on its step, so the page draws the time. */
  wait: 'Wait a random time before exiting, and exit only after many others have moved funds in and out.',
  freshAddress:
    'Send each exit to a fresh address and spend from it with a separate wallet.',
  /** Hosted web apps that work in Tor Browser. */
  torBrowser: `Open the app in ${toolLink('torBrowser')}.`,
  /** Native apps and anything else Tor Browser cannot run. */
  ipHidingRoute: (app: string) =>
    `Run ${app} with all traffic through an ${adviceLink('IP-hiding route', 'routes')}.`,
} as const

/** Exposure sentences that at least four projects print unchanged. */
export const PRIVACY_ADVERSARY_SNIPPETS = {
  // Public observer
  /** Pools: the public ends of a shielded flow. */
  entryExitPublic: (entryExit = 'Deposits and withdrawals') =>
    `${entryExit} show address, token and amount.`,

  // Chain analyst
  /** Pools: the self-paid alternative to a relayer. */
  walletFingerprint: (relayer: string) =>
    `Paying gas from the user's wallet instead of a ${relayer} exposes its fingerprint, account implementation and fee habits, even from a fresh address.`,

  // Future adversary
  /** Account keys derived from a wallet signature. `extra` names what else is needed, e.g. a PIN. */
  walletSignatureAccounts: (extra?: string) =>
    `Accounts created from a wallet signature reduce to that wallet's key${extra ? ` ${extra}` : ''}.`,
} as const
