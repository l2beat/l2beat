import { z } from 'zod'

export type TopBarVariantData = z.infer<typeof TopBarVariantData>
export const TopBarVariantData = z.object({
  variant: z.union([z.literal('gitcoin'), z.literal('l2warsaw')]),
  lastBannerChangeTime: z.number(),
})
