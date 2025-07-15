import { stackAutoLayout } from '../../controls/StackLayoutButton'
import type { Node, State } from '../State'
import {
  BOTTOM_PADDING,
  FIELD_HEIGHT,
  HEADER_HEIGHT,
  HIDDEN_FIELDS_FOOTER_HEIGHT,
  NODE_WIDTH,
} from '../utils/constants'
import { recallNodeLayout, type StoredNodeLayout } from '../utils/storage'
import { layout } from './other'

export function loadNodes(
  state: State,
  projectId: string,
  nodes: Node[],
): Partial<State> {
  const toAdd: Node[] = nodes.filter(
    (x) => !state.nodes.some((y) => x.id === y.id),
  )
  const existing: Node[] = state.nodes.map((node) => {
    const newNode = nodes.find((x) => x.id === node.id)
    return newNode ? { ...newNode, box: node.box, color: node.color } : node
  })
  toAdd.push(...createUnknownNodes([...toAdd, ...existing]))

  const saved = recallNodeLayout(projectId)
  const added = toAdd.map((node) => {
    const hiddenFields = combinedHiddenFields(node, saved)

    const box = saved?.locations[node.id]
    const x = box?.x ?? 0
    const y = box?.y ?? 0
    const width = box?.width ?? NODE_WIDTH
    const hiddenFieldsHeight =
      hiddenFields.length > 0 ? HIDDEN_FIELDS_FOOTER_HEIGHT : 0
    const height =
      HEADER_HEIGHT +
      (node.fields.length - hiddenFields.length) * FIELD_HEIGHT +
      BOTTOM_PADDING +
      hiddenFieldsHeight
    const savedColor = saved?.colors?.[node.id]
    const color = typeof savedColor === 'number' ? savedColor : node.color

    return {
      ...node,
      color,
      hiddenFields,
      box: { x, y, width, height: height },
    }
  })

  const allNodes = existing.concat(added)

  const unknownNodeIds = state.userPreferences.hideUnknownOnLoad
    ? allNodes
        .filter((node) => node.addressType === 'Unknown')
        .map((node) => node.id)
    : []

  const hiddenNodes = [...new Set([...state.hidden, ...unknownNodeIds])]
  const visibleNodes = allNodes.filter((node) => !hiddenNodes.includes(node.id))

  return layout(
    {
      ...state,
      hidden: hiddenNodes,
      nodes: allNodes,
      projectId,
    },
    stackAutoLayout(visibleNodes),
  )
}

function createUnknownNodes(nodes: Node[]): Node[] {
  const unknownIds = new Set<string>()
  const knownIds = new Set(nodes.map((node) => node.id))

  for (const node of nodes) {
    for (const field of node.fields) {
      if (!knownIds.has(field.target)) {
        unknownIds.add(field.target)
      }
    }
  }

  return [...unknownIds].map(idToUnknown)
}

function idToUnknown(id: string): Node {
  // TODO: better address treatment
  const address = id.split(':')[1] as string
  const name = `Unknown ${address.slice(0, 6)}…${address.slice(-4)}`
  return {
    id,
    address,
    isInitial: false,
    hasTemplate: false,
    addressType: 'Unknown',
    name,
    box: { x: 0, y: 0, width: 0, height: 0 },
    color: 0,
    hueShift: 0,
    fields: [],
    hiddenFields: [],
    data: null,
  }
}

function combinedHiddenFields(
  node: Node,
  saved: StoredNodeLayout | undefined,
): string[] {
  const recalledHiddenFields = saved?.hiddenFields?.[node.id] ?? []
  const defaultHiddenFields = node.hiddenFields
  return [...new Set([...recalledHiddenFields, ...defaultHiddenFields])]
}
