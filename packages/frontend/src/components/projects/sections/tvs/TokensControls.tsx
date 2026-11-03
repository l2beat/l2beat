import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useSelectedTokenContext } from '~/components/chart/tvs/token/SelectedTokenContext'
import { TokenCombobox } from '~/components/TokenCombobox'
import { ExcludeRwaRestrictedTokensCheckbox } from '~/pages/layer2s/components/ExcludeRwaRestrictedTokensCheckbox'
import { useL2RwaRestrictedTokensContext } from '~/pages/layer2s/components/L2RwaRestrictedTokensContext'
import type { ProjectToken } from '~/server/features/layer2s/tvs/tokens/getTokensForProject'
import { useTRPC } from '~/trpc/React'

/**
 * Loads the token list once the picker is about to open (hover, focus or
 * tap), as only the open picker shows it.
 */
export function LazyTokensControls({ projectId }: { projectId: string }) {
  const trpc = useTRPC()
  const [wanted, setWanted] = useState(false)
  const { data, isLoading } = useQuery(
    trpc.tvs.projectTokens.queryOptions({ projectId }, { enabled: wanted }),
  )

  return (
    <TokensControls
      tokens={data}
      isLoading={isLoading}
      onOpenIntent={() => setWanted(true)}
    />
  )
}

export function TokensControls({
  tokens,
  isLoading,
  onOpenIntent,
}: {
  tokens: ProjectToken[] | undefined
  isLoading?: boolean
  onOpenIntent?: () => void
}) {
  const { excludeRwaRestrictedTokens } = useL2RwaRestrictedTokensContext()
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
        isLoading={isLoading}
        onOpenIntent={onOpenIntent}
      />
      <ExcludeRwaRestrictedTokensCheckbox />
    </div>
  )
}
