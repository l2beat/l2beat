import { expect } from 'earl'
import {
  getDaMetadataDescription,
  getInteropMetadataDescription,
  getPrivacyMetadataDescription,
  getProjectMetadataDescription,
  getScalingMetadataDescription,
  getZkCatalogMetadataDescription,
} from './projectMetaDescriptions'

describe(getScalingMetadataDescription.name, () => {
  it('leads with the stage, type and TVS of an L2, then the description', () => {
    const description = getScalingMetadataDescription({
      name: 'Arbitrum One',
      category: 'Optimistic Rollup',
      stage: 'Stage 1',
      hostChain: undefined,
      tvs: 16_203_000_000,
      description: 'Arbitrum One is a general-purpose chain.',
    })

    expect(description).toEqual(
      'Stage 1 Optimistic Rollup · $16B TVS. Arbitrum One is a general-purpose chain.',
    )
  })

  // The description names the type in a different case than the config
  // category, which must still count as a mention.
  it('leaves out the type when the description already states it', () => {
    const description = getScalingMetadataDescription({
      name: 'Arbitrum One',
      category: 'Optimistic Rollup',
      stage: 'Stage 1',
      hostChain: undefined,
      tvs: 16_203_000_000,
      description: 'Arbitrum One is a general-purpose optimistic rollup.',
    })

    expect(description).toEqual(
      'Stage 1 · $16B TVS. Arbitrum One is a general-purpose optimistic rollup.',
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
      'Optimium · on Arbitrum One · $1.2M TVS. Xai is a gaming chain.',
    )
  })

  it('returns the bare description when there is no fact to state', () => {
    const description = getScalingMetadataDescription({
      name: 'Fuel Ignition',
      category: 'Other',
      stage: 'NotApplicable',
      hostChain: undefined,
      tvs: undefined,
      description: 'Fuel Ignition is a fast chain.',
    })

    expect(description).toEqual('Fuel Ignition is a fast chain.')
  })

  it('hides a zero TVS and capitalizes a lead that starts with the host chain', () => {
    const description = getScalingMetadataDescription({
      name: 'Upcoming Chain',
      category: undefined,
      stage: 'NotApplicable',
      hostChain: 'Base',
      tvs: 0,
      description: 'Upcoming Chain launches soon.',
    })

    expect(description).toEqual('On Base. Upcoming Chain launches soon.')
  })

  // "on Arbitrum" states the host, while "Arbitrum Orbit stack" only names
  // the technology and must not hide it.
  it('leaves out the host chain only when the description states it', () => {
    const stated = getScalingMetadataDescription({
      name: 'Winr',
      category: 'Other',
      stage: 'NotApplicable',
      hostChain: 'Arbitrum One',
      tvs: undefined,
      description: 'WINR is a Layer 3 on Arbitrum.',
    })
    const technologyOnly = getScalingMetadataDescription({
      name: 'ApeChain',
      category: 'Other',
      stage: 'NotApplicable',
      hostChain: 'Arbitrum One',
      tvs: undefined,
      description: 'ApeChain is built on the Arbitrum Orbit stack.',
    })

    expect(stated).toEqual('WINR is a Layer 3 on Arbitrum.')
    expect(technologyOnly).toEqual(
      'On Arbitrum One. ApeChain is built on the Arbitrum Orbit stack.',
    )
  })

  it('hides a TVS below $100K', () => {
    const description = getScalingMetadataDescription({
      name: 'Payy',
      category: 'Other',
      stage: 'NotApplicable',
      hostChain: undefined,
      tvs: 99_999,
      description: 'Payy is a payments network.',
    })

    expect(description).toEqual('Payy is a payments network.')
  })

  // Multi-line config strings reach the builder with their newline and
  // indentation intact.
  it('collapses newlines and repeated spaces in the description', () => {
    const description = getScalingMetadataDescription({
      name: 'ApeX Pro',
      category: 'Other',
      stage: 'NotApplicable',
      hostChain: undefined,
      tvs: undefined,
      description:
        'ApeX Pro is a trading platform that delivers\n      perpetual contracts trading.',
    })

    expect(description).toEqual(
      'ApeX Pro is a trading platform that delivers perpetual contracts trading.',
    )
  })

  // The lead is 19 chars plus a separating space, leaving 280 of the 300-char
  // budget: nine 28-char sentences joined by spaces take 260, a tenth would
  // need 289. The sentences are numbered because repeated ones are dropped.
  it('drops the sentences of a long description that do not fit 300 chars', () => {
    const sentences = Array.from(
      { length: 12 },
      (_, i) => `Lorem ipsum dolor sit no ${i + 10}.`,
    )
    const description = getScalingMetadataDescription({
      name: 'Lorem',
      category: undefined,
      stage: 'Stage 1',
      hostChain: undefined,
      tvs: 16_203_000_000,
      description: sentences.join(' '),
    })

    expect(description).toEqual(
      `Stage 1 · $16B TVS. ${sentences.slice(0, 9).join(' ')}`,
    )
    expect(description.length).toBeLessThanOrEqual(300)
  })
})

