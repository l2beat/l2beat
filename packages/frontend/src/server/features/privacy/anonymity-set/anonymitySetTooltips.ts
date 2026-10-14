import { ANONYMITY_SET_WINDOW_DAYS } from './calculateAnonymitySets'
import type { PrivacyAnonymitySetType } from './getPrivacyAnonymitySetSeries'

/** The summary table's anonymity set column header, by what the set counts. */
export const ANONYMITY_SET_TOOLTIPS: Record<PrivacyAnonymitySetType, string> = {
  deposits: `Unique depositors over the last ${ANONYMITY_SET_WINDOW_DAYS} complete UTC days, in the largest tracked pool.`,
  'key-registrations': `Unique addresses that registered stealth keys in the last ${ANONYMITY_SET_WINDOW_DAYS} complete UTC days.`,
}
