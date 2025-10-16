import { useMemo } from 'react'
import { useSelectedTokenContext } from '~/components/chart/tvs/token/SelectedTokenContext'
import { TokenCombobox } from '~/components/TokenCombobox'
import { IncludeRwaRestrictedTokensCheckbox } from '~/pages/scaling/components/IncludeRwaRestrictedTokensCheckbox'
import { useScalingRwaRestrictedTokensContext } from '~/pages/scaling/components/ScalingRwaRestrictedTokensContext'
import type { ProjectToken } from '~/server/features/scaling/tvs/tokens/getTokensForProject'

export function TokensControls({
  tokens,
}: {
  tokens: ProjectToken[] | undefined
}) {
  const { includeRwaRestrictedTokens } = useScalingRwaRestrictedTokensContext()
  const { selectedToken, setSelectedToken } = useSelectedTokenContext()
  const filteredTokens = useMemo(
    () =>
      tokens?.filter((token) => {
        if (!includeRwaRestrictedTokens) {
          return token.category !== 'rwaRestricted'
        }
        return true
      }),
    [tokens, includeRwaRestrictedTokens],
  )

  return (
    <div className="flex flex-wrap justify-between gap-1">
      <TokenCombobox
        tokens={filteredTokens ?? []}
        value={selectedToken}
        setValue={setSelectedToken}
      />
      <IncludeRwaRestrictedTokensCheckbox />
    </div>
  )
}
