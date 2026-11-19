import type { ProjectPrivacyInfo } from '@l2beat/config'
import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getPrivacyDeploymentChains,
  getPrivacyProjectOnChain,
  getPrivacyProjectPages,
} from './getPrivacyProjectPages'

const POOL = EthereumAddress('0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc')

describe(getPrivacyProjectPages.name, () => {
  const pagesOf = (privacyInfo: Partial<ProjectPrivacyInfo>) =>
    getPrivacyProjectPages({
      slug: 'project',
      privacyInfo: privacyInfo as ProjectPrivacyInfo,
    }).map(({ chain, path }) => ({ chain, path }))

  it('gives a project researched on one deployment its single page', () => {
    expect(
      pagesOf({ trackedOn: ['ethereum', 'base'], tokens: [token('base')] }),
    ).toEqual([{ chain: undefined, path: '/privacy/projects/project' }])
    expect(
      pagesOf({
        trackedOn: ['base', 'optimism'],
        tokens: [token('base'), token('optimism')],
      }),
    ).toEqual([{ chain: undefined, path: '/privacy/projects/project' }])
  })

  it('gives a page to each deployment researched on its own', () => {
    expect(
      pagesOf({
        trackedOn: ['base', 'ethereum', 'optimism', 'arbitrum'],
        tokens: [token('optimism'), token('base'), token('arbitrum')],
        chainAssessments: { arbitrum: {} as ProjectPrivacyInfo },
      }),
    ).toEqual([
      { chain: 'base', path: '/privacy/projects/project' },
      { chain: 'arbitrum', path: '/privacy/projects/project/arbitrum' },
    ])
  })

  it("keeps every chain's buckets and takes the page's assessment", () => {
    const [base, optimism] = getPrivacyProjectPages({
      slug: 'project',
      privacyInfo: {
        trackedOn: ['base', 'optimism'],
        tokens: [token('base'), token('optimism')],
        riskSummary: 'base',
        chainAssessments: { optimism: { riskSummary: 'optimism' } },
      } as unknown as ProjectPrivacyInfo,
    })

    expect(base?.project.privacyInfo.tokens).toEqual([
      token('base'),
      token('optimism'),
    ])
    expect(optimism?.project.privacyInfo.tokens).toEqual([
      token('base'),
      token('optimism'),
    ])
    expect(base?.project.privacyInfo.riskSummary).toEqual('base')
    expect(optimism?.project.privacyInfo.riskSummary).toEqual('optimism')
  })
})

describe(getPrivacyDeploymentChains.name, () => {
  it('takes the chains with buckets or research, the first tracked one too', () => {
    expect(
      getPrivacyDeploymentChains({
        trackedOn: ['ethereum', 'base', 'optimism'],
        tokens: [token('base'), token('optimism')],
      }),
    ).toEqual(['ethereum', 'base', 'optimism'])
    expect(
      getPrivacyDeploymentChains({
        trackedOn: ['ethereum', 'base'],
        tokens: [token('base')],
      }),
    ).toEqual(['base'])
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
