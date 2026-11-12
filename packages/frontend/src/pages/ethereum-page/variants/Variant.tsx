import { ChainVariant } from './chain/ChainVariant'
import { ConsoleVariant } from './console/ConsoleVariant'
import { OrbitVariant } from './orbit/OrbitVariant'
import { PulseVariant } from './pulse/PulseVariant'
import type { VariantId } from './registry'
import { StoryVariant } from './story/StoryVariant'
import type { VariantProps } from './types'

const COMPONENTS: Record<VariantId, (props: VariantProps) => React.ReactNode> =
  {
    pulse: PulseVariant,
    console: ConsoleVariant,
    chain: ChainVariant,
    story: StoryVariant,
    orbit: OrbitVariant,
  }

export function Variant({ id, ...props }: VariantProps & { id: VariantId }) {
  const Component = COMPONENTS[id]
  return <Component {...props} />
}
