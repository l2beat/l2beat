import type { ProjectPrivacyInfo } from '@l2beat/config'
import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getPrivacyPageChains,
  getPrivacyProjectOnChain,
} from './getPrivacyPageChains'

const POOL = EthereumAddress('0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc')

describe(getPrivacyPageChains.name, () => {
  it('lists the chains with buckets in trackedOn order', () => {
    expect(
      getPrivacyPageChains({
        trackedOn: ['base', 'ethereum', 'optimism'],
        tokens: [token('optimism'), token('base')],
      }),
    ).toEqual(['base', 'optimism'])
  })

  it('adds a chain with its own assessment, and the first chain with it', () => {
    expect(
      getPrivacyPageChains({
        trackedOn: ['ethereum', 'base', 'arbitrum'],
        tokens: [],
        chainAssessments: {
          arbitrum: {} as ProjectPrivacyInfo,
        },
      }),
    ).toEqual(['ethereum', 'arbitrum'])
  })

  it('lists nothing for a project tracked on chains without buckets', () => {
    expect(
      getPrivacyPageChains({ trackedOn: ['ethereum', 'base'], tokens: [] }),
    ).toEqual([])
  })
})

describe(getPrivacyProjectOnChain.name, () => {
  it("keeps the chain's buckets and takes the chain's assessment", () => {
    const project = {
      privacyInfo: {
        trackedOn: ['base', 'optimism'],
        tokens: [token('base'), token('optimism')],
        riskSummary: 'base',
        chainAssessments: { optimism: { riskSummary: 'optimism' } },
      } as unknown as ProjectPrivacyInfo,
    }

    const { privacyInfo } = getPrivacyProjectOnChain(project, 'optimism')

    expect(privacyInfo.tokens).toEqual([token('optimism')])
    expect(privacyInfo.riskSummary).toEqual('optimism')
  })

  it("leaves a field unset when the chain's assessment has none", () => {
    const project = {
      privacyInfo: {
        trackedOn: ['base', 'optimism'],
        tokens: [],
        riskSummary: 'base',
        anonymitySet: { type: 'too-small' },
        chainAssessments: { optimism: {} },
      } as unknown as ProjectPrivacyInfo,
    }

    const { privacyInfo } = getPrivacyProjectOnChain(project, 'optimism')

    expect(privacyInfo.riskSummary).toEqual(undefined)
    expect(privacyInfo.anonymitySet).toEqual(undefined)
  })

  it('keeps a key registry only on its own chain', () => {
    const anonymitySet = {
      type: 'key-registrations',
      registry: ChainSpecificAddress.fromLong('base', POOL),
    }
    const project = {
      privacyInfo: {
        trackedOn: ['base', 'optimism'],
        tokens: [],
        anonymitySet,
      } as unknown as ProjectPrivacyInfo,
    }

    expect(
      getPrivacyProjectOnChain(project, 'base').privacyInfo.anonymitySet,
    ).toEqual(anonymitySet as ProjectPrivacyInfo['anonymitySet'])
    expect(
      getPrivacyProjectOnChain(project, 'optimism').privacyInfo.anonymitySet,
    ).toEqual(undefined)
  })
})

function token(chain: string) {
  return {
    buckets: [{ address: ChainSpecificAddress.fromLong(chain, POOL) }],
  } as ProjectPrivacyInfo['tokens'][number]
}
