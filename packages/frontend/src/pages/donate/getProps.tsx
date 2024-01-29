import compact from 'lodash/compact'
import { toDataURL } from 'qrcode'
import React from 'react'

import { Config } from '../../build/config'
import { getFooterProps, getNavbarProps } from '../../components'
import { Link } from '../../components/Link'
import { Wrapped } from '../Page'
import { DonateFundingSourcesProps } from './DonateFundingSources'
import { DonatePageProps } from './DonatePage'

export async function getProps(
  config: Config,
): Promise<Wrapped<DonatePageProps>> {
  const address = '0x41626BA92c0C2a1aD38fC83920300434082B1870'
  return {
    props: {
      navbar: getNavbarProps(config, 'donate'),
      header: {
        ethereumAddress: address,
        qrCodeUrl: await toDataURL(address, {
          color: {
            light: '#fafafa',
          },
          errorCorrectionLevel: 'H',
          margin: 0,
        }),
        networks: compact([
          {
            name: 'Ethereum',
            linkURL: `https://etherscan.io/address/${address}`,
          },
          {
            name: 'Arbitrum One',
            linkURL: `https://arbiscan.io/address/${address}`,
          },
          {
            name: 'OP Mainnet',
            linkURL: `https://optimistic.etherscan.io/address/${address}`,
          },
          {
            name: 'zkSync Lite',
            linkURL: `https://zkscan.io/explorer/accounts/${address}`,
          },
          config.features.gitcoinOption && {
            name: 'Gitcoin',
            linkURL:
              'https://explorer.gitcoin.co/#/round/424/0x222ea76664ed77d18d4416d2b2e77937b76f0a35/0x222ea76664ed77d18d4416d2b2e77937b76f0a35-27',
          },
        ]),
      },
      fundingSources: getFundingSources(),
      footer: getFooterProps(config),
    },
    wrapper: {
      metadata: {
        title: 'Donate – L2BEAT',
        description: '',
        image: 'https://l2beat.com/meta-images/overview-scaling.png',
        url: 'https://l2beat.com/donate/',
      },
      banner: config.features.banner,
    },
  }
}

function getFundingSources(): DonateFundingSourcesProps {
  return {
    items: [
      {
        source: 'Ethereum Foundation',
        tier: 'Significant',
        description: 'Different grants in years 2021-2023',
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
          'We are participating in the governance of Arbitrum, Optimism, Hop, Polygon, Uniswap and Connext',
      },
      {
        source: 'Gitcoin',
        tier: 'Medium',
        description: 'Gitcoin rounds in 2022-2023',
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
        source: 'Upgradeability of Ethereum L2s” report',
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
    ],
  }
}
