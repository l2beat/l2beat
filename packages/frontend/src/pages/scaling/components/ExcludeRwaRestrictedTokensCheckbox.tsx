import { Checkbox } from '~/components/core/Checkbox'
import { useScalingRwaRestrictedTokensContext } from './ScalingRwaRestrictedTokensContext'

export function ExcludeRwaRestrictedTokensCheckbox() {
  const { excludeRwaRestrictedTokens, setExcludeRwaRestrictedTokens } =
    useScalingRwaRestrictedTokensContext()

  return (
    <Checkbox
      name="excludeRwaRestrictedTokens"
      checked={excludeRwaRestrictedTokens}
      onCheckedChange={(checked) => setExcludeRwaRestrictedTokens(!!checked)}
    >
      Exclude RWA restricted tokens
    </Checkbox>
  )
}
