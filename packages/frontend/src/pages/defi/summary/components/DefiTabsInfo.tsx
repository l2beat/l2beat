import { TabInfoWithDrawer } from '~/components/TabInfoWithDrawer'

export function LiquidStakingRisksInfo() {
  return (
    <TabInfoWithDrawer
      title="How to read this table"
      content="Six trust dimensions of each liquid staking token, read from the
        deployed contracts: who mints, who runs the validators, where the ETH
        sits, who writes the rate, how holders exit and who changes the code.
        Green is enforced by code, yellow a bounded privileged party, red an
        unbounded one. Hover a cell for the details."
    />
  )
}
