import type { PrivacyBucketAddress, ProjectPrivacyInfo } from '@l2beat/config'
import { createPrivacyAnonymitySetConfigurationId } from '@l2beat/shared'
import {
  ChainSpecificAddress,
  EthereumAddress,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import {
  getPrivacyAnonymitySetSeries,
  type PrivacyAnonymitySetProject,
} from './getPrivacyAnonymitySetSeries'

describe(getPrivacyAnonymitySetSeries.name, () => {
  it('formats amounts for tokens with zero decimals', () => {
    const project = makeProject({ decimals: 0, minimumAmount: '42' })

    const [series] = getPrivacyAnonymitySetSeries(project)

    expect(series?.label).toEqual('≥42 TOKEN')
    expect(series?.formattedAmount).toEqual('42')
    expect(series?.bucketType).toEqual('pool')
  })

  it('keeps denomination metadata separate from the display label', () => {
    const project = makeProject({
      decimals: 6,
      minimumAmount: '200000000',
      bucketType: 'denomination',
    })

    const [series] = getPrivacyAnonymitySetSeries(project)

    expect(series?.label).toEqual('200 TOKEN')
    expect(series?.formattedAmount).toEqual('200')
    expect(series?.bucketType).toEqual('denomination')
    expect(series?.chain).toEqual('ethereum')
    expect(series?.token).toEqual('TOKEN')
  })

  it('derives the chain and configuration id from an explicit chain address', () => {
    const address = {
      chain: 'starknet',
      address: `0x${'0c'.repeat(32)}`,
    }
    const project = makeProject({
      decimals: 18,
      minimumAmount: '5000000000000000000000',
      address,
    })

    const [series] = getPrivacyAnonymitySetSeries(project)

    expect(series?.chain).toEqual('starknet')
    expect(series?.label).toEqual('≥5000 TOKEN')
    expect(series?.configurationId).toEqual(
      createPrivacyAnonymitySetConfigurationId({
        projectId: 'project',
        bucketId: 'bucket',
        chain: address.chain,
        address: address.address,
        event: `0x${'22'.repeat(32)}`,
        extractor: 'fixedAmount',
        params: { amount: '5000000000000000000000' },
      }),
    )
  })
})

function makeProject({
  decimals,
  minimumAmount,
  bucketType = 'pool',
  address = ChainSpecificAddress.fromLong(
    'ethereum',
    EthereumAddress(`0x${'11'.repeat(20)}`),
  ),
}: {
  decimals: number
  minimumAmount: string
  bucketType?: 'pool' | 'denomination'
  address?: PrivacyBucketAddress
}): PrivacyAnonymitySetProject {
  const privacyInfo = mockObject<ProjectPrivacyInfo>({
    tokens: [
      {
        token: {
          address: EthereumAddress.ZERO,
          iconUrl: undefined,
          symbol: 'TOKEN',
          decimals,
          priceId: 'token',
          sinceTimestamp: UnixTime(0),
        },
        buckets: [
          {
            id: 'bucket',
            type: bucketType,
            label: 'Token pool',
            address,
            sinceTimestamp: UnixTime(0),
            anonymitySet: { minimumAmounts: [minimumAmount] },
            deposit: {
              event: `0x${'22'.repeat(32)}`,
              extractor: 'fixedAmount',
              params: { amount: minimumAmount },
            },
            withdrawal: {
              event: `0x${'33'.repeat(32)}`,
              extractor: 'fixedAmount',
              params: { amount: minimumAmount },
            },
          },
        ],
      },
    ],
  })

  return { id: ProjectId('project'), privacyInfo }
}
