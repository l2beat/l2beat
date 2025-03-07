import { PageDescription } from '~/components/page-description'

export function CostsDescription() {
  return (
    <PageDescription
      pageTitle="Costs"
      description="Onchain Costs tracks the fees paid by L2s to Ethereum for posting transaction data, proofs, and state updates. These costs provide insights into the economic efficiency of different solutions. Note that these values represent the costs incurred by the L2 itself, not the fees paid directly by users."
    />
  )
}
