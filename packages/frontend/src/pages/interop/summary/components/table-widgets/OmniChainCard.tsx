import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { api } from '~/trpc/React'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { OmniChainTable } from './tables/OmniChainTable'

export function OmniChainCard() {
  const { selectedChains } = useInteropSelectedChains()
  const { data } = api.interop.dashboard.useQuery({
    from: selectedChains.from,
    to: selectedChains.to,
  })

  return (
    <PrimaryCard>
      <h2 className="font-bold text-heading-24">Omnichain</h2>
      <div className="mt-2.5 text-paragraph-13 text-secondary">
        The bridge risk is present at all times, as it can mint tokens on all
        chains. Flow limits might be applied.
      </div>
      <OmniChainTable entires={data?.protocolsByType.omniChain} />
    </PrimaryCard>
  )
}
