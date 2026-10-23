import { useQuery } from '@tanstack/react-query'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import type {
  Field as ApiField,
  ApiProjectResponse,
  FieldValue,
} from '../../../api/types'
import { ErrorState } from '../../../components/ErrorState'
import { LoadingState } from '../../../components/LoadingState'
import { useProjectQueryOptions } from '../hooks/projectQuery'
import { usePanelStore } from '../store/panel-store'
import { Controls } from './controls/Controls'
import type { ArrangeNodes, AutoGroup } from './store/actions/loadNodes'
import type { Field, Node, State } from './store/State'
import {
  type NodeStore,
  NodeStoreProvider,
  nodesStore,
  useStore,
} from './store/store'
import { getGraphProjection } from './store/utils/graphProjection'
import { makeNode } from './store/utils/makeNode'
import { nodeAddress } from './store/utils/nodeAddress'
import { expandedNodes } from './store/utils/renderGraph'
import { topLevelByDescendant } from './store/utils/subnodes'
import { Viewport, type ViewportRenderer } from './view/Viewport'

// Addresses of every leaf that is selected or sits inside a selected one, so
// a member selected inside an opened group still resolves to its address.
export function selectedLeafAddresses(
  nodes: readonly Node[],
  selected: ReadonlySet<string>,
): string[] {
  const addresses = new Set<string>()
  const walk = (list: readonly Node[], underSelected: boolean) => {
    for (const node of list) {
      const on = underSelected || selected.has(node.id)
      if (node.subnodes.length > 0) {
        walk(node.subnodes, on)
      } else if (on) {
        addresses.add(nodeAddress(node.id))
      }
    }
  }
  walk(nodes, false)
  return [...addresses]
}

// The node to select for an address: its first copy where it is drawn on its
// own, otherwise the collapsed group holding it.
function focusTargetFor(
  nodes: readonly Node[],
  address: string,
): string | undefined {
  const drawn = expandedNodes(nodes).find(
    (node) => nodeAddress(node.id) === address,
  )
  if (drawn !== undefined) {
    return drawn.id
  }
  for (const [id, top] of topLevelByDescendant(nodes)) {
    if (nodeAddress(id) === address) {
      return top.id
    }
  }
  return undefined
}

export interface BuiltNodes {
  readonly nodes: Node[]
  readonly autoGroups: AutoGroup[]
  readonly arrange?: ArrangeNodes
}

export type BuildNodes = (
  data: ApiProjectResponse,
  project: string,
  preferences: State['userPreferences'],
) => BuiltNodes

export function NodesPanel() {
  return (
    <NodeGraphPanel
      panelId="nodes"
      store={nodesStore}
      buildNodes={buildValueNodes}
      showLayoutLibrary={true}
    />
  )
}

// The graph every node-like panel draws; what differs is the store it keeps
// its layout in and how the project turns into nodes and edges.
export function NodeGraphPanel(props: {
  panelId: string
  store: NodeStore
  buildNodes: BuildNodes
  showLayoutLibrary: boolean
  renderer?: ViewportRenderer
  overlay?: ReactNode
}) {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }
  const response = useQuery(useProjectQueryOptions(project))

  if (response.isLoading) {
    return <LoadingState />
  }
  if (response.isError) {
    return <ErrorState />
  }

  return (
    <NodeStoreProvider value={props.store}>
      <div className="h-full w-full overflow-x-hidden">
        <div className="relative h-full w-full flex-1">
          <NodesSync
            data={response.data}
            project={project}
            buildNodes={props.buildNodes}
          />
          <Viewport renderer={props.renderer} panelId={props.panelId} />
          {props.overlay}
          <Controls showLayoutLibrary={props.showLayoutLibrary} />
        </div>
      </div>
    </NodeStoreProvider>
  )
}

// Keeps the selection subscriptions out of NodesPanel, so a click does not
// rerender the viewport and the toolbar around it.
function NodesSync(props: {
  data: ApiProjectResponse | undefined
  project: string
  buildNodes: BuildNodes
}) {
  useLoadNodes(props.data, props.project, props.buildNodes)
  useSynchronizeSelection()
  return null
}

function useLoadNodes(
  data: ApiProjectResponse | undefined,
  project: string,
  buildNodes: BuildNodes,
) {
  const clear = useStore((state) => state.clear)
  const loadNodes = useStore((state) => state.loadNodes)
  const preferences = useStore((state) => state.userPreferences)

  useEffect(() => {
    clear()
    if (!data) {
      return
    }
    const { nodes, autoGroups, arrange } = buildNodes(
      data,
      project,
      preferences,
    )
    loadNodes(project, nodes, autoGroups, arrange)
  }, [project, data, clear, loadNodes, buildNodes])
}

export function buildValueNodes(
  data: ApiProjectResponse,
  project: string,
  preferences: State['userPreferences'],
): BuiltNodes {
  const nodes: Node[] = []
  const autoGroups: AutoGroup[] = []
  for (const chain of data.entries) {
    const isSharedModule =
      chain.project !== project && chain.project.startsWith('shared-')
    const hueShift = isSharedModule ? 90 : 0
    const chainNodesStartIndex = nodes.length

    const initialAddresses = chain.initialContracts.map((x) => x.address)
    for (const contract of [
      ...chain.initialContracts,
      ...chain.discoveredContracts,
    ]) {
      nodes.push(
        makeNode(contract, {
          isInitial: initialAddresses.includes(contract.address),
          hueShift,
          fields: toNodeFields(contract.fields),
          hiddenFields: preferences.hideLargeArrays
            ? getKeysToHideOnLoad(contract.fields)
            : [],
        }),
      )
    }
    for (const eoa of chain.eoas) {
      nodes.push(
        makeNode(eoa, {
          isInitial: false,
          hueShift,
          fields: [],
          hiddenFields: [],
        }),
      )
    }

    const memberIds = nodes.slice(chainNodesStartIndex).map((node) => node.id)
    if (isSharedModule && memberIds.length > 0) {
      autoGroups.push({
        id: `group:shared:${chain.project}`,
        name: chain.project,
        memberIds,
      })
    }
  }
  return { nodes, autoGroups }
}

