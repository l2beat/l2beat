import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { App } from '../../App'
import { Node } from '../../store/State'
import { useStore as useNodeStore } from '../../store/store'
import { NODE_WIDTH } from '../../store/utils/constants'
import { getChainColor } from '../../store/utils/discoveryToNodes'
import { getProject } from '../api/api'

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
          fields: [],
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
    <div className="h-full w-full overflow-x-hidden font-ui">
      <App />
    </div>
  )
}
