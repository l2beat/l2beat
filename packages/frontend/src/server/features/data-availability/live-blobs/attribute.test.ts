import { expect } from 'earl'
import { createAttribute } from './attribute'

// Methodology: a few projects behind made-up inboxes and sequencers, each case
// one way the backend's rule tells (or fails to tell) whose a blob is.
describe(createAttribute.name, () => {
  const attribute = createAttribute([
    { projectId: 'base', inbox: '0xbase', sequencers: [] },
    // ZK stack chains share the inbox and differ by who sends
    { projectId: 'zksync', inbox: '0xshared', sequencers: ['0xzk'] },
    { projectId: 'abstract', inbox: '0xshared', sequencers: ['0xabs'] },
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
})
