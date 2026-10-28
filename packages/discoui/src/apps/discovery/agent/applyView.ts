import {
  collectOutgoingFields,
  makeGroupNode,
} from '../panel-nodes/store/actions/group'
import { layout } from '../panel-nodes/store/actions/other'
import type { Node, State } from '../panel-nodes/store/State'
import { NODE_WIDTH } from '../panel-nodes/store/utils/constants'
import {
  getGraphProjection,
  hideItems,
  mapGraphItems,
} from '../panel-nodes/store/utils/graphProjection'
import { containerBoxes } from '../panel-nodes/store/utils/renderGraph'
import { reconcileNodeHiddenFields } from '../panel-nodes/store/utils/storage'
import {
  getNodeHeight,
  updateNodePositions,
} from '../panel-nodes/store/utils/updateNodePositions'
import { revealItems } from './reveal'

export interface AgentViewSpec {
  title: string
  note?: string
  hide: string[]
  show: string[]
  only?: string[]
  groups: { name: string; color: number; members: string[] }[]
  colors: { color: number; members: string[] }[]
  arrange: 'keep' | 'lanes'
  select?: string
}

export interface ViewReceipt {
  missing: string[]
  notHideable: string[]
  cascaded: string[]
  connectors: string[]
  visible: number
  total: number
}

export interface ViewGroup {
  id: string
  name: string
  color: number
  members: number
}

export interface AppliedView {
  nodes: Node[]
  receipt: ViewReceipt
  groups: ViewGroup[]
}

// Applies a view the way a researcher would by hand: hiding is hiding the
// references to a contract, groups are ordinary groups, lanes are positions.
// So everything the view does can be kept, saved, undone or edited further.
export function applyView(state: State, view: AgentViewSpec): AppliedView {
  const before = getGraphProjection(state.nodes)
  const released = releaseFromSetAside(
    state.nodes,
    new Set([...view.show, ...(view.only ?? [])]),
  )
  const leafIds = new Set(before.leafNodes.map((node) => node.id))
  const requested = [
    ...view.hide,
    ...view.show,
    ...(view.only ?? []),
    ...view.groups.flatMap((g) => g.members),
    ...view.colors.flatMap((c) => c.members),
    ...(view.select === undefined ? [] : [view.select]),
  ]

  const visibility = applyVisibility(released, view, leafIds)
  let nodes = visibility.nodes
  for (const { color, members } of view.colors) {
    nodes = colorLeaves(nodes, new Set(members), color)
  }
  const grouped = groupAll({ ...state, nodes }, leafIds, [
    ...view.groups.map((g) => ({ ...g, opened: true })),
    {
      name: SET_ASIDE_NAME,
      color: 0,
      members: [
        ...new Set([...setAsideBefore(released), ...visibility.notHideable]),
      ],
      opened: false,
    },
  ])
  const lanes = grouped.groups.filter((g) => g.name !== SET_ASIDE_NAME)
  nodes =
    view.arrange === 'lanes'
      ? arrangeLanes(
          state,
          grouped.nodes,
          lanes.map((g) => g.id),
        )
      : grouped.nodes

  const final = getGraphProjection(nodes)
  return {
    nodes: updateNodePositions(state, { nodes }).nodes as Node[],
    groups: legendOf(nodes, grouped.groups),
    receipt: {
      missing: [...new Set(requested.filter((id) => !leafIds.has(id)))],
      notHideable: visibility.notHideable,
      cascaded: visibility.cascaded.filter(
        (id) => !before.hiddenNodeIds.has(id),
      ),
      connectors: visibility.connectors,
      visible: final.leafNodes.filter((n) => !final.hiddenNodeIds.has(n.id))
        .length,
      total: final.leafNodes.length,
    },
  }
}

// The groups as the graph has them now: a later view can empty a group into
// its own, and a chip counts only the members the researcher can see.
export function legendOf(
  nodes: readonly Node[],
  groups: readonly ViewGroup[],
): ViewGroup[] {
  const hidden = getGraphProjection(nodes).hiddenNodeIds
  const byId = new Map(nodes.map((node) => [node.id, node]))
  return groups.flatMap((group) => {
    const node = byId.get(group.id)
    if (node === undefined) {
      return []
    }
    const members = node.subnodes.filter((m) => !hidden.has(m.id)).length
    return [{ ...group, members }]
  })
}

// Contracts nothing hides, initial ones and ones nothing references, go
// together in a closed group, so asking to hide them still clears them away.
export const SET_ASIDE_NAME = "Set aside: can't be hidden"

