import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import type {
  Field as ApiField,
  ApiProjectContract,
  ApiProjectResponse,
  FieldValue,
} from '../../../api/types'
import { ErrorState } from '../../../components/ErrorState'
import { LoadingState } from '../../../components/LoadingState'
import { useProjectQueryOptions } from '../hooks/projectQuery'
import { usePanelStore } from '../store/panel-store'
import { Controls } from './controls/Controls'
import {
  buildDisplayEntrypointColorMap,
  buildEntrypointColorAssignments,
  enrichEntrypointGroupsForCollapse,
  getPrimaryEntrypointColor,
} from './entrypointColors'
import type { Field, Node } from './store/State'
import { useStore as useNodeStore, useStore } from './store/store'
import { NODE_WIDTH } from './store/utils/constants'
import {
  buildEntrypointMemberMap,
  findDeclaredEntrypointGroupId,
  normalizeSelectionForDisplay,
  resolveFocusNodeId,
} from './store/utils/entrypointGroups'
import { Viewport } from './view/Viewport'

export function NodesPanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }
  const response = useQuery(useProjectQueryOptions(project))

  useLoadNodes(response.data, project)
  useSynchronizeSelection()

  if (response.isLoading) {
    return <LoadingState />
  }
  if (response.isError) {
    return <ErrorState />
  }

  return (
    <div className="h-full w-full overflow-x-hidden">
      <div className="relative h-full w-full flex-1">
        <Viewport />
        <Controls />
      </div>
    </div>
  )
}

function useLoadNodes(data: ApiProjectResponse | undefined, project: string) {
  const clear = useNodeStore((state) => state.clear)
  const loadNodes = useNodeStore((state) => state.loadNodes)
  const setEntrypointGroups = useNodeStore((state) => state.setEntrypointGroups)
  const preferences = useNodeStore((state) => state.userPreferences)

  useEffect(() => {
    clear()
    if (!data) {
      return
    }
    const entrypointGroups = data.entrypointGroups ?? []
    const enrichedEntrypointGroups = enrichEntrypointGroupsForCollapse(
      entrypointGroups,
      data.entries,
    )
    setEntrypointGroups(enrichedEntrypointGroups)
    const entrypointColors = buildEntrypointColorAssignments(
      entrypointGroups,
      data.entries,
    )
    const displayEntrypointColors = buildDisplayEntrypointColorMap(
      entrypointColors,
      enrichedEntrypointGroups,
      data.entries,
    )
    const entrypointMemberMap = buildEntrypointMemberMap(
      enrichedEntrypointGroups,
    )

    function resolveEntrypointMemberOf(address: string): string | undefined {
      const declaredGroup = findDeclaredEntrypointGroupId(
        address,
        enrichedEntrypointGroups,
      )
      if (declaredGroup) {
        return declaredGroup
      }
      return (
        entrypointMemberMap.get(address) ??
        entrypointColors.get(address)?.[0]?.groupId
      )
    }

    function resolveNodeEntrypointColors(address: string): readonly number[] {
      return displayEntrypointColors.get(address) ?? []
    }
    const nodesById = new Map<string, Node>()
    for (const chain of data.entries) {
      const chainHueShift = chain.project.startsWith('shared') ? 90 : 0

      const initialAddresses = chain.initialContracts.map((x) => x.address)
      for (const contract of [
        ...chain.initialContracts,
        ...chain.discoveredContracts,
      ]) {
        const assignments = entrypointColors.get(contract.address)
        const memberGroupId = resolveEntrypointMemberOf(contract.address)
        const palette = resolveNodeEntrypointColors(contract.address)
        const entrypointColor =
          palette[0] ?? getPrimaryEntrypointColor(assignments)
        const hueShift =
          memberGroupId && palette.length > 0
            ? 0
            : memberGroupId
              ? 55
              : chainHueShift
        const [prefix, address] = contract.address.split(':') as [
          string,
          string,
        ]
        const fallback = `${prefix}:${address.slice(0, 6)}…${address.slice(-4)}`
        const keysToHideOnLoad = preferences.hideLargeArrays
          ? getKeysToHideOnLoad(contract.fields)
          : []

        const node: Node = {
          id: contract.address,
          isInitial: initialAddresses.includes(contract.address),
          isReachable: contract.isReachable,
          hasTemplate: contract.template !== undefined,
          name: contract.name ?? fallback,
          addressType: contract.type,
          address,
          box: { x: 0, y: 0, width: NODE_WIDTH, height: 0 },
          color: entrypointColor,
          entrypointColors: palette.length > 0 ? palette : undefined,
          hueShift,
          data: null,
          sourceKey: getSourceKey(contract.sourceHashes),
          valuesShapeKey: getValuesShapeKey(contract),
          fields: toNodeFields(contract.fields),
          hiddenFields: keysToHideOnLoad,
          appearsInProjectsCount: contract.appearsInProjectsCount,
          appearsInProjects: contract.appearsInProjects,
          entrypointMemberOf: memberGroupId,
        }
        nodesById.set(contract.address, node)
      }
      for (const eoa of chain.eoas) {
        const [prefix, address] = eoa.address.split(':') as [string, string]
        const fallback = `EOA ${prefix}:${address.slice(0, 6)}…${address.slice(-4)}`
        const assignments = entrypointColors.get(eoa.address)
        const memberGroupId = resolveEntrypointMemberOf(eoa.address)
        const palette = resolveNodeEntrypointColors(eoa.address)
        const entrypointColor =
          palette[0] ?? getPrimaryEntrypointColor(assignments)
        const hueShift =
          memberGroupId && palette.length > 0
            ? 0
            : memberGroupId
              ? 55
              : chainHueShift
        const node: Node = {
          id: eoa.address,
          isInitial: false,
          isReachable: eoa.isReachable,
          hasTemplate: false,
          name: eoa.name ?? fallback,
          addressType: eoa.type,
          address,
          box: { x: 0, y: 0, width: NODE_WIDTH, height: 0 },
          color: entrypointColor,
          entrypointColors: palette.length > 0 ? palette : undefined,
          hueShift,
          data: null,
          fields: [],
          hiddenFields: [],
          appearsInProjectsCount: undefined,
          appearsInProjects: undefined,
          entrypointMemberOf: memberGroupId,
        }
        nodesById.set(eoa.address, node)
      }
    }
    loadNodes(project, [...nodesById.values()])
  }, [project, data, clear, loadNodes, setEntrypointGroups])
}

