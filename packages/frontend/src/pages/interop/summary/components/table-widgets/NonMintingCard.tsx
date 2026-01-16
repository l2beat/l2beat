import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { api } from '~/trpc/React'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { NonMintingTable } from './tables/NonMintingTable'

export function NonMintingCard() {
  const { selectedChains } = useInteropSelectedChains()
  const { data } = api.interop.dashboard.useQuery({
    from: selectedChains.from,
    to: selectedChains.to,
  })

  return (
    <PrimaryCard>
      <h2 className="font-bold text-heading-24">Non-minting</h2>
      <div className="mt-2.5 text-paragraph-13 text-secondary">
        In-light risk only. Tokens are therefore first bridged using a different
        minting bridge that needs to be separately assessed.
      </div>
      <NonMintingTable entires={data?.protocolsByType.nonMinting} />
    </PrimaryCard>
  )
}
