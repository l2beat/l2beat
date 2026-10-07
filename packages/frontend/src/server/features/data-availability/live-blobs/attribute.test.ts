import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { createAttribute, toBlobSenders } from './attribute'

// Methodology: a few projects behind made-up inboxes and sequencers, each case
// one way the backend's rule tells (or fails to tell) whose a blob is.
describe(createAttribute.name, () => {
  const attribute = createAttribute([
    { projectId: 'base', inbox: '0xbase', sequencers: [], sinceBlock: 1 },
    // ZK stack chains share the inbox and differ by who sends
    {
      projectId: 'zksync',
      inbox: '0xshared',
      sequencers: ['0xzk'],
      sinceBlock: 1,
    },
    {
      projectId: 'abstract',
      inbox: '0xshared',
      sequencers: ['0xabs'],
      sinceBlock: 1,
    },
    // Taiko moved inboxes after block 500; Morph changed sequencers then
    {
      projectId: 'taiko',
      inbox: '0xtaiko1',
      sequencers: [],
      sinceBlock: 1,
      untilBlock: 500,
    },
    { projectId: 'taiko', inbox: '0xtaiko2', sequencers: [], sinceBlock: 501 },
    {
      projectId: 'morph',
      inbox: '0xmorph',
      sequencers: ['0xm1'],
      sinceBlock: 1,
      untilBlock: 500,
    },
    {
      projectId: 'morph',
      inbox: '0xmorph',
      sequencers: ['0xm2'],
      sinceBlock: 501,
    },
  ])

  it('tells a project by its inbox alone when it names no sequencers', () => {
    expect(attribute('0xbase', '0xanyone')).toEqual('base')
  })

  it('tells projects sharing an inbox apart by who sent the blobs', () => {
    expect(attribute('0xshared', '0xzk')).toEqual('zksync')
    expect(attribute('0xshared', '0xabs')).toEqual('abstract')
  })

  it('leaves blobs sent to a shared inbox by a stranger unattributed', () => {
    expect(attribute('0xshared', '0xstranger')).toEqual(undefined)
  })

  it('leaves blobs sent to an unknown inbox unattributed', () => {
    expect(attribute('0xelsewhere', '0xzk')).toEqual(undefined)
  })

  it("tells a block's blobs by the senders of its time, the block that ends one included", () => {
    expect(attribute('0xtaiko1', '0xanyone', 500)).toEqual('taiko')
    expect(attribute('0xtaiko1', '0xanyone', 501)).toEqual(undefined)
    expect(attribute('0xtaiko2', '0xanyone', 500)).toEqual(undefined)
    expect(attribute('0xtaiko2', '0xanyone', 501)).toEqual('taiko')
    expect(attribute('0xmorph', '0xm1', 500)).toEqual('morph')
    expect(attribute('0xmorph', '0xm1', 501)).toEqual(undefined)
    expect(attribute('0xmorph', '0xm2', 501)).toEqual('morph')
  })

  it('tells blobs not in a block yet by the senders that have not ended', () => {
    expect(attribute('0xtaiko1', '0xanyone')).toEqual(undefined)
    expect(attribute('0xtaiko2', '0xanyone')).toEqual('taiko')
    expect(attribute('0xmorph', '0xm2')).toEqual('morph')
  })
})

// Methodology: configs shaped as in packages/config, one of a rollup with its
// `daLayer` and one of a sovereign chain from Ethereum's own list, without
describe(toBlobSenders.name, () => {
  it("reads a rollup's Ethereum inbox and sequencers, lowercase", () => {
    expect(
      toBlobSenders('base', [
        {
          type: 'ethereum',
          daLayer: ProjectId.ETHEREUM,
          inbox: EthereumAddress('0xFF00000000000000000000000000000000008453'),
          sequencers: [
            EthereumAddress('0x5050F69a9786F081509234F1a7F4684b5E5b76C9'),
          ],
          sinceBlock: 1,
        },
      ]),
    ).toEqual([
      {
        projectId: 'base',
        inbox: '0xff00000000000000000000000000000000008453',
        sequencers: ['0x5050f69a9786f081509234f1a7f4684b5e5b76c9'],
        sinceBlock: 1,
        untilBlock: undefined,
      },
    ])
  })

  it("reads a sovereign chain's config, which names no DA layer", () => {
    expect(
      toBlobSenders('codex', [
        {
          type: 'ethereum',
          inbox: EthereumAddress('0x8c12f051c161c2cda736f3b3fa1c4bdd35b7922c'),
          sequencers: [
            EthereumAddress('0xb5bd290ef8ef3840cb866c7a8b7cc9e45fde3ab9'),
          ],
          sinceBlock: 20953494,
        },
      ]).map((s) => s.projectId),
    ).toEqual(['codex'])
  })

  it('leaves out projects told apart by events alone, and other DA layers', () => {
    expect(
      toBlobSenders('other', [
        {
          type: 'ethereum',
          daLayer: ProjectId.ETHEREUM,
          inbox: EthereumAddress.ZERO,
          topics: ['0x'],
          sinceBlock: 1,
        },
        {
          type: 'celestia',
          daLayer: ProjectId('celestia'),
          namespace: 'ns',
          sinceBlock: 1,
        },
      ]),
    ).toEqual([])
  })
})
