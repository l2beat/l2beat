import { Checkbox } from '~/components/core/Checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { InfoIcon } from '~/icons/Info'
import { useScalingRwaRestrictedTokensContext } from './ScalingRwaRestrictedTokensContext'

export function IncludeRwaRestrictedTokensCheckbox() {
  const { includeRwaRestrictedTokens, setIncludeRwaRestrictedTokens } =
    useScalingRwaRestrictedTokensContext()

  return (
    <Tooltip>
      <Checkbox
        name="includeRwaRestrictedTokens"
        checked={includeRwaRestrictedTokens}
        onCheckedChange={(checked) => setIncludeRwaRestrictedTokens(!!checked)}
      >
        <div className="flex items-center gap-1">
          <div>Include restricted RWA tokens</div>
          <TooltipTrigger asChild>
            <div className="flex size-4 items-center justify-center">
              <InfoIcon className="size-3.5" />
            </div>
          </TooltipTrigger>
        </div>
      </Checkbox>
      <TooltipContent>
        Centralized RWAs with access, transfer, transparency or onchain
        liquidity restrictions. A more formal framework for RWAs is in the
        works!
      </TooltipContent>
    </Tooltip>
  )
}
