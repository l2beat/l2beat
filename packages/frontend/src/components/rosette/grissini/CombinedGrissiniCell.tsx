import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { RosetteValue } from '../types'
import { GrissiniDetails } from './GrissiniDetails'
import { GrissiniIcon } from './GrissiniIcon'
import { NoBridgeGrissiniDetailsPlaceholder } from './NoBridgeGrissiniDetailsPlaceholder'

interface Props {
  daLayerRisks: RosetteValue[]
  daBridgeRisks: RosetteValue[]
}

export function CombinedGrissiniCell({ daLayerRisks, daBridgeRisks }: Props) {
  const hasNoBridge = daBridgeRisks.length === 0
  return (
    <Tooltip>
      <TooltipTrigger className="flex size-full items-center justify-center gap-2">
        <GrissiniIcon values={daLayerRisks} />
        <GrissiniIcon values={daBridgeRisks} />
      </TooltipTrigger>
      <TooltipContent className="space-y-4">
        <p className="font-bold">DA Risks</p>
        <div>
          <p className="mb-1 font-medium text-secondary">DA LAYER RISKS</p>
          <GrissiniDetails values={daLayerRisks} info="compact" />
        </div>
        <div>
          <p className="mb-1 font-medium text-secondary">DA BRIDGE RISKS</p>
          {hasNoBridge ? (
            <NoBridgeGrissiniDetailsPlaceholder />
          ) : (
            <GrissiniDetails values={daBridgeRisks} info="compact" />
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
