import { toDataURL } from 'qrcode'

import { PageMetadata } from '../../PageMetadata'

export interface DonatePageProps {
  title: string
  metadata: PageMetadata
  details: DonationDetailsProps
}

export interface DonationDetailsProps {
  ethereumAddress: string
  qrLightURL: string
  qrDarkURL: string
  networks: {
    name: string
    linkURL: string
  }[]
}

export async function getProps(): Promise<DonatePageProps> {
  const address = '0x41626BA92c0C2a1aD38fC83920300434082B1870'
  return {
    title: 'Donate',
    metadata: {
      title: 'L2BEAT – Donate',
      description: '',
      image: 'https://l2beat.com/meta-images/overview.png',
      url: 'https://l2beat.com/donate/',
    },
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
      ],
    },
  }
}
