import { expect } from 'earl'
import type { Box, Field, Node, State } from '../State'
import { applyUndoablePartial } from '../store'
import { emptyHistoryState } from '../utils/history'
import { perimeterLayout } from '../utils/perimeterLayout'
import { buildRenderGraph } from '../utils/renderGraph'
import { computeSecurityPerimeter } from '../utils/securityPerimeter'
import { persistNodeLayout } from '../utils/storage'
import { redo, undo } from './history'
import { type AutoGroup, loadNodes } from './loadNodes'
import { layout } from './other'

describe(loadNodes.name, () => {
  const originalLocalStorage = globalThis.localStorage
  const stored = new Map<string, string>()

  beforeEach(() => {
    stored.clear()
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => stored.get(key) ?? null,
        setItem: (key: string, value: string) => {
          stored.set(key, value)
        },
        removeItem: (key: string) => {
          stored.delete(key)
        },
      },
    })
  })

  afterEach(() => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: originalLocalStorage,
    })
  })

  it('keeps mixed shared modules expanded on fresh perimeter layout while collapsing non-critical modules', () => {
    const nodes = [
      makeNode('eth:core', true, ['eth:sharedCrit', 'eth:nonCritModule']),
      makeNode('eth:sharedCrit', true, ['eth:sharedSafe']),
      makeNode('eth:sharedSafe', false),
      makeNode('eth:nonCritModule', false, ['eth:nonCritLeaf']),
      makeNode('eth:nonCritLeaf', false),
    ]
    const autoGroups: AutoGroup[] = [
      {
        id: 'group:shared:shared-mixed',
        name: 'shared-mixed',
        memberIds: ['eth:sharedCrit', 'eth:sharedSafe'],
      },
      {
        id: 'group:shared:shared-plain',
        name: 'shared-plain',
        memberIds: ['eth:nonCritModule', 'eth:nonCritLeaf'],
      },
    ]

    const result = loadNodes(makeState(), 'project', nodes, autoGroups)
    const loadedNodes = result.nodes ?? []
    const graph = buildRenderGraph(loadedNodes)
    const zones = computeSecurityPerimeter(graph.nodes, graph.hidden)

    expect(zones.length).toEqual(1)
    expect(zones[0]?.count).toEqual(2)
    expect(
      loadedNodes.some((node) => node.id === 'group:shared:shared-mixed'),
    ).toEqual(false)
    expect(
      loadedNodes.some((node) => node.id === 'group:shared:shared-plain'),
    ).toEqual(true)
  })

  it('frames the security perimeter inside the initial viewport on fresh load', () => {
    const upstreamChain = Array.from({ length: 6 }, (_, i) =>
      makeNode(`eth:up${i}`, false, [i === 5 ? 'eth:core' : `eth:up${i + 1}`]),
    )
    const downstreamStack = Array.from({ length: 12 }, (_, i) =>
      makeNode(`eth:down${i}`, false),
    )
    const core = makeNode(
      'eth:core',
      true,
      downstreamStack.map((node) => node.id),
    )
    const nodes = [...upstreamChain, core, ...downstreamStack]
    const viewport = {
      getBoundingClientRect: () => ({ width: 1000, height: 800 }),
    } as HTMLElement

    const result = loadNodes(makeState(viewport), 'project', nodes, [])
    const loadedNodes = result.nodes ?? []
    const transform = result.transform ?? { offsetX: 0, offsetY: 0, scale: 1 }
    const graph = buildRenderGraph(loadedNodes)
    const zones = computeSecurityPerimeter(graph.nodes, graph.hidden)

    expect(zones.length).toEqual(1)
    const visibleInViewport = graph.nodes.filter((node) =>
      intersectsViewport(node.box, transform, 1000, 800),
    )
    expect(visibleInViewport.some((node) => node.id === 'eth:core')).toEqual(
      true,
    )
  })

  it('frames a restored saved layout whose perimeter starts offscreen while preserving node positions', () => {
    const upstreamChain = Array.from({ length: 6 }, (_, i) =>
      makeNode(`eth:up${i}`, false, [i === 5 ? 'eth:core' : `eth:up${i + 1}`]),
    )
    const core = makeNode('eth:core', true)
    const nodes = [...upstreamChain, core]
    const viewport = {
      getBoundingClientRect: () => ({ width: 1000, height: 800 }),
    } as HTMLElement

    const first = loadNodes(makeState(viewport), 'project', nodes, [])
    const firstState = { ...makeState(viewport), ...first }
    persistNodeLayout(firstState)
    const savedCoreBox = firstState.nodes.find((n) => n.id === 'eth:core')?.box

    const reloaded = loadNodes(makeState(viewport), 'project', nodes, [])
    const reloadedNodes = reloaded.nodes ?? []
    const reloadedCore = reloadedNodes.find((n) => n.id === 'eth:core')
    const transform = reloaded.transform ?? { offsetX: 0, offsetY: 0, scale: 1 }

    expect(reloadedCore?.box).toEqual(savedCoreBox)
    expect(
      reloadedCore !== undefined &&
        intersectsViewport(reloadedCore.box, transform, 1000, 800),
    ).toEqual(true)
  })

  it('keeps mixed shared modules expanded on fresh load even when perimeter display starts off', () => {
    const nodes = [
      makeNode('eth:core', true, ['eth:sharedCrit']),
      makeNode('eth:sharedCrit', true, ['eth:sharedSafe']),
      makeNode('eth:sharedSafe', false),
    ]
    const autoGroups: AutoGroup[] = [
      {
        id: 'group:shared:shared-mixed',
        name: 'shared-mixed',
        memberIds: ['eth:sharedCrit', 'eth:sharedSafe'],
      },
    ]
    const state: State = {
      ...makeState(),
      userPreferences: {
        ...makeState().userPreferences,
        showSecurityPerimeter: false,
      },
    }

    const result = loadNodes(state, 'project', nodes, autoGroups)
    const loadedNodes = result.nodes ?? []
    const graph = buildRenderGraph(loadedNodes)
    const zones = computeSecurityPerimeter(graph.nodes, graph.hidden)

    expect(
      loadedNodes.some((node) => node.id === 'group:shared:shared-mixed'),
    ).toEqual(false)
    expect(zones.length).toEqual(1)
    expect(zones[0]?.count).toEqual(2)
  })

  it('frames the perimeter when applying whole-graph Perimeter layout', () => {
    const upstreamChain = Array.from({ length: 6 }, (_, i) =>
      makeNode(`eth:up${i}`, false, [i === 5 ? 'eth:core' : `eth:up${i + 1}`]),
    )
    const core = makeNode('eth:core', true)
    const nodes = [...upstreamChain, core]
    const viewport = {
      getBoundingClientRect: () => ({ width: 1000, height: 800 }),
    } as HTMLElement
    const state = { ...makeState(viewport), nodes }
    const edges = nodes.flatMap((node) =>
      node.fields.map((field) => ({
        source: node.id,
        target: field.target,
        fieldName: field.name,
      })),
    )

    const locations = perimeterLayout(nodes, true, edges)
    const updated = layout(state, locations, { focusPerimeter: true })
    const movedCore = updated.nodes?.find((n) => n.id === 'eth:core')
    const transform = updated.transform ?? state.transform

    expect(
      movedCore !== undefined &&
        intersectsViewport(movedCore.box, transform, 1000, 800),
    ).toEqual(true)
  })

  it('frames a restored saved layout whose offscreen critical node has a suppressed perimeter enclosure', () => {
    const core = makeNode('eth:core', true)
    const blocker = makeNode('eth:blocker', false)
    const viewport = {
      getBoundingClientRect: () => ({ width: 540, height: 800 }),
    } as HTMLElement

    // Save both nodes overlapping at x=2000 (offscreen for a 540px panel)
    // so computeSecurityPerimeter suppresses the zone around eth:core.
    const savedState: State = {
      ...makeState(viewport),
      projectId: 'project',
      nodes: [
        { ...core, box: { x: 2000, y: 100, width: 200, height: 80 } },
        { ...blocker, box: { x: 2040, y: 110, width: 120, height: 60 } },
      ],
    }
    persistNodeLayout(savedState)

    const reloaded = loadNodes(
      makeState(viewport),
      'project',
      [core, blocker],
      [],
    )
    const loadedNodes = reloaded.nodes ?? []
    const graph = buildRenderGraph(loadedNodes)
    const zones = computeSecurityPerimeter(graph.nodes, graph.hidden)
    const reloadedCore = loadedNodes.find((n) => n.id === 'eth:core')
    const transform = reloaded.transform ?? { offsetX: 0, offsetY: 0, scale: 1 }

    expect(zones).toEqual([])
    expect(
      reloadedCore !== undefined &&
        intersectsViewport(reloadedCore.box, transform, 540, 800),
    ).toEqual(true)
  })

  it('fits a wide perimeter chain in a narrow panel down to MIN_ZOOM', () => {
    const chain = Array.from({ length: 12 }, (_, i) =>
      makeNode(`eth:c${i}`, true, i === 11 ? [] : [`eth:c${i + 1}`]),
    )
    const viewport = {
      getBoundingClientRect: () => ({ width: 540, height: 800 }),
    } as HTMLElement
    const state = { ...makeState(viewport), nodes: chain }
    const edges = chain.flatMap((node) =>
      node.fields.map((field) => ({
        source: node.id,
        target: field.target,
        fieldName: field.name,
      })),
    )

    const locations = perimeterLayout(chain, true, edges)
    const updated = layout(state, locations, { focusPerimeter: true })
    const transform = updated.transform ?? state.transform
    const graph = buildRenderGraph(updated.nodes ?? [])
    const zones = computeSecurityPerimeter(graph.nodes, graph.hidden)

    expect(zones.length).toEqual(1)
    const zone = zones[0]
    expect(
      zone !== undefined &&
        containsBoxInViewport(zone.box, transform, 540, 800),
    ).toEqual(true)
  })

  it('restores the camera on undo/redo for Perimeter layout without rewinding pans after node-only layouts', () => {
    const upstream = Array.from({ length: 4 }, (_, i) =>
      makeNode(`eth:up${i}`, false, [i === 3 ? 'eth:core' : `eth:up${i + 1}`]),
    )
    const core = makeNode('eth:core', true)
    const initialNodes = [...upstream, core].map((node, index) => ({
      ...node,
      box: { ...node.box, x: index * 100, y: 0 },
    }))
    const viewport = {
      getBoundingClientRect: () => ({ width: 540, height: 800 }),
    } as HTMLElement
    const initialTransform = { offsetX: 0, offsetY: 0, scale: 1 }
    const edges = initialNodes.flatMap((node) =>
      node.fields.map((field) => ({
        source: node.id,
        target: field.target,
        fieldName: field.name,
      })),
    )

    let state: State = {
      ...makeState(viewport),
      nodes: initialNodes,
      transform: initialTransform,
    }
    const runUndoable = (partial: Partial<State>) => {
      state = { ...state, ...applyUndoablePartial(state, partial) }
    }

    // Perimeter layout moves the camera: undo/redo restore it.
    runUndoable(
      layout(state, perimeterLayout(initialNodes, true, edges), {
        focusPerimeter: true,
      }),
    )
    const perimeterTransform = state.transform
    expect(perimeterTransform).not.toEqual(initialTransform)

    state = { ...state, ...undo(state) }
    expect(state.transform).toEqual(initialTransform)

    state = { ...state, ...redo(state) }
    expect(state.transform).toEqual(perimeterTransform)

    // Node-only layout returns the full state with an unchanged transform:
    // a later pan must survive undo.
    runUndoable(layout(state, { 'eth:core': { x: 900, y: 200 } }))
    const pannedTransform = { offsetX: -250, offsetY: 120, scale: 0.75 }
    state = { ...state, transform: pannedTransform }

    state = { ...state, ...undo(state) }
    expect(state.transform).toEqual(pannedTransform)
  })
})

