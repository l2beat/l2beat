import { expect } from 'earl'
import {
  type RelationGraph,
  type RelationGraphNode,
  type RelationGraphRelation,
  relationId,
  tokenId,
} from './relationGraphModel'
import {
  buildRelationGraphScene,
  distanceToLink,
  findLinkAt,
  findNodeAt,
  linkGeometry,
  type RelationGraphScene,
  type SceneLink,
  type SceneNode,
} from './relationGraphScene'

describe(buildRelationGraphScene.name, () => {
  const graph: RelationGraph = {
    nodes: [
      graphNode('ethereum', '0xaaa', 'USDC'),
      graphNode('base', '0xbbb', 'USDC'),
      graphNode('optimism', '0xccc', 'USDT'),
    ],
    relations: [
      relation('ethereum', '0xaaa', 'base', '0xbbb', 'first'),
      relation('ethereum', '0xaaa', 'base', '0xbbb', 'second'),
      relation('ethereum', '0xaaa', 'optimism', '0xccc', 'third'),
    ],
  }

  it('positions every node and connects links to the shared node objects', () => {
    const scene = buildRelationGraphScene(graph)

    expect(scene.nodes.length).toEqual(3)
    for (const node of scene.nodes) {
      expect(Number.isFinite(node.x)).toEqual(true)
      expect(Number.isFinite(node.y)).toEqual(true)
    }
    for (const link of scene.links) {
      // Reference equality matters: dragging a node must move its links.
      expect(found(scene.nodeById.get(link.source.data.id))).toExactlyEqual(
        link.source,
      )
      expect(found(scene.nodeById.get(link.target.data.id))).toExactlyEqual(
        link.target,
      )
    }
  })

  it('curves parallel relations apart and keeps single relations straight', () => {
    const scene = buildRelationGraphScene(graph)

    const parallel = scene.links.filter(
      (link) => link.target.data.id === tokenId('base', '0xbbb'),
    )
    expect(parallel.map((link) => link.curve).sort((a, b) => a - b)).toEqual([
      -8, 8,
    ])
    const single = scene.links.find(
      (link) => link.target.data.id === tokenId('optimism', '0xccc'),
    )
    expect(single?.curve).toEqual(0)
  })

  it('labels the cluster with its most common deployed symbol', () => {
    const scene = buildRelationGraphScene(graph)

    expect(scene.clusterLabels.map((label) => label.text)).toEqual(['USDC'])
    expect(scene.clusterLabels[0]?.nodes.length).toEqual(3)
  })

  it('attaches a node without relations to the cluster whose most common abstract token matches, without an edge', () => {
    const withoutRelations = graphNode('arbitrum', '0xddd', 'USDC.e', {
      abstractTokenId: 'AT-USDC',
      hasRelations: false,
    })
    const scene = buildRelationGraphScene({
      nodes: [
        graphNode('ethereum', '0xaaa', 'USDC', { abstractTokenId: 'AT-USDC' }),
        graphNode('base', '0xbbb', 'USDC', { abstractTokenId: 'AT-USDC' }),
        // A dissenting assignment inside the cluster is outvoted.
        graphNode('optimism', '0xccc', 'USDC', {
          abstractTokenId: 'AT-OTHER',
        }),
        withoutRelations,
      ],
      relations: [
        relation('ethereum', '0xaaa', 'base', '0xbbb', 'first'),
        relation('ethereum', '0xaaa', 'optimism', '0xccc', 'second'),
      ],
    })

    expect(scene.clusterLabels.length).toEqual(1)
    expect(
      scene.clusterLabels[0]?.nodes.some(
        (node) => node.data.id === withoutRelations.id,
      ),
    ).toEqual(true)
    expect(
      scene.links.some(
        (link) =>
          link.source.data.id === withoutRelations.id ||
          link.target.data.id === withoutRelations.id,
      ),
    ).toEqual(false)
  })

  it('keeps a node without relations whose abstract token claims no cluster as its own cluster', () => {
    const scene = buildRelationGraphScene({
      nodes: [
        graphNode('ethereum', '0xaaa', 'USDC', { abstractTokenId: 'AT-USDC' }),
        graphNode('base', '0xbbb', 'USDC', { abstractTokenId: 'AT-USDC' }),
        graphNode('polygon', '0xeee', 'DAI', {
          abstractTokenId: 'AT-OTHER',
          hasRelations: false,
        }),
      ],
      relations: [relation('ethereum', '0xaaa', 'base', '0xbbb', 'first')],
    })

    expect(scene.clusterLabels.map((label) => label.text)).toEqual([
      'USDC',
      'DAI',
    ])
    expect(scene.clusterLabels[1]?.nodes.length).toEqual(1)
  })

  it('prefers the largest cluster when several share the most common abstract token', () => {
    const withoutRelations = graphNode('polygon', '0xfff', 'USDC', {
      abstractTokenId: 'AT-USDC',
      hasRelations: false,
    })
    const scene = buildRelationGraphScene({
      nodes: [
        graphNode('ethereum', '0xaaa', 'USDC', { abstractTokenId: 'AT-USDC' }),
        graphNode('base', '0xbbb', 'USDC', { abstractTokenId: 'AT-USDC' }),
        graphNode('arbitrum', '0xccc', 'USDC', {
          abstractTokenId: 'AT-USDC',
        }),
        graphNode('optimism', '0xddd', 'USDC', {
          abstractTokenId: 'AT-USDC',
        }),
        graphNode('linea', '0xeee', 'USDC', { abstractTokenId: 'AT-USDC' }),
        withoutRelations,
      ],
      relations: [
        relation('ethereum', '0xaaa', 'base', '0xbbb', 'first'),
        relation('ethereum', '0xaaa', 'arbitrum', '0xccc', 'second'),
        relation('optimism', '0xddd', 'linea', '0xeee', 'third'),
      ],
    })

    // Clusters are sorted largest first; the three-node cluster won the
    // node without relations and shows four.
    expect(
      scene.clusterLabels.map((label) =>
        label.nodes.map((node) => node.data.id),
      ),
    ).toEqual([
      [
        tokenId('arbitrum', '0xccc'),
        tokenId('base', '0xbbb'),
        tokenId('ethereum', '0xaaa'),
        withoutRelations.id,
      ],
      [tokenId('linea', '0xeee'), tokenId('optimism', '0xddd')],
    ])
  })
})

