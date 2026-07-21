import { useMemo } from 'react'
import { useSelectedTokenContext } from '~/components/chart/tvs/token/SelectedTokenContext'
import { TokenCombobox } from '~/components/TokenCombobox'
import { ExcludeRwaRestrictedTokensCheckbox } from '~/pages/layer2s/components/ExcludeRwaRestrictedTokensCheckbox'
import { useLayer2sRwaRestrictedTokensContext } from '~/pages/layer2s/components/Layer2sRwaRestrictedTokensContext'
import type { ProjectToken } from '~/server/features/layer2s/tvs/tokens/getTokensForProject'

export function TokensControls({
  tokens,
}: {
  tokens: ProjectToken[] | undefined
}) {
  const { excludeRwaRestrictedTokens } = useLayer2sRwaRestrictedTokensContext()
  const { selectedToken, setSelectedToken } = useSelectedTokenContext()
  const filteredTokens = useMemo(
    () =>
      tokens?.filter((token) => {
        if (excludeRwaRestrictedTokens) {
          return token.category !== 'rwaRestricted'
        }
        return true
      }),
    [tokens, excludeRwaRestrictedTokens],
  )

  return (
    <div className="flex flex-wrap justify-between gap-1">
      <TokenCombobox
        tokens={filteredTokens ?? []}
        value={selectedToken}
        setValue={setSelectedToken}
      />
      <ExcludeRwaRestrictedTokensCheckbox />
    </div>
  )
}
