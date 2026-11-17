/**
 * One colour per Layer 2 category, on every chart and stat that splits by
 * them. Rollups take the brand pink; the other two stay quieter beside it.
 */
export const L2_CATEGORY_COLORS = {
  rollups: 'var(--chart-pink)',
  validiumsAndOptimiums: 'var(--chart-violet)',
  others: 'var(--chart-slate)',
} as const