function intersectsViewport(
  box: Box,
  transform: State['transform'],
  width: number,
  height: number,
): boolean {
  const left = box.x * transform.scale + transform.offsetX
  const top = box.y * transform.scale + transform.offsetY
  const right = left + box.width * transform.scale
  const bottom = top + box.height * transform.scale
  return right > 0 && left < width && bottom > 0 && top < height
}

function containsBoxInViewport(
  box: Box,
  transform: State['transform'],
  width: number,
  height: number,
): boolean {
  const left = box.x * transform.scale + transform.offsetX
  const top = box.y * transform.scale + transform.offsetY
  const right = left + box.width * transform.scale
  const bottom = top + box.height * transform.scale
  return left >= 0 && top >= 0 && right <= width && bottom <= height
}

function makeState(viewportContainer?: HTMLElement): State {
  return {
    projectId: '',
    nodes: [],
    selected: [],
    history: emptyHistoryState(),
    userPreferences: {
      enableDimming: true,
      hideLargeArrays: true,
      highlightOverlapping: true,
      showSecurityPerimeter: true,
    },
    transform: { offsetX: 0, offsetY: 0, scale: 1 },
    viewportContainer,
    tool: 'select',
    input: {
      shiftPressed: false,
      spacePressed: false,
      ctrlPressed: false,
      lmbPressed: false,
      mmbPressed: false,
      mouseStartX: 0,
      mouseStartY: 0,
      mouseX: 0,
      mouseY: 0,
    },
    positionsBeforeMove: {},
    loaded: false,
    loadCount: 0,
  }
}

function makeNode(
  id: string,
  isCritical: boolean,
  targets: string[] = [],
): Node {
  const fields: Field[] = targets.map((target, index) => ({
    name: `ref${index}`,
    target,
    box: { x: 0, y: 0, width: 0, height: 0 },
    connection: {
      from: { direction: 'left', x: 0, y: 0 },
      to: { direction: 'left', x: 0, y: 0 },
    },
  }))
  return {
    id,
    address: id,
    isInitial: isCritical,
    isCritical,
    hasTemplate: false,
    addressType: 'Contract',
    name: id,
    fields,
    hiddenFields: [],
    compressedRows: [],
    box: { x: 0, y: 0, width: 200, height: 80 },
    color: 0,
    hueShift: 0,
    data: null,
    isReachable: true,
    opened: false,
    subnodes: [],
  }
}
