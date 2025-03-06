import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/tooltip'
import type { RosetteValue } from '../types'
import { GrissiniDetails } from './grissini-details'
import { GrissiniIcon } from './grissini-icon'
import { InlinedNoBridgeGrissiniDetailsPlaceholder } from './no-bridge-grissini-details-placeholder'

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
          <GrissiniDetails values={daLayerRisks} size="small" />
        </div>
        <div>
          <p className="mb-1 font-medium text-secondary">DA BRIDGE RISKS</p>
          {hasNoBridge ? (
            <InlinedNoBridgeGrissiniDetailsPlaceholder
              contentClassName="md:items-start"
              size="small"
            />
          ) : (
            <GrissiniDetails values={daBridgeRisks} size="small" />
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
