import { z } from 'zod'

export const LogoGeneratorProject = z.object({
  name: z.string(),
  type: z.enum(['bridge', 'layer2', 'layer3']),
  slug: z.string(),
  isUpcoming: z.boolean().optional(),
  isArchived: z.boolean().optional(),
})

export type LogoGeneratorProject = z.infer<typeof LogoGeneratorProject>
