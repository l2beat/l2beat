import { expect } from 'earl'
import {
  drawRelationGraph,
  getLinkStyle,
  getNodeRingOpacity,
  nodeVisualScreenScale,
  type RelationGraphViewState,
} from './relationGraphCanvas'
import {
  RELATION_COLORS,
  type RelationGraphFocus,
  type RelationGraphNode,
  type RelationGraphRelation,
  type RelationGraphSelection,
  relationId,
  tokenId,
} from './relationGraphModel'
import type {
  RelationGraphScene,
  SceneLink,
  SceneNode,
} from './relationGraphScene'

describe(drawRelationGraph.name, () => {
  it('draws the chain on a second line below the token symbol', () => {
    const node = sceneNode('unichain', '0xaaa')
    node.x = 50
    node.y = 50
    const drawnText: { text: string; x: number; y: number }[] = []

    drawRelationGraph(recordingContext(drawnText), sceneWith(node), viewState())

    expect(drawnText).toEqual([
      { text: 'TOKEN', x: 50, y: 28 },
      { text: 'unichain', x: 50, y: 38 },
    ])
  })

  it('does not draw token or chain labels at overview zoom', () => {
    const node = sceneNode('unichain', '0xaaa')
    node.x = 50
    node.y = 50
    const drawnText: { text: string; x: number; y: number }[] = []
    const view = viewState()
    view.camera.k = 0.5

    drawRelationGraph(recordingContext(drawnText), sceneWith(node), view)

    expect(drawnText).toEqual([])
  })

  it('keeps the cluster heading above a focused symbol when zoomed out', () => {
    const node = sceneNode('unichain', '0xaaa')
    node.x = 50
    node.y = 50
    const scene = sceneWith(node)
    scene.clusterLabels = [{ text: 'cluster', nodes: [node] }]
    const view = viewState()
    view.camera.k = 0.5
    view.focus = {
      nodeIds: new Set([node.data.id]),
      relationIds: new Set(),
    }
    const drawnText: { text: string; x: number; y: number }[] = []

    drawRelationGraph(recordingContext(drawnText), scene, view)

    const symbol = drawnText.find((entry) => entry.text === 'TOKEN')
    const cluster = drawnText.find((entry) => entry.text === 'cluster')
    if (symbol === undefined || cluster === undefined) {
      throw new Error('Expected both symbol and cluster labels to be drawn')
    }
    expect(cluster.y <= symbol.y - 8).toEqual(true)
  })
})

describe(getLinkStyle.name, () => {
  const link = sceneLink('lockAndMint', false)

  it('draws unremarkable links thin and semi-transparent', () => {
    expect(getLinkStyle(link, styleInputs({}))).toEqual({
      color: RELATION_COLORS.lockAndMint,
      opacity: 0.55,
      width: 1.4,
    })
  })

  it('emphasizes the hovered link and links of a hovered node', () => {
    const hoveredDirectly = getLinkStyle(
      link,
      styleInputs({ hovered: { type: 'relation', id: link.id } }),
    )
    const hoveredViaEndpoint = getLinkStyle(
      link,
      styleInputs({ hovered: { type: 'node', id: link.source.data.id } }),
    )

    for (const style of [hoveredDirectly, hoveredViaEndpoint]) {
      expect(style.opacity).toEqual(0.95)
      expect(style.width).toEqual(3)
    }
  })

  it('emphasizes focused links and fades everything else', () => {
    const focus: RelationGraphFocus = {
      nodeIds: new Set(),
      relationIds: new Set([link.id]),
    }

    expect(getLinkStyle(link, styleInputs({ focus }))).toEqual({
      color: RELATION_COLORS.lockAndMint,
      opacity: 0.95,
      width: 2.8,
    })
    expect(
      getLinkStyle(
        link,
        styleInputs({ focus: { nodeIds: new Set(), relationIds: new Set() } }),
      ).opacity,
    ).toEqual(0.08)
  })

  it('recolors links by conflict state when anomalies are highlighted', () => {
    expect(
      getLinkStyle(
        sceneLink('lockAndMint', true),
        styleInputs({ highlightAnomalies: true }),
      ),
    ).toEqual({ color: RELATION_COLORS.conflict, opacity: 0.95, width: 2.2 })
    expect(
      getLinkStyle(link, styleInputs({ highlightAnomalies: true })),
    ).toEqual({ color: RELATION_COLORS.muted, opacity: 0.22, width: 1.4 })
  })
})

