import type { ProjectPrivacyInfo } from '@l2beat/config'
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
})

function makeProject({
  decimals,
  minimumAmount,
  bucketType = 'pool',
}: {
  decimals: number
  minimumAmount: string
  bucketType?: 'pool' | 'denomination'
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
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              EthereumAddress(`0x${'11'.repeat(20)}`),
            ),
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
