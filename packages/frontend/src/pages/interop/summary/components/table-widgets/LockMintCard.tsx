import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { api } from '~/trpc/React'
import { useInteropSelectedChains } from '../../utils/InteropSelectedChainsContext'
import { LockMintTable } from './tables/LockMintTable'

export function LockMintCard() {
  const { selectedChains } = useInteropSelectedChains()
  const { data } = api.interop.dashboard.useQuery({
    from: selectedChains.from,
    to: selectedChains.to,
  })

  return (
    <PrimaryCard>
      <h2 className="font-bold text-heading-24">Lock & Mint</h2>
      <div className="mt-2.5 text-paragraph-13 text-secondary">
        One-sided risk. If user bridge back, the original tokens are unlocked
        and the bridge risk is removed.
      </div>
      <LockMintTable entires={data?.protocolsByType.lockMint} />
    </PrimaryCard>
  )
}
