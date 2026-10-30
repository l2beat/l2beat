import { expect } from 'earl'
import { edgeKey, resolvePathEdges, toDrawn } from './pathEdges'

describe(resolvePathEdges.name, () => {
  it('takes the field of the controlled contract pointing back at its controller', () => {
    const links = new Set([
      edgeKey('bridge', 'proxyAdmin'),
      edgeKey('proxyAdmin', 'executor'),
      edgeKey('executor', 'council'),
      edgeKey('council', 'executor'),
    ])
    const edges = resolvePathEdges(
      [['council', 'executor', 'proxyAdmin', 'bridge']],
      links,
    )
    expect([...edges]).toEqual([
      edgeKey('executor', 'council'),
      edgeKey('proxyAdmin', 'executor'),
      edgeKey('bridge', 'proxyAdmin'),
    ])
  })

  it('falls back to the forward link and skips hops with no link', () => {
    const links = new Set([edgeKey('governor', 'timelock')])
    const edges = resolvePathEdges([['governor', 'timelock', 'outbox']], links)
    expect([...edges]).toEqual([edgeKey('governor', 'timelock')])
  })
})

describe(toDrawn.name, () => {
  it('lights up the closed group a contract is drawn as', () => {
    const drawnBy = new Map([
      ['executor', { id: 'group' }],
      ['council', { id: 'council' }],
    ])
    const drawn = toDrawn(
      new Set(['executor', 'council']),
      new Set([edgeKey('executor', 'council')]),
      drawnBy,
    )
    expect([...drawn.nodes]).toEqual(['group', 'council'])
    expect(drawn.edges.has(edgeKey('group', 'council'))).toEqual(true)
  })
})
