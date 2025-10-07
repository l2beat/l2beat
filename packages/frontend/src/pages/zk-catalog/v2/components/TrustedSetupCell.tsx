import type { TrustedSetup, ZkCatalogTag } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import type { ComponentProps } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import {
  ProjectsUsedIn,
  type UsedInProjectWithIcon,
} from '~/components/ProjectsUsedIn'
import { TechStackTag } from './TechStackTag'
import { TrustedSetupRiskDot } from './TrustedSetupRiskDot'

interface Props {
  trustedSetups: (TrustedSetup & {
    proofSystem: ZkCatalogTag
  })[]
  projectsUsedIn?: UsedInProjectWithIcon[]
  dotSize?: ComponentProps<typeof TrustedSetupRiskDot>['size']
}

export function TrustedSetupCell({
  trustedSetups,
  projectsUsedIn,
  dotSize,
}: Props) {
  const proofSystem = trustedSetups[0]?.proofSystem
  if (trustedSetups.length === 0 || !proofSystem) return null

  return (
    <div className="flex flex-col items-start gap-2">
      <TrustedSetupCellTooltip
        trustedSetups={trustedSetups}
        dotSize={dotSize}
      />
      {projectsUsedIn && (
        <div className="flex items-center gap-1.5">
          <p className="font-medium text-label-value-12 text-secondary">
            Used in
          </p>
          <ProjectsUsedIn
            noL2ClassName="text-label-value-12 font-medium text-secondary"
            usedIn={projectsUsedIn}
          />
        </div>
      )}
    </div>
  )
}

export function TrustedSetupCellTooltip({
  trustedSetups,
  dotSize,
}: {
  trustedSetups: (TrustedSetup & {
    proofSystem: ZkCatalogTag
  })[]
  dotSize?: ComponentProps<typeof TrustedSetupRiskDot>['size']
}) {
  const proofSystem = trustedSetups[0]?.proofSystem
  assert(proofSystem, 'proofSystem is required')
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
