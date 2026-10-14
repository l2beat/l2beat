import { ANONYMITY_SET_WINDOW_DAYS } from './calculateAnonymitySets'

/** The summary table's anonymity set column header, by what the set counts. */
export const ANONYMITY_SET_TOOLTIPS = {
  deposits: `Unique depositors over the last ${ANONYMITY_SET_WINDOW_DAYS} complete UTC days, in the largest tracked pool.`,
  keyRegistrations: `Unique stealth key registrations in the last ${ANONYMITY_SET_WINDOW_DAYS} complete UTC days.`,
}