describe(getNodeRingOpacity.name, () => {
  const node = sceneNode('ethereum', '0xaaa')

  it('shows the ring for hovered and selected nodes', () => {
    expect(
      getNodeRingOpacity(
        node,
        styleInputs({ hovered: { type: 'node', id: node.data.id } }),
      ),
    ).toEqual(0.8)
    expect(
      getNodeRingOpacity(
        node,
        styleInputs({ selection: { type: 'node', id: node.data.id } }),
      ),
    ).toEqual(1)
  })

  it('shows a softer ring on the endpoints of a selected relation', () => {
    expect(
      getNodeRingOpacity(
        node,
        styleInputs({
          selection: { type: 'relation', id: 'some:relation' },
          focus: {
            nodeIds: new Set([node.data.id]),
            relationIds: new Set(['some:relation']),
          },
        }),
      ),
    ).toEqual(0.7)
  })

  it('hides the ring otherwise', () => {
    expect(getNodeRingOpacity(node, styleInputs({}))).toEqual(0)
  })
})

describe(nodeVisualScreenScale.name, () => {
  it('scales nodes with the world until they reach constant screen size', () => {
    expect(nodeVisualScreenScale(0.5)).toEqual(0.5)
    expect(nodeVisualScreenScale(1.2)).toEqual(1.2)
    expect(nodeVisualScreenScale(4)).toEqual(1.2)
  })
})

function styleInputs(overrides: {
  hovered?: RelationGraphSelection
  selection?: RelationGraphSelection
  focus?: RelationGraphFocus
  highlightAnomalies?: boolean
}) {
  return {
    hovered: overrides.hovered,
    selection: overrides.selection,
    focus: overrides.focus,
    highlightAnomalies: overrides.highlightAnomalies ?? false,
  }
}

function sceneNode(chain: string, address: string): SceneNode {
  const data: RelationGraphNode = {
    id: tokenId(chain, address),
    chain,
    address,
    symbol: 'TOKEN',
    isDeployed: true,
  }
  return { data, label: 'TOKEN', x: 0, y: 0 }
}

function sceneWith(node: SceneNode): RelationGraphScene {
  return {
    nodes: [node],
    links: [],
    clusterLabels: [],
    nodeById: new Map([[node.data.id, node]]),
    width: 100,
    height: 100,
  }
}

function viewState(): RelationGraphViewState {
  return {
    width: 100,
    height: 100,
    camera: { x: 0, y: 0, k: 1 },
    hovered: undefined,
    selection: undefined,
    focus: undefined,
    highlightAnomalies: false,
    deletedRelationIds: new Set(),
    theme: {
      background: '#fff',
      foreground: '#000',
      fontFamily: 'sans-serif',
    },
  }
}

function recordingContext(
  drawnText: { text: string; x: number; y: number }[],
): CanvasRenderingContext2D {
  return {
    clearRect() {},
    beginPath() {},
    arc() {},
    fill() {},
    stroke() {},
    strokeText() {},
    fillText(text: string, x: number, y: number) {
      drawnText.push({ text, x, y })
    },
  } as unknown as CanvasRenderingContext2D
}

function sceneLink(
  bridgeType: RelationGraphRelation['bridgeType'],
  isConflict: boolean,
): SceneLink {
  const relation: RelationGraphRelation = {
    tokenAChain: 'ethereum',
    tokenAAddress: '0xaaa',
    tokenBChain: 'base',
    tokenBAddress: '0xbbb',
    plugin: 'plugin',
    bridgeType,
    lockedToken: 'A',
    isConflict,
  }
  return {
    relation,
    id: relationId(relation),
    source: sceneNode('ethereum', '0xaaa'),
    target: sceneNode('base', '0xbbb'),
    curve: 0,
  }
}
