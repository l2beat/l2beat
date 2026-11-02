// Kept apart from getActivityChangeEvents so the client can import them
// without pulling in server code.
export const ACTIVITY_CHANGE_CATEGORIES = [
  'rollups',
  'validiumsAndOptimiums',
  'others',
] as const

export const BASELINE_DAYS = 28
