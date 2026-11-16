import type { ProjectLiquidStakingRisks } from '@l2beat/config'

/** The risk columns of the liquid staking table, also shown on project pages. */
export const LIQUID_STAKING_RISKS: {
  key: keyof ProjectLiquidStakingRisks
  title: string
  tooltip: string
}[] = [
  {
    key: 'minting',
    title: 'Minting',
    tooltip:
      'Who can mint the token, what caps apply, and who routes deposited ETH to validators.',
  },
  {
    key: 'operators',
    title: 'Node operators',
    tooltip:
      'Who runs the validators, whether they post a bond, and who absorbs slashing.',
  },
  {
    key: 'backing',
    title: 'Backing',
    tooltip:
      'Where the ETH backing the token sits and who controls the withdrawal credentials.',
  },
  {
    key: 'oracle',
    title: 'Oracle',
    tooltip:
      'Who writes the exchange rate, on what quorum and bounds, and what happens if they stop.',
  },
  {
    key: 'exit',
    title: 'Exit',
    tooltip:
      'How holders get ETH back, what gates it, how long it takes, and whether it can be paused.',
  },
  {
    key: 'upgrades',
    title: 'Upgrades',
    tooltip:
      'Who can change the code, the minimum delay, and whether holders have a veto.',
  },
]
