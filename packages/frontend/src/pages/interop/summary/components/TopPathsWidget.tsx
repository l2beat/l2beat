import type { InteropChain } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import uniq from 'lodash/uniq'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { ArrowRightIcon } from '~/icons/ArrowRight'
import { api } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { useInteropSelectedChains } from '../utils/InteropSelectedChainsContext'

export function TopPathsWidget({
  interopChains,
}: {
  interopChains: InteropChain[]
}) {
  const { selectedChains, setPath } = useInteropSelectedChains()
  const uniqChains = uniq([...selectedChains.from, ...selectedChains.to])
  const { data } = api.interop.dashboard.useQuery({
    from: selectedChains.from,
    to: selectedChains.to,
  })

  const getChainDetails = (id: string) => {
    const chain = interopChains.find((c) => c.id === id)
    assert(chain, `Chain not found: ${id}`)
    return {
      id: chain.id,
      name: chain.name,
      iconSlug: chain.iconSlug ?? chain.id,
    }
  }

  return (
    <PrimaryCard>
      <h2 className="font-bold text-heading-20">Top 3 paths by volume </h2>
      <div className="mt-0.5 font-medium text-label-value-14 text-secondary">
        Between {uniqChains.length} supported chains
      </div>
      <div className="mt-2 space-y-1.5">
        {data?.top3Paths.map((path) => (
          <PathItem
            key={path.srcChain + path.dstChain}
            from={getChainDetails(path.srcChain)}
            to={getChainDetails(path.dstChain)}
            volume={path.volume}
            setPath={setPath}
          />
        ))}
      </div>
    </PrimaryCard>
  )
}

function PathItem({
  from,
  to,
  volume,
  setPath,
}: {
  from: { id: string; name: string; iconSlug: string }
  to: { id: string; name: string; iconSlug: string }
  volume: number
  setPath: (paths: { from: string; to: string }) => void
}) {
  return (
    <div className="flex justify-between gap-1 rounded-lg border border-divider py-2 pr-4 pl-2.5">
      <div className="flex items-center gap-1.5">
        <img
          src={`/icons/${from.iconSlug}.png`}
          alt={from.name}
          className="size-5"
        />
        <div className="font-medium text-label-value-15">{from.name}</div>
        <ArrowRightIcon className="size-5 fill-brand" />
        <img
          src={`/icons/${to.iconSlug}.png`}
          alt={to.name}
          className="size-5"
        />
        <div className="font-medium text-label-value-15">{to.name}</div>
      </div>
      <div className="flex items-center gap-1">
        <div className="font-medium text-[13px] text-secondary leading-none">
          Volume:
        </div>
        <div className="font-bold text-label-value-15">
          {formatCurrency(volume, 'usd')}
        </div>
      </div>
      <button
        onClick={() => setPath({ from: from.id, to: to.id })}
        className="text-label-value-14 text-link underline"
      >
        View path
      </button>
    </div>
  )
}
