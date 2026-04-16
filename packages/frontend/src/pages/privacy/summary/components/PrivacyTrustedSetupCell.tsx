import type { TrustedSetup } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'

export function PrivacyTrustedSetupCell({
  trustedSetup,
}: {
  trustedSetup: TrustedSetup
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        className="inline-flex items-center justify-center"
        aria-label={trustedSetup.name}
      >
        <TrustedSetupRiskDot
          risk={trustedSetup.risk}
          size="sm"
          className="shrink-0"
        />
      </TooltipTrigger>
      <TooltipContent className="max-w-[320px]">
        <div className="space-y-2">
          <div className="font-medium text-sm">{trustedSetup.name}</div>
          <p className="text-xs leading-normal">
            {trustedSetup.shortDescription}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
