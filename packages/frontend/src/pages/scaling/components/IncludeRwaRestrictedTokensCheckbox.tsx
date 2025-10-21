import { Checkbox } from '~/components/core/Checkbox'
import { useScalingRwaRestrictedTokensContext } from './ScalingRwaRestrictedTokensContext'

export function IncludeRwaRestrictedTokensCheckbox() {
  const { includeRwaRestrictedTokens, setIncludeRwaRestrictedTokens } =
    useScalingRwaRestrictedTokensContext()

  return (
    <Checkbox
      name="includeRwaRestrictedTokens"
      checked={includeRwaRestrictedTokens}
      onCheckedChange={(checked) => setIncludeRwaRestrictedTokens(!!checked)}
    >
      Include RWA restricted tokens
    </Checkbox>
  )
}
