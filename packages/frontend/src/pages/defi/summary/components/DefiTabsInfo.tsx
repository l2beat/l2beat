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

export function LiquidStakingChartsInfo({
  fromDate,
  asOf,
  headBlock,
}: {
  fromDate: string
  asOf: string
  headBlock: number
}) {
  return (
    <TabInfoWithDrawer
      title="Where these charts come from"
      content={`Daily snapshot from ${fromDate} to ${asOf} (block ${headBlock.toLocaleString('en-US')}): the protocol contracts, Uniswap v3 and Curve pools read from an archive node, DeFiLlama prices for wBETH, and deposit and redemption event scans. This is static data, not a live feed. Click a legend entry to toggle a protocol.`}
    />
  )
}
