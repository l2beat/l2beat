import type {
  PrivacyBucketAddress,
  PrivacyKeyRegistrationAnonymitySet,
} from '@l2beat/config'
import { createPrivacyAnonymitySetConfigurationId } from '@l2beat/shared'
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import type { PrivacyProject } from '../types'
import { ANONYMITY_SET_WINDOW_DAYS } from './calculateAnonymitySets'

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
  bucketType: 'pool' | 'denomination' | 'registration'
  label: string
  token: string
  formattedAmount: string
  minimumAmount: string
  sinceTimestamp: number
}

export function getPrivacyAnonymitySetSeries(
  project: PrivacyAnonymitySetProject,
): PrivacyAnonymitySetSeries[] {
  const tokenSeries = project.privacyInfo.tokens.flatMap((token) =>
    token.buckets.flatMap((bucket) => {
      if (bucket.anonymitySet === undefined) return []

      const minimumAmounts = bucket.anonymitySet.minimumAmounts
      const { chain, address } = getBucketChainAndAddress(bucket.address)
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
          bucketType: bucket.type,
          label:
            bucket.type === 'denomination'
              ? `${formattedAmount} ${token.token.symbol}`
              : `≥${formattedAmount} ${token.token.symbol}`,
          token: token.token.symbol,
          formattedAmount,
          minimumAmount,
          sinceTimestamp: bucket.sinceTimestamp,
        }
      })
    }),
  )
  if (tokenSeries.length > 0) return tokenSeries

  // Projects without token anonymity sets can measure key registrations.
  const anonymitySet = project.privacyInfo.anonymitySet
  return anonymitySet?.type === 'keyRegistrations'
    ? [getKeyRegistrationSeries(project.id, anonymitySet)]
    : []
}

/**
 * Every registrant counts, so the series has a single zero threshold and no
 * token. Must match the configuration id of PrivacyKeyRegistrationIndexer.
 */
function getKeyRegistrationSeries(
  projectId: string,
  anonymitySet: PrivacyKeyRegistrationAnonymitySet,
): PrivacyAnonymitySetSeries {
  const chain = ChainSpecificAddress.longChain(anonymitySet.address)
  const configurationId = createPrivacyAnonymitySetConfigurationId({
    projectId,
    bucketId: anonymitySet.id,
    chain,
    address: ChainSpecificAddress.address(anonymitySet.address).toString(),
    event: anonymitySet.event,
    extractor: 'stealthKeyRegistration',
    params: {},
  })

  return {
    id: `${anonymitySet.id}:0`,
    configurationId,
    projectId,
    bucketId: anonymitySet.id,
    chain,
    bucketType: 'registration',
    label: anonymitySet.label,
    token: '',
    formattedAmount: '0',
    minimumAmount: '0',
    // Collection may start after the registry deployment, so the first full
    // window ends one window after it.
    sinceTimestamp:
      anonymitySet.sinceTimestamp + ANONYMITY_SET_WINDOW_DAYS * UnixTime.DAY,
  }
}

export function hasPrivacyAnonymitySet(
  project: PrivacyAnonymitySetProject,
): boolean {
  return getPrivacyAnonymitySetSeries(project).length > 0
}

function getBucketChainAndAddress(address: PrivacyBucketAddress): {
  chain: string
  address: string
} {
  if (typeof address !== 'string') return address
  return {
    chain: ChainSpecificAddress.longChain(address),
    address: ChainSpecificAddress.address(address).toString(),
  }
}

function formatTokenAmount(amount: string, decimals: number): string {
  const padded = amount.padStart(decimals + 1, '0')
  const whole = decimals === 0 ? padded : padded.slice(0, -decimals) || '0'
  const fraction = decimals === 0 ? '' : padded.slice(-decimals)
  const trimmedFraction = fraction.replace(/0+$/, '')

  return trimmedFraction.length > 0 ? `${whole}.${trimmedFraction}` : whole
}
