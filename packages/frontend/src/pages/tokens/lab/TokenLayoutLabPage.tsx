import { useState } from 'react'
import { MainPageHeader } from '~/components/MainPageHeader'
import { AppLayout, type AppLayoutProps } from '~/layouts/AppLayout'
import { SideNavLayout } from '~/layouts/SideNavLayout'
import { cn } from '~/utils/cn'
import { CardPreviewLab } from './CardPreviewLab'
import type { TokenLayoutLabToken } from './getTokenLayoutLabPageData'

interface Props extends AppLayoutProps {
  tokens: TokenLayoutLabToken[]
}

export function TokenLayoutLabPage({ tokens, ...props }: Props) {
  const [selectedTokenId, setSelectedTokenId] = useState(tokens[0]?.id)
  const token =
    tokens.find((candidate) => candidate.id === selectedTokenId) ?? tokens[0]

  return (
    <AppLayout {...props}>
      <SideNavLayout variant="wide">
        <MainPageHeader description="Compare layouts for transfer volume, count, time, full upstream and downstream backing paths, and same-chain activity.">
          Selected token panel lab
        </MainPageHeader>

        <div className="sticky top-0 z-30 border-divider border-y bg-surface-primary/95 px-4 py-3 backdrop-blur md:rounded-lg md:border">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 font-medium text-label-value-13 text-secondary">
              Production data
            </span>
            {tokens.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                onClick={() => setSelectedTokenId(candidate.id)}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-3 py-1.5 font-bold text-label-value-14 transition-colors',
                  candidate.id === token?.id
                    ? 'border-brand bg-brand text-white'
                    : 'border-divider bg-surface-secondary hover:border-brand',
                )}
              >
                {candidate.iconUrl && (
                  <img
                    src={candidate.iconUrl}
                    alt=""
                    className="size-5 rounded-full"
                  />
                )}
                {candidate.symbol}
              </button>
            ))}
          </div>
        </div>

        {token && (
          <div key={token.id} className="mt-5 px-4 pb-10 md:px-0">
            <CardPreviewLab token={token} />
          </div>
        )}
      </SideNavLayout>
    </AppLayout>
  )
}
