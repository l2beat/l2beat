import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProject } from '../../../api/api'
import type {
  Field as ApiField,
  ApiProjectResponse,
  FieldValue,
} from '../../../api/types'
import { ErrorState } from '../../../components/ErrorState'
import { LoadingState } from '../../../components/LoadingState'
import { usePanelStore } from '../store/panel-store'
import { Controls } from './controls/Controls'
import type { Field, Node } from './store/State'
import { useStore as useNodeStore, useStore } from './store/store'
import { NODE_WIDTH } from './store/utils/constants'
import { Viewport } from './view/Viewport'

export function NodesPanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }
  const response = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })

  useSynchronizeSelection()
  useLoadNodes(response.data, project)

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
  const preferences = useNodeStore((state) => state.userPreferences)

  useEffect(() => {
    clear()
    if (!data) {
      return
    }
    const nodes: Node[] = []
    for (const chain of data.entries) {
      const hueShift = chain.project.startsWith('shared') ? 90 : 0

      const initialAddresses = chain.initialContracts.map((x) => x.address)
      for (const contract of [
        ...chain.initialContracts,
        ...chain.discoveredContracts,
      ]) {
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
          color: 0,
          hueShift,
          data: null,
          fields: toNodeFields(contract.fields),
          hiddenFields: keysToHideOnLoad,
        }
        nodes.push(node)
      }
      for (const eoa of chain.eoas) {
        const [prefix, address] = eoa.address.split(':') as [string, string]
        const fallback = `EOA ${prefix}:${address.slice(0, 6)}…${address.slice(-4)}`
        const node: Node = {
          id: eoa.address,
          isInitial: false,
          isReachable: eoa.isReachable,
          hasTemplate: false,
          name: eoa.name ?? fallback,
          addressType: eoa.type,
          address,
          box: { x: 0, y: 0, width: NODE_WIDTH, height: 0 },
          color: 0,
          hueShift,
          data: null,
          fields: [],
          hiddenFields: [],
        }
        nodes.push(node)
      }
    }
    loadNodes(project, nodes)
  }, [project, data, clear, loadNodes])
}

function useSynchronizeSelection() {
  const [lastSelection, rememberSelection] = useState<readonly string[]>([])
  const selectedGlobal = usePanelStore((state) => state.selected)
  const highlightGlobal = usePanelStore((state) => state.highlight)
  const selectGlobal = usePanelStore((state) => state.select)
  const selectedNodes = useStore((state) => state.selected)
  const hiddenNodes = useStore((state) => state.hidden)
  const selectNodes = useStore((state) => state.selectAndFocus)

  useEffect(() => {
    const eq = (a: readonly string[], b: readonly string[]) =>
      a.length === b.length && a.every((x, i) => b[i] === x)

    const visibleSelectedNodes = selectedNodes.filter(
      (id) => !hiddenNodes.includes(id),
    )

    highlightGlobal(visibleSelectedNodes)
    if (selectedNodes.length > 0 && !eq(lastSelection, selectedNodes)) {
      rememberSelection(selectedNodes)
      selectGlobal(selectedNodes[0])
    } else if (selectedGlobal && !lastSelection.includes(selectedGlobal)) {
      rememberSelection([selectedGlobal])
      selectNodes(selectedGlobal)
    }
  }, [
    lastSelection,
    rememberSelection,
    selectedGlobal,
    selectGlobal,
    selectedNodes,
    hiddenNodes,
    selectNodes,
  ])
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
    return value.values.flatMap(([key, value]) =>
      [
        getNodeFields(
          `${path}.${extractFieldValue(key)}`,
          value,
          bannedKeys,
          bannedValues,
        ),
        getNodeFields(`${path}.#key`, key, bannedKeys, bannedValues),
      ].flat(),
    )
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
