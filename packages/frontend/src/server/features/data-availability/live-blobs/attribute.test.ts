import { expect } from 'earl'
import { createAttribute } from './attribute'

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
