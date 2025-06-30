import { v } from '@l2beat/validate'

export const LogoGeneratorProject = v.object({
  name: v.string(),
  type: v.enum(['bridge', 'layer2', 'layer3']),
  slug: v.string(),
  isUpcoming: v.boolean().optional(),
  isArchived: v.boolean().optional(),
})

export type LogoGeneratorProject = v.infer<typeof LogoGeneratorProject>
