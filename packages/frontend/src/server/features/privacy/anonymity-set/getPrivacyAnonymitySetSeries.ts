import { createPrivacyAnonymitySetConfigurationId } from '@l2beat/shared'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { PrivacyProject } from '../types'

export type PrivacyAnonymitySetProject = Pick<
  PrivacyProject,
  'id' | 'privacyInfo'
>

export interface PrivacyAnonymitySetSeries {
  id: string
  configurationId: string
  projectId: string
  bucketId: string
  chain: string
  label: string
  token: string
  minimumAmount: string
  sinceTimestamp: number
}

export function getPrivacyAnonymitySetSeries(
  project: PrivacyAnonymitySetProject,
): PrivacyAnonymitySetSeries[] {
  return project.privacyInfo.tokens.flatMap((token) =>
    token.buckets.flatMap((bucket) => {
      if (bucket.anonymitySet === undefined) return []

      const minimumAmounts = bucket.anonymitySet.minimumAmounts
      const chain = ChainSpecificAddress.longChain(bucket.address)
      const address = ChainSpecificAddress.address(bucket.address).toString()
      const configurationId = createPrivacyAnonymitySetConfigurationId({
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
          label:
            bucket.type === 'denomination'
              ? `${formattedAmount} ${token.token.symbol}`
              : `≥${formattedAmount} ${token.token.symbol}`,
          token: token.token.symbol,
          minimumAmount,
          sinceTimestamp: bucket.sinceTimestamp,
        }
      })
    }),
  )
}

function formatTokenAmount(amount: string, decimals: number): string {
  const padded = amount.padStart(decimals + 1, '0')
  const whole = padded.slice(0, -decimals) || '0'
  const fraction = decimals === 0 ? '' : padded.slice(-decimals)
  const trimmedFraction = fraction.replace(/0+$/, '')

  return trimmedFraction.length > 0 ? `${whole}.${trimmedFraction}` : whole
}
