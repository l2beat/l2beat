// Kept apart from changeEvents so the client can import them without pulling
// in server code.
export const CHANGE_CATEGORIES = [
  'rollups',
  'validiumsAndOptimiums',
  'others',
] as const

export type ChangeCategory = (typeof CHANGE_CATEGORIES)[number]

/** How many past days a change is compared with. */
export const BASELINE_DAYS = 28