describe(getDaMetadataDescription.name, () => {
  it('leads with TVS and economic security', () => {
    const description = getDaMetadataDescription({
      name: 'Celestia',
      bridge: undefined,
      tvs: 1_500_000_000,
      economicSecurity: 2_300_000_000,
      description: 'Celestia is a modular data availability network.',
    })

    expect(description).toEqual(
      'DA layer · $1.5B TVS · $2.3B economic security. Celestia is a modular data availability network.',
    )
  })

  it('omits economic security when the layer has none', () => {
    const description = getDaMetadataDescription({
      name: 'EigenDA',
      bridge: undefined,
      tvs: 1_500_000_000,
      economicSecurity: undefined,
      description: 'EigenDA is a data availability service.',
    })

    expect(description).toEqual(
      'DA layer · $1.5B TVS. EigenDA is a data availability service.',
    )
  })
})

describe('DA bridge pages', () => {
  // The page joins the layer's and the bridge's descriptions; a layer's own
  // bridge repeats the layer text word for word.
  it('names the bridge and drops a repeated sentence', () => {
    const description = getDaMetadataDescription({
      name: 'EigenDA',
      bridge: { name: 'EigenDA', isNoBridge: false },
      tvs: 20_000_000,
      economicSecurity: undefined,
      description:
        'EigenDA is a data availability solution. EigenDA is a data availability solution.',
    })

    expect(description).toEqual(
      'DA layer · EigenDA bridge · $20M TVS. EigenDA is a data availability solution.',
    )
  })

  it('says so when the page is for the layer without a bridge', () => {
    const description = getDaMetadataDescription({
      name: 'EigenDA',
      bridge: { name: 'No bridge', isNoBridge: true },
      tvs: 20_000_000,
      economicSecurity: undefined,
      description: 'EigenDA is a data availability solution.',
    })

    expect(description).toEqual(
      'DA layer · no DA bridge · $20M TVS. EigenDA is a data availability solution.',
    )
  })

  it('leaves out a bridge the description already names', () => {
    const description = getDaMetadataDescription({
      name: 'Celestia',
      bridge: { name: 'Blobstream', isNoBridge: false },
      tvs: 20_000_000,
      economicSecurity: undefined,
      description:
        'Celestia is a modular network. The Blobstream bridge serves as a ZK light client.',
    })

    expect(description).toEqual(
      'DA layer · $20M TVS. Celestia is a modular network. The Blobstream bridge serves as a ZK light client.',
    )
  })
})

describe(getZkCatalogMetadataDescription.name, () => {
  it('leads with the creator and the TVS the proof system secures', () => {
    const description = getZkCatalogMetadataDescription({
      name: 'Risc0',
      creator: 'RISC Zero',
      tvs: 2_100_000_000,
      description: 'Risc0 is a zkVM proving system for RISC-V programs.',
    })

    expect(description).toEqual(
      'Created by RISC Zero · $2.1B TVS. Risc0 is a zkVM proving system for RISC-V programs.',
    )
  })

  it('leaves out the creator when the description already names it', () => {
    const description = getZkCatalogMetadataDescription({
      name: 'SP1 Turbo',
      creator: 'Succinct',
      tvs: 2_100_000_000,
      description: 'SP1 Turbo is a zk proving system built by Succinct.',
    })

    expect(description).toEqual(
      '$2.1B TVS. SP1 Turbo is a zk proving system built by Succinct.',
    )
  })

  // Privacy apps are their own creator; the name prefix already states it.
  it('leaves out a creator that is the project itself', () => {
    const description = getZkCatalogMetadataDescription({
      name: 'Railgun',
      creator: 'Railgun',
      tvs: 2_100_000_000,
      description: 'An onchain privacy system for Ethereum.',
    })

    expect(description).toEqual(
      '$2.1B TVS. Railgun – An onchain privacy system for Ethereum.',
    )
  })

  it('omits the creator when unknown', () => {
    const description = getZkCatalogMetadataDescription({
      name: 'Boojum',
      creator: undefined,
      tvs: 5_000_000,
      description: 'Boojum is a STARK prover.',
    })

    expect(description).toEqual('$5M TVS. Boojum is a STARK prover.')
  })
})

