import { formatInteger } from '@l2beat/shared-pure'
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
          // A setup with no participants to count still needs a word under
          // its dot: without one the two icon variants are unlabelled anywhere
          // on the page.
          label={
            trustedSetup.participantCount === undefined
              ? trustedSetup.name
              : `${formatInteger(trustedSetup.participantCount)} participants`
          }
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
