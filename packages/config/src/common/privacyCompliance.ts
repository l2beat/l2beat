import type {
  PrivacyAdversarySentiment,
  PrivacyComplianceConfig,
  PrivacyComplianceLadder,
  PrivacyComplianceLadderId,
  PrivacyCompliancePower,
  PrivacyComplianceRequirementId,
  PrivacyComplianceRung,
  PrivacyComplianceRungInfo,
  PrivacyDisclosureLevel,
  PrivacyDisclosureLevelInfo,
  ProjectPrivacyCompliance,
} from '../types'

/**
 * The compliance framework. A lens is worse than a gate: with a gate the
 * user knows and can go elsewhere, with a lens they don't. Each ladder's
 * headline is its worst rung; scope, reach and holder never move a rung.
 */
export const PRIVACY_COMPLIANCE_LADDERS: Record<
  PrivacyComplianceLadderId,
  {
    label: string
    rungs: (PrivacyComplianceRungInfo & {
      sentiment: PrivacyAdversarySentiment
    })[]
  }
> = {
  privacy: {
    label: 'Privacy',
    rungs: [
      {
        rung: 1,
        label: 'Nobody can see or revoke',
        description:
          "No one can refuse a deposit, withdraw its privacy later or view it without the user's consent.",
        sentiment: 'good',
      },
      {
        rung: 2,
        label: 'Refused at entry',
        description:
          'Someone can refuse funds before they become private. Funds that got in stay private.',
        sentiment: 'good',
      },
      {
        rung: 3,
        label: 'Revoked after entry, with notice',
        description:
          'Someone can take privacy away from funds already inside, in a way the user can see.',
        sentiment: 'warning',
      },
      {
        rung: 4,
        label: 'Logged lens',
        description:
          "Someone can view users' activity without their consent, and the code records each access. Red when it reaches activity from before access was granted.",
        sentiment: 'warning',
      },
      {
        rung: 5,
        label: 'Silent lens',
        description:
          "Someone can view users' activity without their consent and without a record the user can check.",
        sentiment: 'bad',
      },
    ],
  },
  funds: {
    label: 'Funds',
    rungs: [
      {
        rung: 1,
        label: 'Nobody can stop exit',
        description: 'No one can block or hold a withdrawal.',
        sentiment: 'good',
      },
      {
        rung: 2,
        label: 'Public exit guaranteed by code',
        description:
          'Someone can block the private exit, but the code always lets the user withdraw publicly, which shows where their funds came from.',
        sentiment: 'warning',
      },
      {
        rung: 3,
        label: 'Exit depends on a party that can hold it',
        description:
          'A party on the exit path can delay or refuse a withdrawal.',
        sentiment: 'warning',
      },
      {
        rung: 4,
        label: 'Frozen',
        description: "Someone can freeze users' funds in place.",
        sentiment: 'bad',
      },
      {
        rung: 5,
        label: 'Seized',
        description: "Someone can take users' funds.",
        sentiment: 'bad',
      },
    ],
  },
}

export const PRIVACY_COMPLIANCE_LADDER_ORDER: PrivacyComplianceLadderId[] = [
  'privacy',
  'funds',
]

/** Ranked by how much a user must reveal to prove anything at all. */
export const PRIVACY_DISCLOSURE_LEVELS: PrivacyDisclosureLevelInfo[] = [
  {
    level: 1,
    label: 'One transfer',
    description: 'The user can reveal a single transfer and nothing else.',
    sentiment: 'good',
  },
  {
    level: 2,
    label: 'One link',
    description:
      'The user can reveal which deposit funded one withdrawal, and nothing else.',
    sentiment: 'good',
  },
  {
    level: 3,
    label: 'One account, bounded',
    description:
      "The user can reveal one account's activity for a limited time, or revocably.",
    sentiment: 'warning',
  },
  {
    level: 4,
    label: 'Whole history',
    description: "The user must reveal the account's whole past activity.",
    sentiment: 'bad',
  },
  {
    level: 5,
    label: 'History and future',
    description:
      "The user must reveal the account's whole past and future activity, and cannot take it back.",
    sentiment: 'bad',
  },
]

