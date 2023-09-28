import { z } from 'zod'

export type TopBarVariantData = z.infer<typeof TopBarVariantData>
export const TopBarVariantData = z.object({
  variant: z.union([z.literal('gitcoin'), z.literal('l2warsaw')]),
  lastBannerChangeTime: z.number(),
})

export type SavedChartSettings = z.infer<typeof SavedChartSettings>
export const SavedChartSettings = z.object({
  useLogScale: z.boolean(),
  useAltCurrency: z.boolean(),
  timeRange: z.enum(['7D', '30D', '90D', '180D', '1Y', 'MAX']),
  showEthereumTransactions: z.boolean(),
})

export type SavedChartState = z.infer<typeof SavedChartState>
export const SavedChartState = z.record(
  z.string(),
  // TODO: noUncheckedIndexedAccess solves this
  SavedChartSettings.optional(),
)
