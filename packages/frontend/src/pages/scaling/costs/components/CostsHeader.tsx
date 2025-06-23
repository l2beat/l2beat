import { MainPageHeader } from '~/components/MainPageHeader'

export function CostsHeader() {
  return (
    <MainPageHeader description="Onchain Costs tracks the fees paid by L2s to Ethereum for posting transaction data, proofs, and state updates. These costs provide insights into the economic efficiency of different solutions. Note that these values represent the costs incurred by the L2 itself, not the fees paid directly by users.">
      Costs
    </MainPageHeader>
  )
}
