import type { TrustedSetup, ZkCatalogTag } from '@l2beat/config'
import type { ComponentProps } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { TechStackTag } from './TechStackTag'
import { TrustedSetupRiskDot } from './TrustedSetupRiskDot'

interface Props {
  trustedSetups: (TrustedSetup & {
    proofSystem: ZkCatalogTag
  })[]
  dotSize?: ComponentProps<typeof TrustedSetupRiskDot>['size']
}

export function TrustedSetupCell({ trustedSetups, dotSize }: Props) {
  const proofSystem = trustedSetups[0]?.proofSystem
  if (trustedSetups.length === 0 || !proofSystem) return null

  const worstRisk = pickWorstRisk(trustedSetups)

  return (
    <Tooltip>
      <TooltipTrigger className="flex items-center gap-2">
        {worstRisk === 'N/A' ? (
          <span className="text-2xl leading-none">🤩</span>
        ) : (
          <TrustedSetupRiskDot risk={worstRisk} size={dotSize} />
        )}
        <TechStackTag tag={proofSystem} withoutTooltip />
      </TooltipTrigger>
      <TooltipContent>
        <div className="mb-3 text-paragraph-14">
          Trusted setups for{' '}
          <TechStackTag
            tag={proofSystem}
            className="inline-block"
            withoutTooltip
          />
        </div>
        {trustedSetups.map((trustedSetup) => {
          return (
            <div key={trustedSetup.id} className="flex gap-2">
              {trustedSetup.risk === 'N/A' ? (
                <div className="mt-px text-lg leading-none">🤩</div>
              ) : (
                <TrustedSetupRiskDot
                  risk={trustedSetup.risk}
                  size="sm"
                  className="shrink-0"
                />
              )}
              <span className="text-xs leading-normal">
                {trustedSetup.shortDescription}
              </span>
            </div>
          )
        })}
      </TooltipContent>
    </Tooltip>
  )
}

function pickWorstRisk(trustedSetups: TrustedSetup[]): TrustedSetup['risk'] {
  const riskHierarchy = ['red', 'yellow', 'green', 'N/A'] as const

  for (const risk of riskHierarchy) {
    if (trustedSetups.some((ts) => ts.risk === risk)) {
      return risk
    }
  }
  return 'N/A'
}
