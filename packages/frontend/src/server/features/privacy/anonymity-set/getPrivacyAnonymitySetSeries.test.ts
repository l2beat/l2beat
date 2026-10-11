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

const WAIT_STEP =
  'Wait for a randomized duration of time up to 30 days. Do not rely on human judgement to pick a random number.'

describe(getPrivacyAnonymitySetSeries.name, () => {
  it('formats amounts for tokens with zero decimals', () => {
    const project = makeProject({ decimals: 0, minimumAmount: '42' })

    const [series] = getPrivacyAnonymitySetSeries(project)

    expect(series).toEqual(
      expect.subset({
        label: '≥42 TOKEN',
        compactLabel: '≥42 TOKEN',
        headlineLabel: '≥42 TOKEN',
      }),
    )
  })

  it('describes a fixed-denomination pool', () => {
    const project = makeProject({
      decimals: 6,
      minimumAmount: '200000000',
      bucketType: 'denomination',
    })

    const [series] = getPrivacyAnonymitySetSeries(project)

    expect(series).toEqual(
      expect.subset({
        label: '200 TOKEN',
        description:
          'Number of unique depositors in the 200 TOKEN bucket during the last 30 complete UTC days.',
        steps: [
          'Deposit into the 200 TOKEN Project pool on Ethereum.',
          WAIT_STEP,
          'Withdraw to an unlinkable address.',
        ],
      }),
    )
  })

  it('describes a variable-amount pool', () => {
    const project = makeProject({ decimals: 1, minimumAmount: '1' })

    const [series] = getPrivacyAnonymitySetSeries(project)

    expect(series).toEqual(
      expect.subset({
        label: '≥0.1 TOKEN',
        description:
          'Number of unique depositors who deposited at least 0.1 TOKEN during the last 30 complete UTC days.',
        steps: [
          'Deposit into Project on Ethereum.',
          WAIT_STEP,
          'Withdraw at most 0.1 TOKEN to an unlinkable address, and not exactly your deposit amount.',
        ],
      }),
    )
  })

  it('builds one series for key registrations, with no label under the value', () => {
    const project: PrivacyAnonymitySetProject = {
      id: ProjectId('registry'),
      name: 'Registry',
      privacyInfo: mockObject<ProjectPrivacyInfo>({
        tokens: [],
        anonymitySet: {
          type: 'key-registrations',
          registry: ChainSpecificAddress.fromLong(
            'ethereum',
            EthereumAddress(`0x${'33'.repeat(20)}`),
          ),
          sinceTimestamp: UnixTime(1000),
          event: `0x${'44'.repeat(32)}`,
          extractor: 'umbraStealthKeyChanged',
        },
      }),
    }

    expect(getPrivacyAnonymitySetSeries(project)).toEqual([
      {
        id: 'key-registrations',
        configurationId: expect.a(String),
        projectId: 'registry',
        bucketId: 'key-registrations',
        label: 'Registered recipients',
        compactLabel: 'Registered recipients',
        description:
          'Number of unique addresses that registered stealth keys onchain during the last 30 complete UTC days.',
        steps: [
          'Register keys for Registry onchain.',
          WAIT_STEP,
          'Receive a stealth address transfer.',
        ],
        minimumAmount: '0',
        sinceTimestamp: UnixTime(1000),
      },
    ])
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

    expect(series?.label).toEqual('≥5000 TOKEN')
    expect(series?.steps[0]).toEqual('Deposit into Project on Starknet.')
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
    anonymitySet: undefined,
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

  return { id: ProjectId('project'), name: 'Project', privacyInfo }
}
