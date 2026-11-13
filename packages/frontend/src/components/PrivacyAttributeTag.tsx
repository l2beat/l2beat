import type { PrivacyAttribute } from '@l2beat/config'
import { PRIVACY_CHIP_CLASS_NAME } from '~/pages/privacy/adversaries/privacyAdversaryUi'
import { Tooltip, TooltipContent, TooltipTrigger } from './core/tooltip/Tooltip'

export function PrivacyAttributeTag({
  attribute,
}: {
  attribute: PrivacyAttribute
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={PRIVACY_CHIP_CLASS_NAME}>{attribute.label}</span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{attribute.description}</p>
      </TooltipContent>
    </Tooltip>
  )
}
