import type { PrivacyAnonymitySetSummary } from '~/server/features/privacy/anonymity-set/getPrivacyAnonymitySetSummaries'

type AvailableAnonymitySetSummary = Extract<
  PrivacyAnonymitySetSummary,
  { status: 'available' }
>

export function getAnonymitySetSyncingNote(
  anonymitySet: AvailableAnonymitySetSummary,
): string | undefined {
  if (anonymitySet.syncingLabels.length === 0) return undefined

  return `The displayed value excludes series still being indexed: ${anonymitySet.syncingLabels.join(', ')}.`
}
