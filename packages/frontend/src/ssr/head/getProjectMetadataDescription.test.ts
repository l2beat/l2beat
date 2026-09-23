import { expect } from 'earl'
import {
  getDaMetadataDescription,
  getInteropMetadataDescription,
  getProjectMetadataDescription,
  getScalingMetadataDescription,
  getZkCatalogMetadataDescription,
} from './getProjectMetadataDescription'

describe(getScalingMetadataDescription.name, () => {
  it('leads with the type, stage and TVS of an L2, then the description', () => {
    const description = getScalingMetadataDescription({
      name: 'Arbitrum One',
      category: 'Optimistic Rollup',
      stage: 'Stage 1',
      hostChain: undefined,
      tvs: 16_203_000_000,
      description: 'Arbitrum is a general-purpose rollup.',
    })

    expect(description).toEqual(
      'Arbitrum One is a Stage 1 Optimistic Rollup securing $16.20B. Arbitrum is a general-purpose rollup.',
    )
  })

  it('names the host chain of an L3 and skips a stage under review', () => {
    const description = getScalingMetadataDescription({
      name: 'Xai',
      category: 'Optimium',
      stage: 'UnderReview',
      hostChain: 'Arbitrum One',
      tvs: 1_234_567,
      description: 'Xai is a gaming chain.',
    })

    expect(description).toEqual(
      'Xai is an Optimium on Arbitrum One securing $1.23M. Xai is a gaming chain.',
    )
  })

  it('reads naturally for the Other category and without TVS', () => {
    const description = getScalingMetadataDescription({
      name: 'Fuel Ignition',
      category: 'Other',
      stage: 'NotApplicable',
      hostChain: undefined,
      tvs: undefined,
      description: 'Fuel Ignition is a fast chain.',
    })

    expect(description).toEqual(
      'Fuel Ignition is a scaling project. Fuel Ignition is a fast chain.',
    )
  })

  it('falls back to a generic noun when the category is not set', () => {
    const description = getScalingMetadataDescription({
      name: 'Upcoming Chain',
      category: undefined,
      stage: 'NotApplicable',
      hostChain: 'Base',
      tvs: 0,
      description: 'Upcoming Chain launches soon.',
    })

    expect(description).toEqual(
      'Upcoming Chain is a scaling project on Base securing $0.00. Upcoming Chain launches soon.',
    )
  })

  // The facts sentence is 61 chars plus a separating space, leaving 98 of
  // the 160-char budget: sixteen 5-letter words (95 chars) and the ellipsis
  // fit, a seventeenth word would not.
  it('cuts a long description on a word boundary to fit 160 chars', () => {
    const description = getScalingMetadataDescription({
      name: 'Arbitrum One',
      category: 'Optimistic Rollup',
      stage: 'Stage 1',
      hostChain: undefined,
      tvs: 16_203_000_000,
      description: 'lorem '.repeat(30).trim(),
    })

    expect(description).toEqual(
      `Arbitrum One is a Stage 1 Optimistic Rollup securing $16.20B. ${'lorem '.repeat(16).trim()}…`,
    )
    expect(description.length).toBeLessThanOrEqual(160)
  })
})

describe(getDaMetadataDescription.name, () => {
  it('leads with the layer type, TVS and economic security', () => {
    const description = getDaMetadataDescription({
      name: 'Celestia',
      type: 'Public Blockchain',
      tvs: 1_500_000_000,
      economicSecurity: 2_250_000_000,
      description: 'Celestia is a modular DA network.',
    })

    expect(description).toEqual(
      'Celestia is a DA layer (Public Blockchain) securing $1.50B, with $2.25B in economic security. Celestia is a modular DA network.',
    )
  })

  it('omits economic security when the layer has none', () => {
    const description = getDaMetadataDescription({
      name: 'EigenDA',
      type: 'DA Service',
      tvs: 1_500_000_000,
      economicSecurity: undefined,
      description: 'EigenDA is a DA service.',
    })

    expect(description).toEqual(
      'EigenDA is a DA layer (DA Service) securing $1.50B. EigenDA is a DA service.',
    )
  })
})

describe(getZkCatalogMetadataDescription.name, () => {
  it('leads with the creator and the TVS the proof system secures', () => {
    const description = getZkCatalogMetadataDescription({
      name: 'SP1',
      creator: 'Succinct',
      tvs: 2_100_000_000,
      description: 'SP1 is a zkVM.',
    })

    expect(description).toEqual(
      'SP1 is a ZK proof system by Succinct securing $2.10B. SP1 is a zkVM.',
    )
  })

  it('omits the creator when unknown', () => {
    const description = getZkCatalogMetadataDescription({
      name: 'Boojum',
      creator: undefined,
      tvs: 5_000_000,
      description: 'Boojum is a STARK prover.',
    })

    expect(description).toEqual(
      'Boojum is a ZK proof system securing $5.00M. Boojum is a STARK prover.',
    )
  })
})

describe(getInteropMetadataDescription.name, () => {
  it('leads with the protocol type, bridge types and 24h volume', () => {
    const description = getInteropMetadataDescription({
      name: 'Across',
      type: 'intent',
      bridgeTypes: ['nonMinting', 'burnAndMint'],
      last24hVolume: 42_000_000,
      description: 'Across is a crosschain intents protocol.',
    })

    expect(description).toEqual(
      'Across is an intent bridge (Non-minting, Burn & Mint) with $42.00M volume in the last 24h. Across is a crosschain intents protocol.',
    )
  })

  it('states only the type when volume, bridge types and description are missing', () => {
    const description = getInteropMetadataDescription({
      name: 'Hop',
      type: 'multichain',
      bridgeTypes: [],
      last24hVolume: undefined,
      description: undefined,
    })

    expect(description).toEqual('Hop is a multichain interop protocol.')
  })
})

describe(getProjectMetadataDescription.name, () => {
  it('caps the generic description used by pages without key facts', () => {
    const description = getProjectMetadataDescription({
      name: 'Aztec',
      display: { description: 'lorem '.repeat(40).trim() },
    })

    expect(description.length).toBeLessThanOrEqual(160)
    expect(description.endsWith('lorem…')).toEqual(true)
  })
})
