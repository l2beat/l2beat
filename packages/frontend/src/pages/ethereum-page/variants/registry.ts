/**
 * The page's design variants, shown side by side until one is picked. Picking
 * one means deleting the others and this registry.
 */
export const VARIANTS = [
  {
    id: 'pulse',
    name: 'Pulse',
    pitch:
      'One heartbeat, for everyone: a giant live block hero, few numbers, big type',
  },
  {
    id: 'console',
    name: 'Console',
    pitch:
      'Mission control for researchers: every live signal above the fold, dense panels',
  },
  {
    id: 'chain',
    name: 'Chain',
    pitch:
      'The page is a block timeline: scrub any recent slot and every number follows it',
  },
  {
    id: 'story',
    name: 'Story',
    pitch:
      'Editorial: each section is a claim, written in sentences with live numbers inside',
  },
  {
    id: 'orbit',
    name: 'Orbit',
    pitch:
      'Who relies on it first: Ethereum at the centre, the systems on it lighting up live',
  },
] as const

export type VariantId = (typeof VARIANTS)[number]['id']

export const DEFAULT_VARIANT: VariantId = 'pulse'

export function toVariantId(value: unknown): VariantId {
  return VARIANTS.find((v) => v.id === value)?.id ?? DEFAULT_VARIANT
}
