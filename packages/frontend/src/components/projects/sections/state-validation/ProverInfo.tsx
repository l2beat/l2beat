import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { QUANTUM_RESISTANCE_TOOLTIP } from '~/components/projects/ProjectTooltipContent'
import { QuantumResistanceIcon } from '~/icons/QuantumResistance'
import { TrustedSetupsByProofSystemSection } from '~/pages/zk-catalog/v2/project/components/header/ZkCatalogProjectSummary'
import type { StateValidationSectionProps } from './StateValidationSection'

export function ProverInfo({
  proverInfo,
}: {
  proverInfo: NonNullable<StateValidationSectionProps['proverInfo']>
}) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-2 rounded-lg border border-divider p-6 [@media(min-width:1000px)]:grid-cols-[180px_1fr] [@media(min-width:1200px)]:grid-cols-1 [@media(min-width:1360px)]:grid-cols-[180px_1fr]">
      <div className="space-y-2">
        <div className="font-semibold text-subtitle-12">PROVER</div>
        <div className="flex items-center gap-3">
          <img
            src={proverInfo.icon}
            alt={proverInfo.name}
            className="size-6 rounded-xs"
          />
          <div className="flex items-center gap-2">
            <a
              href={proverInfo.href}
              className="font-bold text-label-value-18 text-link underline"
            >
              {proverInfo.name}
            </a>
            {proverInfo.quantumResistant && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" aria-label="Quantum resistance details">
                    <QuantumResistanceIcon className="size-5" />
                  </button>
                </TooltipTrigger>
                <TooltipPortal>
                  <TooltipContent>{QUANTUM_RESISTANCE_TOOLTIP}</TooltipContent>
                </TooltipPortal>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
      <TrustedSetupsByProofSystemSection
        trustedSetupsByProofSystem={proverInfo.trustedSetups}
        variant="scaling"
      />
    </div>
  )
}
