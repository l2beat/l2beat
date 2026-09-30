import { expect } from 'earl'
import {
  getDaMetadataDescription,
  getInteropMetadataDescription,
  getProjectMetadataDescription,
  getScalingMetadataDescription,
  getZkCatalogMetadataDescription,
} from './projectMetaDescriptions'

describe(getScalingMetadataDescription.name, () => {
  it('leads with the stage, type and TVS of an L2, then the description', () => {
    const description = getScalingMetadataDescription({
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
      category: undefined,
      stage: 'NotApplicable',
      hostChain: 'Base',
      tvs: 0,
      description: 'Upcoming Chain launches soon.',
    })

    expect(description).toEqual('On Base. Upcoming Chain launches soon.')
  })

  // Multi-line config strings reach the builder with their newline and
  // indentation intact.
  it('collapses newlines and repeated spaces in the description', () => {
    const description = getScalingMetadataDescription({
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
  // budget: ten 27-char sentences joined by spaces take 279, an eleventh
  // would not fit.
  it('drops the sentences of a long description that do not fit 300 chars', () => {
    const sentence = 'Lorem ipsum dolor sit amet.'
    const description = getScalingMetadataDescription({
      category: undefined,
      stage: 'Stage 1',
      hostChain: undefined,
      tvs: 16_203_000_000,
      description: Array(12).fill(sentence).join(' '),
    })

    expect(description).toEqual(
      `Stage 1 · $16B TVS. ${Array(10).fill(sentence).join(' ')}`,
    )
    expect(description.length).toBeLessThanOrEqual(300)
  })
})

describe(getDaMetadataDescription.name, () => {
  it('leads with TVS and economic security', () => {
    const description = getDaMetadataDescription({
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
      tvs: 1_500_000_000,
      economicSecurity: undefined,
      description: 'EigenDA is a data availability service.',
    })

    expect(description).toEqual(
      'DA layer · $1.5B TVS. EigenDA is a data availability service.',
    )
  })
})

describe(getZkCatalogMetadataDescription.name, () => {
  it('leads with the creator and the TVS the proof system secures', () => {
    const description = getZkCatalogMetadataDescription({
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
      creator: 'Succinct',
      tvs: 2_100_000_000,
      description: 'SP1 Turbo is a zk proving system built by Succinct.',
    })

    expect(description).toEqual(
      '$2.1B TVS. SP1 Turbo is a zk proving system built by Succinct.',
    )
  })

  it('omits the creator when unknown', () => {
    const description = getZkCatalogMetadataDescription({
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

describe(getProjectMetadataDescription.name, () => {
  it('passes a short description through unchanged', () => {
    expect(getProjectMetadataDescription('Aztec is a privacy chain.')).toEqual(
      'Aztec is a privacy chain.',
    )
  })

  // A single 479-char sentence has no sentence boundary to stop at, so the
  // cut falls back to whole words: fifty 5-letter words take 299 chars and
  // the ellipsis fills the 300-char budget.
  it('cuts one overlong sentence on a word boundary with an ellipsis', () => {
    const description = getProjectMetadataDescription(
      'lorem '.repeat(80).trim(),
    )

    expect(description).toEqual(`${'lorem '.repeat(50).trim()}…`)
    expect(description.length).toBeLessThanOrEqual(300)
  })
})