function eq(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((x, i) => b[i] === x)
}

function useSynchronizeSelection() {
  const loaded = useStore((state) => state.loaded)
  const [lastSelection, rememberSelection] = useState<readonly string[]>([])
  const selectedGlobal = usePanelStore((state) => state.selected)
  const highlightGlobal = usePanelStore((state) => state.highlight)
  const selectGlobal = usePanelStore((state) => state.select)
  const selectedNodes = useStore((state) => state.selected)
  const nodes = useStore((state) => state.nodes)
  const hiddenNodes = useMemo(
    () => getGraphProjection(nodes).hiddenNodeIds,
    [nodes],
  )
  const selectAndFocus = useStore((state) => state.selectAndFocus)

  useEffect(() => {
    const visibleSelectedNodes = selectedNodes.filter(
      (id) => !hiddenNodes.has(id),
    )
    highlightGlobal([...new Set(visibleSelectedNodes.map(nodeAddress))])
  }, [selectedNodes, hiddenNodes, highlightGlobal])

  useEffect(() => {
    const firstGlobal = selectedGlobal[0]
    const selectedAddresses = selectedLeafAddresses(
      nodes,
      new Set(selectedNodes),
    )

    if (selectedAddresses.length > 0 && !eq(lastSelection, selectedAddresses)) {
      rememberSelection(selectedAddresses)
      selectGlobal(selectedAddresses)
    } else if (
      firstGlobal !== undefined &&
      !lastSelection.includes(firstGlobal) &&
      loaded
    ) {
      const target = focusTargetFor(nodes, firstGlobal)
      rememberSelection(selectedGlobal)
      if (target !== undefined) {
        selectAndFocus(target)
      }
    }
  }, [
    lastSelection,
    rememberSelection,
    selectedGlobal,
    selectGlobal,
    selectedNodes,
    hiddenNodes,
    nodes,
    selectAndFocus,
    loaded,
  ])
}

function toNodeFields(input: ApiField[]): Field[] {
  const implementation = input.find((x) => x.name === '$implementation')
  const bannedValues = new Set(getAddresses(implementation?.value))
  const fields: Field[] = []
  for (const field of input) {
    if (field.name !== PAST_UPGRADES_FIELD) {
      collectNodeFields(field.name, field.value, bannedValues, fields)
    }
  }
  const names = new Set<string>()
  return fields.filter((field) => {
    if (names.has(field.name)) return false
    names.add(field.name)
    return true
  })
}

const PAST_UPGRADES_FIELD = '$pastUpgrades'

// Depth first and in order: an object entry's value, then its key, then the
// next entry. Pushed in reverse so the stack pops them in that order.
function collectNodeFields(
  rootPath: string,
  rootValue: FieldValue,
  bannedValues: ReadonlySet<string>,
  out: Field[],
) {
  const stack: [string, FieldValue][] = [[rootPath, rootValue]]
  for (let item = stack.pop(); item !== undefined; item = stack.pop()) {
    const [path, value] = item
    if (value.type === 'object') {
      for (let i = value.values.length - 1; i >= 0; i--) {
        const [key, entryValue] = value.values[i] as [FieldValue, FieldValue]
        const entryPath = `${path}.${extractFieldValue(key)}`
        const valueIsComplex =
          entryValue.type === 'object' || entryValue.type === 'array'
        stack.push([
          valueIsComplex ? `${entryPath}.#key` : `${entryPath}#key`,
          key,
        ])
        stack.push([entryPath, entryValue])
      }
    } else if (value.type === 'array') {
      for (let i = value.values.length - 1; i >= 0; i--) {
        stack.push([`${path}[${i}]`, value.values[i] as FieldValue])
      }
    } else if (value.type === 'address' && !bannedValues.has(value.address)) {
      out.push({
        name: path,
        target: value.address,
        box: { x: 0, y: 0, width: 0, height: 0 },
        connection: {
          from: { direction: 'left', x: 0, y: 0 },
          to: { direction: 'left', x: 0, y: 0 },
        },
      })
    }
  }
}

function extractFieldValue(value: FieldValue): string {
  switch (value.type) {
    case 'string':
      return value.value
    case 'address':
      return value.address
    case 'number':
      return value.value
    default:
      return ''
  }
}

function getAddresses(value: FieldValue | undefined): string[] {
  if (value?.type === 'array') {
    return value.values.flatMap((v) => getAddresses(v))
  }
  if (value?.type === 'object') {
    return Object.values(value).flatMap((v) => getAddresses(v))
  }
  if (value?.type === 'address') {
    return [value.address]
  }
  return []
}

const LARGE_ARRAY_THRESHOLD = 10

function getKeysToHideOnLoad(fields: ApiField[]): string[] {
  const largeArrays = fields.filter(
    (field) =>
      field.name !== '$members' &&
      countAddresses(field.value) > LARGE_ARRAY_THRESHOLD,
  )

  return toNodeFields(largeArrays).map((field) => field.name)
}

function countAddresses(value: FieldValue): number {
  switch (value.type) {
    case 'address':
      return 1
    case 'array':
      return value.values.reduce((total, v) => total + countAddresses(v), 0)
    case 'object':
      return value.values.reduce(
        (total, [key, v]) => total + countAddresses(key) + countAddresses(v),
        0,
      )
    default:
      return 0
  }
}