// Views stack, and what an earlier one set aside joins this one's group, so
// the graph has one place for what cannot be hidden.
function setAsideBefore(nodes: readonly Node[]): string[] {
  return nodes
    .filter((node) => node.name === SET_ASIDE_NAME)
    .flatMap((node) => node.subnodes.map((member) => member.id))
}

// What a view asks to see leaves the group an earlier view set it aside in,
// or it would stay folded away.
function releaseFromSetAside(
  nodes: readonly Node[],
  ids: ReadonlySet<string>,
): Node[] {
  const released: Node[] = []
  const kept = nodes.flatMap((node) => {
    if (node.name !== SET_ASIDE_NAME) return [node]
    const subnodes = node.subnodes.filter((member) => !ids.has(member.id))
    if (subnodes.length === node.subnodes.length) return [node]
    released.push(...node.subnodes.filter((member) => ids.has(member.id)))
    if (subnodes.length === 0) return []
    const fields = collectOutgoingFields(subnodes)
    return [
      {
        ...node,
        subnodes,
        fields,
        hiddenFields: reconcileNodeHiddenFields(fields, node.hiddenFields),
      },
    ]
  })
  return [...kept, ...released]
}

function applyVisibility(
  nodes: readonly Node[],
  view: AgentViewSpec,
  leafIds: ReadonlySet<string>,
) {
  let result = revealItems(nodes, view.show).nodes
  let connectors: string[] = []
  let isolatedAway: string[] = []
  if (view.only !== undefined) {
    const isolated = isolate(
      result,
      view.only.filter((id) => leafIds.has(id)),
    )
    result = isolated.nodes
    connectors = isolated.connectors
    isolatedAway = isolated.hidden
  }
  result = [...hideItems(result, new Set(view.hide))]
  const hidden = getGraphProjection(result).hiddenNodeIds
  const wanted = new Set([...view.hide, ...isolatedAway])
  return {
    nodes: result,
    connectors,
    notHideable: [...wanted].filter((id) => leafIds.has(id) && !hidden.has(id)),
    cascaded: [...hidden].filter((id) => leafIds.has(id) && !wanted.has(id)),
  }
}

// Hides everything but the given contracts and the chains of references
// that keep them visible; those chains' contracts are the connectors.
function isolate(nodes: readonly Node[], keepIds: readonly string[]) {
  const revealed = revealItems(nodes, keepIds)
  const keep = new Set([...keepIds, ...revealed.via])
  const rest = getGraphProjection(revealed.nodes)
    .leafNodes.map((node) => node.id)
    .filter((id) => !keep.has(id))
  return {
    nodes: [...hideItems(revealed.nodes, new Set(rest))],
    connectors: revealed.via,
    hidden: rest,
  }
}

function colorLeaves(
  nodes: readonly Node[],
  ids: ReadonlySet<string>,
  color: number,
): Node[] {
  return mapGraphItems(nodes, (node) =>
    ids.has(node.id) && node.color !== color ? { ...node, color } : node,
  )
}

function groupAll(
  state: State,
  leafIds: ReadonlySet<string>,
  groups: (AgentViewSpec['groups'][number] & { opened: boolean })[],
): { nodes: Node[]; groups: ViewGroup[] } {
  let nodes = [...state.nodes]
  const created: ViewGroup[] = []
  const taken = new Set<string>()
  for (const group of groups) {
    const members = group.members.filter(
      (id) => leafIds.has(id) && !taken.has(id),
    )
    for (const member of members) taken.add(member)
    nodes = colorLeaves(nodes, new Set(members), group.color)
    // A group of one still labels its contract, unlike grouping by hand.
    if (members.length === 0) continue
    const made = groupAtTop(nodes, members, group)
    nodes = made.nodes
    const { name, color } = group
    created.push({ id: made.id, name, color, members: members.length })
  }
  return { nodes, groups: created }
}