describe(findNodeAt.name, () => {
  const near = sceneNode('ethereum', '0xaaa', 0, 0)
  const far = sceneNode('base', '0xbbb', 10, 0)
  const scene = sceneWith([near, far], [])

  it('returns the nearest node within the radius', () => {
    expect(found(findNodeAt(scene, 2, 1, 5))).toExactlyEqual(near)
    expect(found(findNodeAt(scene, 7, 0, 5))).toExactlyEqual(far)
  })

  it('returns undefined when every node is out of reach', () => {
    expect(findNodeAt(scene, 2, 1, 1)).toEqual(undefined)
  })
})

describe(findLinkAt.name, () => {
  const source = sceneNode('ethereum', '0xaaa', 0, 0)
  const target = sceneNode('base', '0xbbb', 100, 0)
  const straight = sceneLink(source, target, 'straight', 0)
  const curved = sceneLink(source, target, 'curved', 16)
  const scene = sceneWith([source, target], [straight, curved])

  it('picks the closest link within the tolerance', () => {
    // The curved link's control point sits 16 world units off the straight
    // line, which puts its midpoint 8 units off it.
    expect(found(findLinkAt(scene, 50, 0, 2))).toExactlyEqual(straight)
    expect(found(findLinkAt(scene, 50, 8, 2))).toExactlyEqual(curved)
    expect(findLinkAt(scene, 50, 20, 5)).toEqual(undefined)
  })

  it('ignores excluded links', () => {
    // Tolerance 10 reaches both links from the query point; exclusion is
    // what removes them, not distance.
    expect(found(findLinkAt(scene, 50, 0, 10))).toExactlyEqual(straight)
    expect(
      found(findLinkAt(scene, 50, 0, 10, new Set([straight.id]))),
    ).toExactlyEqual(curved)
    expect(
      findLinkAt(scene, 50, 0, 10, new Set([straight.id, curved.id])),
    ).toEqual(undefined)
  })
})

describe(distanceToLink.name, () => {
  it('is exact for straight links', () => {
    const link = sceneLink(
      sceneNode('ethereum', '0xaaa', 0, 0),
      sceneNode('base', '0xbbb', 100, 0),
      'straight',
      0,
    )
    expect(distanceToLink(linkGeometry(link), 50, 7)).toEqual(7)
    expect(distanceToLink(linkGeometry(link), -3, 0)).toEqual(3)
  })
})

function found<T>(value: T | undefined): T {
  if (value === undefined) throw new Error('Expected the hit test to hit')
  return value
}

function graphNode(
  chain: string,
  address: string,
  symbol: string,
  options: { abstractTokenId?: string; hasRelations?: boolean } = {},
): RelationGraphNode {
  return {
    id: tokenId(chain, address),
    chain,
    address,
    symbol,
    abstractTokenId: options.abstractTokenId ?? null,
    isDeployed: true,
    hasRelations: options.hasRelations ?? true,
  }
}

function relation(
  tokenAChain: string,
  tokenAAddress: string,
  tokenBChain: string,
  tokenBAddress: string,
  plugin: string,
): RelationGraphRelation {
  return {
    tokenAChain,
    tokenAAddress,
    tokenBChain,
    tokenBAddress,
    plugin,
    bridgeType: 'lockAndMint',
    lockedToken: 'A',
    isConflict: false,
  }
}

function sceneNode(
  chain: string,
  address: string,
  x: number,
  y: number,
): SceneNode {
  return {
    data: graphNode(chain, address, 'TOKEN'),
    label: 'TOKEN',
    x,
    y,
  }
}

function sceneLink(
  source: SceneNode,
  target: SceneNode,
  plugin: string,
  curve: number,
): SceneLink {
  const link = relation(
    source.data.chain,
    source.data.address,
    target.data.chain,
    target.data.address,
    plugin,
  )
  return { relation: link, id: relationId(link), source, target, curve }
}

function sceneWith(nodes: SceneNode[], links: SceneLink[]): RelationGraphScene {
  return {
    nodes,
    links,
    clusterLabels: [],
    nodeById: new Map(nodes.map((node) => [node.data.id, node])),
    width: 0,
    height: 0,
  }
}
