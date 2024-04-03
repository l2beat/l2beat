import { z } from 'zod'

export const FeaturesApiResponse = z.record(z.string(), z.boolean())

export type FeaturesApiResponse = z.infer<typeof FeaturesApiResponse>
