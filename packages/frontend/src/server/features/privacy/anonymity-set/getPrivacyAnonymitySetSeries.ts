import type { ProjectPrivacyInfo } from '@l2beat/config'
import {
  createPrivacyAnonymitySetConfigurationId,
  getPrivacyAnonymitySetSources,
  type PrivacyAnonymitySetSource,
} from '@l2beat/shared'
import { formatNumber } from '@l2beat/shared-pure'
import type { PrivacyProject } from '../types'
import { ANONYMITY_SET_TOOLTIPS } from './anonymitySetTooltips'
import { ANONYMITY_SET_WINDOW_DAYS } from './calculateAnonymitySets'

export type PrivacyAnonymitySetProject = Pick<
  PrivacyProject,
  'id' | 'name' | 'privacyInfo'
>

export type PrivacyAnonymitySetType = 'deposits' | 'key-registrations'

export interface PrivacyAnonymitySetSeries {
  id: string
  configurationId: string
  projectId: string
  bucketId: string
  label: string
  /** Lists the series while its history is still being indexed. */
  compactLabel: string
  /** Shown under the value in the summary table. Key registrations rely on the tooltip instead. */
  headlineLabel?: string
  /** What the value counts, for the summary table tooltip. */
  description: string
  /** How to mix with this set, for the summary table tooltip. */
  steps: string[]
  minimumAmount: string
  sinceTimestamp: number
}

type SeriesBase = Pick<
  PrivacyAnonymitySetSeries,
  'configurationId' | 'projectId' | 'bucketId' | 'sinceTimestamp'
>

type DepositSource = Extract<
  PrivacyAnonymitySetSource<ProjectPrivacyInfo>,
  { type: 'deposits' }
>

const WAIT_STEP = `Wait for a randomized duration of time up to ${ANONYMITY_SET_WINDOW_DAYS} days. Do not rely on human judgement to pick a random number.`

export function getPrivacyAnonymitySetSeries(
  project: PrivacyAnonymitySetProject,
): PrivacyAnonymitySetSeries[] {
  return getPrivacyAnonymitySetSources(project.privacyInfo).flatMap(
    (anonymitySet) => {
      const { bucketId, chain, address, sinceTimestamp, source } = anonymitySet
      const base: SeriesBase = {
        configurationId: createPrivacyAnonymitySetConfigurationId({
          projectId: project.id,
          bucketId,
          chain,
          address,
          ...source,
        }),
        projectId: project.id,
        bucketId,
        sinceTimestamp,
      }

      return anonymitySet.type === 'key-registrations'
        ? [getKeyRegistrationsSeries(base, project.name)]
        : getDepositSeries(base, anonymitySet, project.name)
    },
  )
}

/** Key registrations replace bucket sets; the config tests reject a project with both. */
export function getPrivacyAnonymitySetType(
  project: Pick<PrivacyAnonymitySetProject, 'privacyInfo'>,
): PrivacyAnonymitySetType | undefined {
  if (project.privacyInfo.anonymitySet?.type === 'key-registrations') {
    return 'key-registrations'
  }
  return getPrivacyAnonymitySetSources(project.privacyInfo).length > 0
    ? 'deposits'
    : undefined
}

function getKeyRegistrationsSeries(
  base: SeriesBase,
  projectName: string,
): PrivacyAnonymitySetSeries {
  const label = 'Registered recipients'
  return {
    ...base,
    id: base.bucketId,
    label,
    compactLabel: label,
    // A recipient table shows only key registrations, so the cell repeats its header.
    description: ANONYMITY_SET_TOOLTIPS.keyRegistrations,
    steps: [
      `Register keys for ${projectName} onchain.`,
      WAIT_STEP,
      'Receive a stealth address transfer.',
    ],
    // Registrations carry amount 0, so this counts every registrant.
    minimumAmount: '0',
  }
}

function getDepositSeries(
  base: SeriesBase,
  { chain, token, bucket }: DepositSource,
  projectName: string,
): PrivacyAnonymitySetSeries[] {
  const { symbol, decimals } = token.token
  const chainName = chain.charAt(0).toUpperCase() + chain.slice(1)

  return bucket.anonymitySet.minimumAmounts.map((minimumAmount) => {
    const amount = formatTokenAmount(minimumAmount, decimals)
    const compactAmount = formatCompactAmount(amount)
    const id = `${base.bucketId}:${minimumAmount}`

    if (bucket.type === 'denomination') {
      const label = `${amount} ${symbol}`
      return {
        ...base,
        id,
        label,
        compactLabel: `${compactAmount} ${symbol}`,
        headlineLabel: label,
        description: `Number of unique depositors in the ${label} bucket during the last ${ANONYMITY_SET_WINDOW_DAYS} complete UTC days.`,
        steps: [
          `Deposit into the ${label} ${projectName} pool on ${chainName}.`,
          WAIT_STEP,
          'Withdraw to an unlinkable address.',
        ],
        minimumAmount,
      }
    }

    const label = `≥${amount} ${symbol}`
    return {
      ...base,
      id,
      label,
      compactLabel: `≥${compactAmount} ${symbol}`,
      headlineLabel: label,
      description: `Number of unique depositors who deposited at least ${amount} ${symbol} during the last ${ANONYMITY_SET_WINDOW_DAYS} complete UTC days.`,
      steps: [
        `Deposit into ${projectName} on ${chainName}.`,
        WAIT_STEP,
        `Withdraw at most ${amount} ${symbol} to an unlinkable address, and not exactly your deposit amount.`,
      ],
      minimumAmount,
    }
  })
}

function formatTokenAmount(amount: string, decimals: number): string {
  const padded = amount.padStart(decimals + 1, '0')
  const whole = decimals === 0 ? padded : padded.slice(0, -decimals) || '0'
  const fraction = decimals === 0 ? '' : padded.slice(-decimals)
  const trimmedFraction = fraction.replace(/0+$/, '')

  return trimmedFraction.length > 0 ? `${whole}.${trimmedFraction}` : whole
}

function formatCompactAmount(amount: string): string {
  const value = Number(amount)
  return Number.isFinite(value) && value >= 1_000
    ? formatNumber(value).replace(/\.?0+(?= )/, '')
    : amount
}
