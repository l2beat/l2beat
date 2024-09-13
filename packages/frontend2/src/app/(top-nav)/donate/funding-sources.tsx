import Link from 'next/link'

export const fundingSources = [
  {
    source: 'Ethereum Foundation',
    tier: 'Significant',
    description: 'Different grants in years 2021-2024',
  },
  {
    source: 'Optimism RPGF',
    tier: 'Significant',
    description: 'March 2023, January 2024',
  },
  {
    source:
      'Rewards & compensation for participating in L2 governance frameworks',
    tier: 'Medium',
    description:
      'We are participating in the governance of Arbitrum, Optimism, Hop, Polygon, Uniswap and Connext, and more',
  },
  {
    source: 'Gitcoin',
    tier: 'Medium',
    description: 'Gitcoin rounds in 2022-2024',
  },
  {
    source: 'Direct community donations',
    tier: 'Small',
    description: 'Via this page',
  },
  {
    source: 'L2 Amsterdam (2022) conference sponsorships',
    tier: 'Small',
    description: (
      <span>
        <div>April 2022</div>
        <div>Covered the costs of the conference</div>
      </span>
    ),
  },
  {
    source: 'L2 Warsaw (2023) conference sponsorships',
    tier: 'Small',
    description: (
      <span>
        <div>August 2023</div>
        <div>Covered the costs of the conference</div>
      </span>
    ),
  },
  {
    source: 'L2DAYS Istanbul (2023) conference sponsorships',
    tier: 'Medium',
    description: (
      <span>
        <div>November 2023</div>
        <div>Covered the costs of the conference</div>
      </span>
    ),
  },
  {
    source: '"Upgradeability of Ethereum L2s" report',
    tier: 'Small',
    description: 'Funded by Polygon Labs',
  },
  {
    source: 'Open-source explorer for StarkEx deployments',
    tier: 'Medium',
    description: (
      <span>
        Live at <Link href="https://dydx.l2beat.com">dydx.l2beat.com</Link>,
        view the code{' '}
        <Link href="https://github.com/l2beat/starkex-explorer">here</Link>.
        Funded by StarkWare and dYdX
      </span>
    ),
  },
  {
    source: 'LayerZero transparency dashboard',
    tier: 'Medium',
    description: 'Project in progress. Funded by LayerZero',
  },
  {
    source: 'DAC memberships',
    tier: 'Small',
    description: 'Discontinued',
  },
]