/** Each label completes "Compliance requirements it can meet:". */
export const PRIVACY_COMPLIANCE_REQUIREMENTS: Record<
  PrivacyComplianceRequirementId,
  string
> = {
  entryScreening: 'Screening at entry',
  exclusionAfterEntry: 'Exclusion after entry',
  freeze: 'Freezing funds',
  seizure: 'Seizing funds',
  authorityView: 'Viewing users without their consent',
  userProof: 'Proofs made by the user',
  identityAtEntry: 'Identity checks at entry',
  curatedList: 'Screening against a third-party list',
}

const REQUIREMENT_ORDER: PrivacyComplianceRequirementId[] = [
  'entryScreening',
  'exclusionAfterEntry',
  'freeze',
  'seizure',
  'authorityView',
  'userProof',
  'identityAtEntry',
  'curatedList',
]

/**
 * Derives each ladder's rung from its worst power and the requirements the
 * powers meet, so the headline can't contradict the powers behind it.
 */
export function definePrivacyCompliance(
  config: PrivacyComplianceConfig,
): ProjectPrivacyCompliance {
  const hasPower = (
    ladder: PrivacyComplianceLadderId,
    test: (rung: PrivacyComplianceRung) => boolean,
  ) => config.powers.some((p) => p.ladder === ladder && test(p.rung))

  const met: Record<PrivacyComplianceRequirementId, boolean> = {
    entryScreening: hasPower('privacy', (rung) => rung === 2),
    exclusionAfterEntry: hasPower('privacy', (rung) => rung === 3),
    freeze: hasPower('funds', (rung) => rung >= 4),
    seizure: hasPower('funds', (rung) => rung === 5),
    authorityView: hasPower('privacy', (rung) => rung >= 4),
    userProof: config.disclosure !== undefined,
    identityAtEntry: config.identityAtEntry === true,
    curatedList: config.curatedList === true,
  }

  return {
    description: config.description,
    ladders: PRIVACY_COMPLIANCE_LADDER_ORDER.map((id) =>
      getLadder(id, config.powers),
    ),
    disclosureLevels: PRIVACY_DISCLOSURE_LEVELS,
    disclosure: config.disclosure,
    requirements: REQUIREMENT_ORDER.map((id) => ({
      id,
      label: PRIVACY_COMPLIANCE_REQUIREMENTS[id],
      met: met[id],
    })),
  }
}

function getLadder(
  id: PrivacyComplianceLadderId,
  powers: PrivacyCompliancePower[],
): PrivacyComplianceLadder {
  const { label, rungs } = PRIVACY_COMPLIANCE_LADDERS[id]
  const onLadder = powers.filter((p) => p.ladder === id)
  if (onLadder.some((p) => p.rung === 1) && onLadder.length > 1) {
    throw new Error(`A rung 1 ${id} power says there is no other power`)
  }
  const power = onLadder.reduce<PrivacyCompliancePower | undefined>(
    (worst, p) => (worst === undefined || p.rung > worst.rung ? p : worst),
    undefined,
  )
  const rung = power?.rung ?? 1
  const info = rungs[rung - 1]
  return {
    id,
    label,
    rungs: rungs.map(({ sentiment: _, ...rest }) => rest),
    rung,
    sentiment:
      rung === 4 && id === 'privacy' && power?.reachesPastHistory
        ? 'bad'
        : info.sentiment,
    power,
  }
}

export function getPrivacyDisclosureLevel(
  level: PrivacyDisclosureLevel,
): PrivacyDisclosureLevelInfo {
  return PRIVACY_DISCLOSURE_LEVELS[level - 1]
}
