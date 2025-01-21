import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProject } from '../api/api'
import type {
  Field as ApiField,
  ApiProjectResponse,
  FieldValue,
} from '../api/types'
import { usePanelStore } from '../store/store'
import { NodesApp } from './NodesApp'
import type { Field, Node } from './store/State'
import { useStore as useNodeStore, useStore } from './store/store'
import { NODE_WIDTH } from './store/utils/constants'

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
    return <div>Loading</div>
  }
  if (response.isError) {
    return <div>Error</div>
  }

  return (
    <div className="h-full w-full overflow-x-hidden">
      <NodesApp panelMode />
    </div>
  )
}

function useLoadNodes(data: ApiProjectResponse | undefined, project: string) {
  const clear = useNodeStore((state) => state.clear)
  const loadNodes = useNodeStore((state) => state.loadNodes)

  useEffect(() => {
    clear()
    if (!data) {
      return
    }
    const nodes: Node[] = []
    for (const chain of data.chains) {
      for (const contract of [
        ...chain.initialContracts,
        ...chain.discoveredContracts,
      ]) {
        const [prefix, address] = contract.address.split(':') as [
          string,
          string,
        ]
        const fallback = `${prefix}:${address.slice(0, 6)}…${address.slice(-4)}`
        const node: Node = {
          id: contract.address,
          name: contract.name ?? fallback,
          addressType: contract.type,
          address,
          box: { x: 0, y: 0, width: NODE_WIDTH, height: 0 },
          color: 0,
          data: null,
          fields: toNodeFields(contract.fields),
        }
        nodes.push(node)
      }
      for (const eoa of chain.eoas) {
        const [prefix, address] = eoa.address.split(':') as [string, string]
        const fallback = `EOA ${prefix}:${address.slice(0, 6)}…${address.slice(-4)}`
        const node: Node = {
          id: eoa.address,
          name: eoa.name ?? fallback,
          addressType: 'EOA',
          address,
          box: { x: 0, y: 0, width: NODE_WIDTH, height: 0 },
          color: 0,
          data: null,
          fields: [],
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
  const selectGlobal = usePanelStore((state) => state.select)
  const selectedNodes = useStore((state) => state.selected)
  const selectNodes = useStore((state) => state.selectAndFocus)

  useEffect(() => {
    const eq = (a: readonly string[], b: readonly string[]) =>
      a.length === b.length && a.every((x, i) => b[i] === x)

    if (selectedNodes.length > 0 && !eq(lastSelection, selectedNodes)) {
      rememberSelection(selectedNodes)
      selectGlobal(selectedNodes[0])
    } else if (selectedGlobal && !lastSelection.includes(selectedGlobal)) {
      rememberSelection([selectedGlobal])
      selectNodes([selectedGlobal])
    }
  }, [
    lastSelection,
    rememberSelection,
    selectedGlobal,
    selectGlobal,
    selectedNodes,
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
    return Object.entries(value.value).flatMap(([key, value]) =>
      getNodeFields(`${path}.${key}`, value, bannedKeys, bannedValues),
    )
  } else if (value.type === 'array') {
    return value.values.flatMap((value, i) =>
      getNodeFields(`${path}[${i}]`, value, bannedKeys, bannedValues),
    )
  } else if (value.type === 'address') {
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
  } else {
    return []
  }
}

function getAddresses(value: FieldValue | undefined): string[] {
  if (value?.type === 'array') {
    return value.values.flatMap((v) => getAddresses(v))
  } else if (value?.type === 'object') {
    return Object.values(value).flatMap((v) => getAddresses(v))
  } else if (value?.type === 'address') {
    return [value.address]
  }
  return []
}
