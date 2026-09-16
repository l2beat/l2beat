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
  const content = (
    <DotWithLabel
      dot={
        <TrustedSetupRiskDot
          risk={trustedSetup.risk}
          size="sm"
          className="shrink-0"
        />
      }
      label={
        trustedSetup.participantCount === undefined
          ? undefined
          : `${formatInteger(trustedSetup.participantCount)} participants`
      }
    />
  )
  return (
    <Tooltip>
      {trustedSetup.href === undefined ? (
        <TooltipTrigger aria-label={trustedSetup.name}>
          {content}
        </TooltipTrigger>
      ) : (
        <TooltipTrigger asChild>
          <a href={trustedSetup.href} aria-label={trustedSetup.name}>
            {content}
          </a>
        </TooltipTrigger>
      )}
      <TooltipContent className="max-w-[320px]">
        <div className="space-y-2">
          <div className="font-medium text-sm">{trustedSetup.name}</div>
          <p className="text-xs leading-normal">
            {trustedSetup.shortDescription}
          </p>
          {trustedSetup.href !== undefined && (
            <p className="text-secondary text-xs leading-normal">
              Click to open the ZK Catalog entry.
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