describe(getInteropMetadataDescription.name, () => {
  it('prefixes the project name when the description does not state it', () => {
    const description = getInteropMetadataDescription({
      name: 'Across',
      type: 'intent',
      description: 'Intent framework specialised on popular chains.',
    })

    expect(description).toEqual(
      'Across – Intent framework specialised on popular chains.',
    )
  })

  it('keeps a description that already names the project unchanged', () => {
    const description = getInteropMetadataDescription({
      name: 'deBridge',
      type: 'other',
      description: 'deBridge is a message bridge.',
    })

    expect(description).toEqual('deBridge is a message bridge.')
  })

  // "based" contains "Base" but does not name the project, so the prefix
  // must still be added.
  it('does not take part of a longer word for the project name', () => {
    const description = getInteropMetadataDescription({
      name: 'Base',
      type: 'canonical',
      description: 'The canonical bridge, based on the OP stack.',
    })

    expect(description).toEqual(
      'Base – The canonical bridge, based on the OP stack.',
    )
  })

  it('states the name and type when there is no description', () => {
    const description = getInteropMetadataDescription({
      name: 'Axelar',
      type: 'multichain',
      description: undefined,
    })

    expect(description).toEqual('Axelar is a multichain interop protocol.')
  })
})

describe(getPrivacyMetadataDescription.name, () => {
  it('leads with the privacy category', () => {
    const description = getPrivacyMetadataDescription({
      name: 'Railgun',
      category: 'Shielded ledger',
      description: 'An onchain privacy system for Ethereum.',
    })

    expect(description).toEqual(
      'Shielded ledger. Railgun – An onchain privacy system for Ethereum.',
    )
  })

  // "stealth-address" is the hyphenated spelling of the category, and
  // "Privacy Pools" carries the "Pool" category in its name.
  it('leaves out a category the description or the name already states', () => {
    const hyphenated = getPrivacyMetadataDescription({
      name: 'Umbra Cash',
      category: 'Stealth address',
      description: 'A stealth-address payment protocol.',
    })
    const inName = getPrivacyMetadataDescription({
      name: 'Privacy Pools',
      category: 'Pool',
      description: 'A selective-disclosure privacy system.',
    })

    expect(hyphenated).toEqual(
      'Umbra Cash – A stealth-address payment protocol.',
    )
    expect(inName).toEqual(
      'Privacy Pools – A selective-disclosure privacy system.',
    )
  })
})

describe(getProjectMetadataDescription.name, () => {
  it('passes a short description that names the project through unchanged', () => {
    const description = getProjectMetadataDescription({
      name: 'Aztec',
      description: 'Aztec is a privacy chain.',
    })

    expect(description).toEqual('Aztec is a privacy chain.')
  })

  // Base Chain is listed under a longer name than its description uses; the
  // description still opens with the project, so no prefix is needed.
  it('keeps a description that opens with a shorter form of the name', () => {
    const description = getProjectMetadataDescription({
      name: 'Base Chain',
      description: 'Base is an Optimistic Rollup.',
    })

    expect(description).toEqual('Base is an Optimistic Rollup.')
  })

  it('finds the shorter form inside a parenthesised part of the name', () => {
    const description = getProjectMetadataDescription({
      name: 'Zk.Money v2 (Aztec Connect)',
      description: 'Aztec Connect is a layer 2 network.',
    })

    expect(description).toEqual('Aztec Connect is a layer 2 network.')
  })

  it('prefixes the project name when the description does not state it', () => {
    const description = getProjectMetadataDescription({
      name: 'Tornado Cash',
      description: 'A classic Ethereum mixer design.',
    })

    expect(description).toEqual(
      'Tornado Cash – A classic Ethereum mixer design.',
    )
  })

  // A single 479-char sentence has no sentence boundary to stop at, so the
  // cut falls back to whole words: fifty 5-letter words take 299 chars and
  // the ellipsis fills the 300-char budget.
  it('cuts one overlong sentence on a word boundary with an ellipsis', () => {
    const description = getProjectMetadataDescription({
      name: 'Lorem',
      description: 'lorem '.repeat(80).trim(),
    })

    expect(description).toEqual(`${'lorem '.repeat(50).trim()}…`)
    expect(description.length).toBeLessThanOrEqual(300)
  })
})