function eq(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((x, i) => b[i] === x)
}

function useSynchronizeSelection() {
  const loaded = useStore((state) => state.loaded)
  const [lastSelection, rememberSelection] = useState<readonly string[]>([])
  const graphSelectionSyncRef = useRef(false)
  const selectedGlobal = usePanelStore((state) => state.selected)
  const highlightGlobal = usePanelStore((state) => state.highlight)
  const selectGlobal = usePanelStore((state) => state.select)
  const selectedNodes = useStore((state) => state.selected)
  const hiddenNodes = useStore((state) => state.hidden)
  const selectNodes = useStore((state) => state.selectNodes)

  useEffect(() => {
    const nodeState = useNodeStore.getState()
    const visibleSelectedNodes = normalizeSelectionForDisplay(
      selectedNodes,
      nodeState,
    ).filter((id) => !hiddenNodes.includes(id))
    highlightGlobal(visibleSelectedNodes)
  }, [selectedNodes, hiddenNodes, highlightGlobal])

  useEffect(() => {
    if (selectedNodes.length > 0 && !eq(lastSelection, selectedNodes)) {
      rememberSelection(selectedNodes)
      graphSelectionSyncRef.current = true
      const displayId = normalizeSelectionForDisplay(
        selectedNodes,
        useNodeStore.getState(),
      )[0]
      if (displayId) {
        selectGlobal(displayId)
      }
      return
    }

    if (!selectedGlobal || !loaded) {
      return
    }

    if (graphSelectionSyncRef.current) {
      graphSelectionSyncRef.current = false
      return
    }

    const nodeState = useNodeStore.getState()
    const focusId = resolveFocusNodeId(selectedGlobal, nodeState)

    const alreadySelected = selectedNodes.some(
      (id) =>
        id === focusId ||
        id === selectedGlobal ||
        resolveFocusNodeId(id, nodeState) === focusId,
    )

    if (alreadySelected) {
      return
    }

    rememberSelection([focusId])
    selectNodes([focusId])
  }, [
    lastSelection,
    rememberSelection,
    selectedGlobal,
    selectGlobal,
    selectedNodes,
    hiddenNodes,
    selectNodes,
    loaded,
  ])
}

/** Stable identity of a contract's flattened source (proxy + implementations). */
function getSourceKey(sourceHashes: string[] | undefined): string | undefined {
  if (!sourceHashes || sourceHashes.length === 0) {
    return undefined
  }
  return sourceHashes.slice().sort().join(',')
}

/**
 * Stable identity of a contract's value shape: the sorted set of value keys,
 * scoped by template id. Two contracts share a shape when they expose the same
 * fields (even if the values differ, e.g. Morpho markets). The template id is a
 * prefix so two different templates with the same keys stay separate; synthetic
 * nodes without a template (e.g. merged markets) still group by their keys.
 */
function getValuesShapeKey(contract: ApiProjectContract): string | undefined {
  if (contract.fields.length === 0) {
    return undefined
  }
  const templateId = contract.template?.id ?? ''
  const keys = contract.fields
    .map((field) => field.name)
    .sort()
    .join(',')
  return `${templateId}::${keys}`
}

function toNodeFields(input: ApiField[]): Field[] {
  const implementation = input.find((x) => x.name === '$implementation')
  const bannedKeys: string[] = ['$pastUpgrades']
  const bannedValues: string[] = getAddresses(implementation?.value)

  return input.flatMap((x) =>
    getNodeFields(x.name, x.value, bannedKeys, bannedValues),
  )
}

function getNodeFields(
  path: string,
  value: FieldValue,
  bannedKeys: string[],
  bannedValues: string[],
): Field[] {
  if (bannedKeys.includes(path)) {
    return []
  }

  if (value.type === 'object') {
    return value.values.flatMap(([key, value]) => {
      const entryPath = `${path}.${extractFieldValue(key)}`
      const valueIsComplex = value.type === 'object' || value.type === 'array'
      const keyPath = valueIsComplex ? `${entryPath}.#key` : `${entryPath}#key`
      return [
        getNodeFields(entryPath, value, bannedKeys, bannedValues),
        getNodeFields(keyPath, key, bannedKeys, bannedValues),
      ].flat()
    })
  }
  if (value.type === 'array') {
    return value.values.flatMap((value, i) =>
      getNodeFields(`${path}[${i}]`, value, bannedKeys, bannedValues),
    )
  }
  if (value.type === 'address') {
    if (bannedValues.includes(value.address)) {
      return []
    }
    return [
      {
        name: path,
        target: value.address,
        box: { x: 0, y: 0, width: 0, height: 0 },
        connection: {
          from: { direction: 'left', x: 0, y: 0 },
          to: { direction: 'left', x: 0, y: 0 },
        },
      },
    ]
  }
  return []
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
      field.value.type === 'array' &&
      field.value.values.length > LARGE_ARRAY_THRESHOLD,
  )

  return toNodeFields(largeArrays).map((field) => field.name)
}
