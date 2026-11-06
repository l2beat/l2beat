import type { ProjectPrivacyInfo } from '@l2beat/config'
import type { IndexerConfigurationRecord } from '@l2beat/database'
import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getPrivacyFlowIndexerIds,
  getPrivacyFlowSync,
} from './getPrivacyFlowSync'

const POOL = ChainSpecificAddress(
  'eth:0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc',
)

describe(getPrivacyFlowIndexerIds.name, () => {
  it('names one indexer per chain, with STRK-20 sources on the Starknet one', () => {
    const result = getPrivacyFlowIndexerIds([
      {
        privacyInfo: privacyInfo([
          bucket(POOL, 'fixedAmount'),
          bucket(POOL, 'fixedAmount'),
          bucket({ chain: 'starknet', address: '0x1' }, 'strk20Deposit'),
        ]),
      },
    ])

    expect(result).toEqual([
      'privacy_flow_indexer::ethereum',
      'privacy_starknet_flow_indexer::starknet',
    ])
  })
})

describe(getPrivacyFlowSync.name, () => {
  it('reads the furthest and slowest heights of the projects', () => {
    const result = getPrivacyFlowSync(
      [
        configuration('a', UnixTime(3_600)),
        configuration('a', UnixTime(7_200)),
        configuration('b', UnixTime(1_800)),
        configuration('other', UnixTime(100)),
      ],
      ['a', 'b'],
    )

    expect(result).toEqual({
      reached: UnixTime(7_200),
      slowest: UnixTime(1_800),
    })
  })

  it('leaves out ended and unstarted configurations', () => {
    const result = getPrivacyFlowSync(
      [
        configuration('a', UnixTime(3_600)),
        { ...configuration('a', UnixTime(100)), maxHeight: UnixTime(200) },
        configuration('a', null),
      ],
      ['a'],
    )

    expect(result).toEqual({
      reached: UnixTime(3_600),
      slowest: UnixTime(3_600),
    })
  })

  it('is undefined without a started configuration', () => {
    expect(getPrivacyFlowSync([configuration('a', null)], ['a'])).toEqual(
      undefined,
    )
    expect(getPrivacyFlowSync([], ['a'])).toEqual(undefined)
  })
})

function configuration(
  projectId: string,
  currentHeight: UnixTime | null,
): IndexerConfigurationRecord {
  return {
    id: 'a'.repeat(12),
    indexerId: 'privacy_flow_indexer::ethereum',
    properties: JSON.stringify({ projectId, bucketId: 'bucket' }),
    currentHeight,
    minHeight: 0,
    maxHeight: null,
  }
}

function privacyInfo(
  buckets: ProjectPrivacyInfo['tokens'][number]['buckets'],
): Pick<ProjectPrivacyInfo, 'tokens'> {
  return {
    tokens: [{ buckets } as ProjectPrivacyInfo['tokens'][number]],
  }
}

function bucket(
  address: ProjectPrivacyInfo['tokens'][number]['buckets'][number]['address'],
  extractor: string,
): ProjectPrivacyInfo['tokens'][number]['buckets'][number] {
  return {
    address,
    deposit: { extractor },
    withdrawal: { extractor },
  } as unknown as ProjectPrivacyInfo['tokens'][number]['buckets'][number]
}
