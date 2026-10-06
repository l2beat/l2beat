import {
  createPrivacyAnonymitySetConfigurationId,
  createPrivacyNoteConfigurationId,
} from '@l2beat/shared'
import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import type { PrivacyProject } from '../types'

export type PrivacyAnonymitySetProject = Pick<
  PrivacyProject,
  'id' | 'privacyInfo'
>

/** What one member of the anonymity set is: a funding address or an active note. */
export type PrivacyAnonymitySetUnit = 'depositor' | 'note'

export interface PrivacyAnonymitySetSeries {
  id: string
  configurationId: string
  projectId: string
  bucketId: string
  chain: string
  bucketType: 'pool' | 'denomination'
  label: string
  token: string
  formattedAmount: string
  minimumAmount: string
  sinceTimestamp: number
  unit: PrivacyAnonymitySetUnit
}

export function getPrivacyAnonymitySetSeries(
  project: PrivacyAnonymitySetProject,
): PrivacyAnonymitySetSeries[] {
  return project.privacyInfo.tokens.flatMap((token) =>
    token.buckets.flatMap((bucket) => {
      if (bucket.anonymitySet === undefined) return []

      const minimumAmounts = bucket.anonymitySet.minimumAmounts
      const unit = bucket.anonymitySet.unit ?? 'depositor'
      const chain = ChainSpecificAddress.longChain(bucket.address)
      const address = ChainSpecificAddress.address(bucket.address).toString()
      const configurationId =
        bucket.anonymitySet.unit === 'note'
          ? createPrivacyNoteConfigurationId({
              projectId: project.id,
              bucketId: bucket.id,
              chain,
              address,
              extractor: bucket.anonymitySet.notes.extractor,
              params: bucket.anonymitySet.notes.params,
            })
          : createPrivacyAnonymitySetConfigurationId({
              projectId: project.id,
              bucketId: bucket.id,
              chain,
              address,
              event: bucket.deposit.event,
              extractor: bucket.deposit.extractor,
              params: bucket.deposit.params,
            })

      return minimumAmounts.map((minimumAmount) => {
        const formattedAmount = formatTokenAmount(
          minimumAmount,
          token.token.decimals,
        )

        return {
          id: `${bucket.id}:${minimumAmount}`,
          configurationId,
          projectId: project.id,
          bucketId: bucket.id,
          chain,
          bucketType: bucket.type,
          label:
            bucket.type === 'denomination'
              ? `${formattedAmount} ${token.token.symbol}`
              : `≥${formattedAmount} ${token.token.symbol}`,
          token: token.token.symbol,
          formattedAmount,
          minimumAmount,
          sinceTimestamp: bucket.sinceTimestamp,
          unit,
        }
      })
    }),
  )
}

/**
 * The page copy and charts describe a single metric per project, so a project
 * whose series count different things would be explained wrongly.
 */
export function getPrivacyAnonymitySetUnit(
  series: PrivacyAnonymitySetSeries[],
): PrivacyAnonymitySetUnit | undefined {
  const unit = series[0]?.unit
  assert(
    series.every((item) => item.unit === unit),
    'Anonymity set series of one project must share a unit',
  )
  return unit
}

function formatTokenAmount(amount: string, decimals: number): string {
  const padded = amount.padStart(decimals + 1, '0')
  const whole = decimals === 0 ? padded : padded.slice(0, -decimals) || '0'
  const fraction = decimals === 0 ? '' : padded.slice(-decimals)
  const trimmedFraction = fraction.replace(/0+$/, '')

  return trimmedFraction.length > 0 ? `${whole}.${trimmedFraction}` : whole
}
