import type { TrustedSetup } from '@l2beat/config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import { formatInteger } from '~/utils/number-format/formatInteger'

export function PrivacyTrustedSetupCell({
  trustedSetup,
}: {
  trustedSetup: TrustedSetup
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        className="inline-flex flex-col items-center justify-center gap-1"
        aria-label={trustedSetup.name}
      >
        <TrustedSetupRiskDot
          risk={trustedSetup.risk}
          size="sm"
          className="shrink-0"
        />
        {trustedSetup.participantCount !== undefined && (
          <span className="text-[11px] text-secondary leading-none">
            {formatInteger(trustedSetup.participantCount)} participants
          </span>
        )}
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
