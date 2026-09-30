import { ANONYMITY_SET_WINDOW_DAYS } from '~/server/features/privacy/anonymity-set/calculateAnonymitySets'
import type { PrivacyAnonymitySetSummary } from '~/server/features/privacy/anonymity-set/getPrivacyAnonymitySetSummaries'

type AvailableAnonymitySetSummary = Extract<
  PrivacyAnonymitySetSummary,
  { status: 'available' }
>

export function getAnonymitySetDescription(
  anonymitySet: AvailableAnonymitySetSummary,
): string {
  if (anonymitySet.bucketType === 'denomination') {
    return `Number of unique depositors in the ${anonymitySet.formattedAmount} ${anonymitySet.token} bucket during the last ${ANONYMITY_SET_WINDOW_DAYS} complete UTC days.`
  }

  return `Number of unique depositors who deposited at least ${anonymitySet.formattedAmount} ${anonymitySet.token} during the last ${ANONYMITY_SET_WINDOW_DAYS} complete UTC days.`
}

export function getAnonymitySetSyncingNote(
  anonymitySet: AvailableAnonymitySetSummary,
): string | undefined {
  if (anonymitySet.syncingLabels.length === 0) return undefined

  return `The displayed value excludes series still being indexed: ${anonymitySet.syncingLabels.join(', ')}.`
}

export function getAnonymitySetSteps(
  anonymitySet: AvailableAnonymitySetSummary,
  projectName: string,
): string[] {
  const chain = formatChainName(anonymitySet.chain)
  const firstStep =
    anonymitySet.bucketType === 'denomination'
      ? `Deposit into the ${anonymitySet.formattedAmount} ${anonymitySet.token} ${projectName} pool on ${chain}.`
      : `Deposit at most ${anonymitySet.formattedAmount} ${anonymitySet.token} into ${projectName} on ${chain}.`
  const finalStep =
    anonymitySet.bucketType === 'denomination'
      ? 'Withdraw to an unlinkable address.'
      : 'Withdraw to an unlinkable address. Make sure the withdrawal amount is not equal to the deposit amount, leaving a small amount still deposited.'

  return [
    firstStep,
    `Wait for a randomized duration of time up to ${ANONYMITY_SET_WINDOW_DAYS} days. Do not rely on human judgement to pick a random number.`,
    finalStep,
  ]
}

function formatChainName(chain: string): string {
  return chain.charAt(0).toUpperCase() + chain.slice(1)
}
