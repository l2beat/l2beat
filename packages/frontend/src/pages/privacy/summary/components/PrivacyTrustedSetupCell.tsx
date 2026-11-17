import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import type { PrivacyTrustedSetup } from '~/server/features/privacy/utils/getPrivacyTrustedSetup'
import { DotWithLabel } from './DotWithLabel'

export function PrivacyTrustedSetupCell({
  trustedSetup,
}: {
  trustedSetup: PrivacyTrustedSetup
}) {
  return (
    <Tooltip>
      <TooltipTrigger aria-label={trustedSetup.name}>
        <DotWithLabel
          dot={
            <TrustedSetupRiskDot
              risk={trustedSetup.risk}
              size="sm"
              className="shrink-0"
            />
          }
          label={trustedSetup.label}
        />
      </TooltipTrigger>
      <TooltipContent className="max-w-[320px]">
        <div className="space-y-2">
          <div className="font-medium text-label-value-14">
            {trustedSetup.name}
          </div>
          <p>{trustedSetup.shortDescription}</p>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
