import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProject } from '../api/api'
import { Field as ApiField, FieldValue } from '../api/types'
import { usePanelStore } from '../store/store'
import { NodesApp } from './NodesApp'
import { Field, Node } from './store/State'
import { useStore as useNodeStore, useStore } from './store/store'
import { NODE_WIDTH } from './store/utils/constants'
import { getChainColor } from './store/utils/discoveryToNodes'

export function NodesPanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }
  const response = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })
  const clear = useNodeStore((state) => state.clear)
  const loadNodes = useNodeStore((state) => state.loadNodes)

  const panelSelected = usePanelStore((state) => state.selected)
  const panelSelect = usePanelStore((state) => state.select)
  const nodesSelected = useStore((state) => state.selected)
  const nodesSelect = useStore((state) => state.selectAndFocus)

  useEffect(() => {
    nodesSelect(panelSelected)
  }, [panelSelected, nodesSelect])

  useEffect(() => {
    panelSelect(nodesSelected)
  }, [nodesSelected, panelSelect])

  useEffect(() => {
    clear()
    if (!response.data) {
      return
    }
    const nodes: Node[] = []
    for (const chain of response.data.chains) {
      const baseColor = getChainColor(chain.name)
      for (const contract of [
        ...chain.initialContracts,
        ...chain.discoveredContracts,
      ]) {
        const node: Node = {
          id: contract.address,
          name: contract.name ?? 'Unknown',
          address: contract.address.split(':')[1] as string,
          box: { x: 0, y: 0, width: NODE_WIDTH, height: 0 },
          color: baseColor,
          data: null,
          fields: toNodeFields(contract.fields),
        }
        nodes.push(node)
      }
      for (const eoa of chain.eoas) {
        const node: Node = {
          id: eoa.address,
          name: eoa.name ?? eoa.address,
          address: eoa.address.split(':')[1] as string,
          box: { x: 0, y: 0, width: NODE_WIDTH, height: 0 },
          color: baseColor,
          data: null,
          fields: [],
        }
        nodes.push(node)
      }
    }
    loadNodes(project, nodes)
  }, [project, response.data, loadNodes])

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

function toNodeFields(input: ApiField[]): Field[] {
  const implementation = input.find((x) => x.name === '$implementation')
  const banned: string[] = []
  if (implementation?.value.type === 'address') {
    banned.push(implementation.value.address)
  } else if (implementation?.value.type === 'array') {
    for (const item of implementation.value.values) {
      if (item.type === 'address') {
        banned.push(item.address)
      }
    }
  }
  return input.flatMap((x) => getNodeFields(x.name, x.value, banned))
}

function getNodeFields(
  path: string,
  value: FieldValue,
  banned: string[],
): Field[] {
  if (value.type === 'object') {
    return Object.entries(value).flatMap(([key, value]) =>
      getNodeFields(`${path}.${key}`, value, banned),
    )
  } else if (value.type === 'array') {
    return value.values.flatMap((value, i) =>
      getNodeFields(`${path}[${i}]`, value, banned),
    )
  } else if (value.type === 'address') {
    if (banned.includes(value.address)) {
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
