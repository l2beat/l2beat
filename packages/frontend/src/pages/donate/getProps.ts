import { toDataURL } from 'qrcode'

import { Config } from '../../build/config'
import { getFooterProps, getNavbarProps } from '../../components'
import { Wrapped } from '../Page'
import { DonatePageProps } from './DonatePage'

export async function getProps(
  config: Config,
): Promise<Wrapped<DonatePageProps>> {
  const address = '0x41626BA92c0C2a1aD38fC83920300434082B1870'
  return {
    props: {
      navbar: getNavbarProps(config, 'donate'),
      title: 'Donate',
      details: {
        ethereumAddress: address,
        qrLightURL: await toDataURL(address, {
          width: 240,
          color: {
            light: '#fafafa',
          },
          errorCorrectionLevel: 'H',
          margin: 0,
        }),
        qrDarkURL: await toDataURL(address, {
          width: 240,
          color: {
            light: '#1b1b1b',
            dark: '#ffffff',
          },
          errorCorrectionLevel: 'H',
          margin: 0,
        }),
        networks: [
          {
            name: 'Ethereum mainnet',
            linkURL: `https://etherscan.io/address/${address}`,
          },
          {
            name: 'Arbitrum',
            linkURL: `https://arbiscan.io/address/${address}`,
          },
          {
            name: 'Optimism',
            linkURL: `https://optimistic.etherscan.io/address/${address}`,
          },
          {
            name: 'zkSync 1.0',
            linkURL: `https://zkscan.io/explorer/accounts/${address}`,
          },
          {
            name: 'Gitcoin',
            linkURL:
              'https://explorer.gitcoin.co/#/round/424/0x222ea76664ed77d18d4416d2b2e77937b76f0a35/0x222ea76664ed77d18d4416d2b2e77937b76f0a35-27',
          },
        ],
      },
      footer: getFooterProps(config),
      showGitcoinButton: config.features.gitcoinOption,
    },
    wrapper: {
      metadata: {
        title: 'Donate – L2BEAT',
        description: '',
        image: 'https://l2beat.com/meta-images/overview-scaling.png',
        url: 'https://l2beat.com/donate/',
      },
    },
  }
}
