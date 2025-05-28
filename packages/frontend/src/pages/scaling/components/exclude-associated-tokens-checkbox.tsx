'use client'
import { Checkbox } from '~/components/core/checkbox'
import { useScalingAssociatedTokensContext } from './scaling-associated-tokens-context'

export function ExcludeAssociatedTokensCheckbox() {
  const { excludeAssociatedTokens, setExcludeAssociatedTokens } =
    useScalingAssociatedTokensContext()

  return (
    <Checkbox
      name="excludeAssociatedTokens"
      checked={excludeAssociatedTokens}
      onCheckedChange={(checked) => setExcludeAssociatedTokens(!!checked)}
      className="max-md:ml-4"
    >
      Exclude associated tokens
    </Checkbox>
  )
}
