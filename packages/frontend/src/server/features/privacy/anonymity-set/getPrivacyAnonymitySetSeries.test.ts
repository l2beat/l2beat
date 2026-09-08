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
  })
})

function makeProject({
  decimals,
  minimumAmount,
}: {
  decimals: number
  minimumAmount: string
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
            type: 'pool',
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