// Gathers the members into a new top-level group, out of whatever groups held
// them, and drops groups left empty. Nesting in the group an earlier view
// made would hide the new lane inside the old one.
function groupAtTop(
  nodes: readonly Node[],
  memberIds: readonly string[],
  spec: { name: string; color: number; opened: boolean },
): { nodes: Node[]; id: string } {
  const ids = new Set(memberIds)
  const found = new Map<string, Node>()
  const stack = [...nodes]
  for (let node = stack.pop(); node !== undefined; node = stack.pop()) {
    if (ids.has(node.id)) found.set(node.id, node)
    stack.push(...node.subnodes)
  }
  const isEmptyGroup = (node: Node) =>
    node.addressType === 'Group' && node.subnodes.length === 0
  const pruned = mapGraphItems(nodes, (node) => {
    if (node.subnodes.length === 0) return node
    const subnodes = node.subnodes.filter(
      (sub) => !ids.has(sub.id) && !isEmptyGroup(sub),
    )
    if (subnodes.length === node.subnodes.length) return node
    const fields = collectOutgoingFields(subnodes)
    return {
      ...node,
      subnodes,
      fields,
      hiddenFields: reconcileNodeHiddenFields(fields, node.hiddenFields),
    }
  }).filter((node) => !ids.has(node.id) && !isEmptyGroup(node))
  const members = memberIds.flatMap((id) => found.get(id) ?? [])
  const anchor = members[0]?.box ?? { x: 0, y: 0 }
  const id = `group:${crypto.randomUUID()}`
  const group = makeGroupNode(
    {
      id,
      name: spec.name,
      color: spec.color,
      opened: spec.opened,
      box: { x: anchor.x, y: anchor.y, width: NODE_WIDTH, height: NODE_WIDTH },
      members: [],
    },
    members,
  )
  return { nodes: [...pruned, group], id }
}

const COLUMN_GAP = 40
const ROW_GAP = 24
// An open group draws a header and padding around its members.
const GROUP_INSET_TOP = 50
const GROUP_INSET_SIDE = 24
const LANE_GAP = 2 * GROUP_INSET_SIDE + 64
const COLUMN_HEIGHT_MAX = 1600

interface Placeable {
  id: string
  width: number
  height: number
}

// One lane per group, left to right in the view's order, then one for what
// is visible outside them. A tall lane wraps into more columns. Members are
// placed one by one; what else is visible moves as a whole, an open group of
// the researcher's with everything in it.
function arrangeLanes(state: State, nodes: Node[], groupIds: string[]): Node[] {
  const projection = getGraphProjection(nodes)
  const isVisible = (n: Node) => !projection.hiddenNodeIds.has(n.id)
  const visible = nodes.filter(isVisible)
  const footprints = containerBoxes(nodes)
  const boxOf = (n: Node) => footprints.get(n.id) ?? n.box
  const left = Math.min(...visible.map((n) => boxOf(n).x))
  const top = Math.min(...visible.map((n) => boxOf(n).y))
  const groupSet = new Set(groupIds)
  const sized = (n: Node): Placeable => ({
    id: n.id,
    width: boxOf(n).width,
    height: footprints.get(n.id)?.height ?? getNodeHeight(n),
  })
  const lanes = [
    ...groupIds.map((id) =>
      (nodes.find((n) => n.id === id)?.subnodes ?? [])
        .filter(isVisible)
        .map(sized),
    ),
    visible.filter((n) => !groupSet.has(n.id)).map(sized),
  ]
  // Lane members and the new groups go exactly where placed; the rest moves
  // through layout, which carries an open group's members along.
  const placed = new Map<string, Point>()
  const restPlaced = new Map<string, Point>()
  let laneX = left
  for (const [index, lane] of lanes.entries()) {
    const groupId = groupIds[index]
    if (groupId !== undefined) placed.set(groupId, { x: laneX, y: top })
    const into = groupId === undefined ? restPlaced : placed
    const inset = groupId === undefined ? 0 : GROUP_INSET_TOP
    laneX += placeColumn(lane, laneX, top + inset, into) + LANE_GAP
  }
  const withMembers = mapGraphItems(nodes, (node) => {
    const place = placed.get(node.id)
    return place ? { ...node, box: { ...node.box, ...place } } : node
  })
  const rest = Object.fromEntries(restPlaced)
  return layout({ ...state, nodes: withMembers }, rest).nodes as Node[]
}

type Point = { x: number; y: number }

function placeColumn(
  lane: readonly Placeable[],
  left: number,
  top: number,
  places: Map<string, Point>,
): number {
  let x = left
  let y = top
  let columnWidth = 0
  for (const item of lane) {
    if (y > top && y + item.height > top + COLUMN_HEIGHT_MAX) {
      x += columnWidth + COLUMN_GAP
      y = top
      columnWidth = 0
    }
    places.set(item.id, { x, y })
    y += item.height + ROW_GAP
    columnWidth = Math.max(columnWidth, item.width)
  }
  return lane.length === 0 ? 0 : x - left + columnWidth
}
