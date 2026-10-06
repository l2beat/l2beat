import { TabInfoWithDrawer } from '~/components/TabInfoWithDrawer'

export function LiquidStakingRisksInfo() {
  return (
    <TabInfoWithDrawer
      title="How to read this table"
      content="Compares the trust assumptions of the liquid staking tokens
        tracked by L2BEAT along six dimensions: who can mint, who runs the
        validators and absorbs slashing, where the backing ETH sits, who
        writes the exchange rate, how holders exit, and who can change the
        code. Every value is read from the deployed contracts. Green means the
        dimension is enforced by code with no privileged party, yellow means a
        privileged party that is bounded or delayed, red means a party that
        can act without bound or delay. Hover a cell for the details."
    />
  )
}
