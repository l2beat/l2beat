import { Checkbox } from '~/components/core/Checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { InfoIcon } from '~/icons/Info'
import { useScalingRwaRestrictedTokensContext } from './ScalingRwaRestrictedTokensContext'

export function ExcludeRwaRestrictedTokensCheckbox() {
  const { excludeRwaRestrictedTokens, setExcludeRwaRestrictedTokens } =
    useScalingRwaRestrictedTokensContext()

  return (
    <Tooltip>
      <Checkbox
        name="excludeRwaRestrictedTokens"
        checked={excludeRwaRestrictedTokens}
        onCheckedChange={(checked) => setExcludeRwaRestrictedTokens(!!checked)}
      >
        <div className="flex items-center gap-1">
          <div>Exclude restricted RWA tokens</div>
          <TooltipTrigger asChild>
            <div className="flex size-4 items-center justify-center">
              <InfoIcon className="size-3.5" />
            </div>
          </TooltipTrigger>
        </div>
      </Checkbox>
      <TooltipContent>
        Centralized RWAs with access or transfer restrictions, whitelists, no
        onchain liquidity or integration, hardcoded prices or very low activity.
      </TooltipContent>
    </Tooltip>
  )
}
