import { useEffect } from 'react'
import { App } from '../../App'
import { SimpleNode } from '../../api/SimpleNode'
import { useStore as useNodeStore } from '../../store/store'
import { White } from '../../utils/color'
import { useApiProject } from '../api/useApiProject'

export function NodesPanel() {
  const response = useApiProject()
  const updateNodes = useNodeStore((state) => state.updateNodes)

  useEffect(() => {
    if (!response.data) {
      return
    }
    const nodes: SimpleNode[] = []
    for (const chain of response.data.chains) {
      for (const contract of [
        ...chain.initialContracts,
        ...chain.discoveredContracts,
      ]) {
        const node: SimpleNode = {
          id: contract.address,
          color: White,
          discovered: true,
          name: contract.name ?? contract.address,
          type: 'Contract',
          fields: [],
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          data: null as any,
        }
        nodes.push(node)
      }
      for (const eoa of chain.eoas) {
        const node: SimpleNode = {
          id: eoa.address,
          color: White,
          discovered: true,
          name: eoa.name ?? eoa.address,
          type: 'EOA',
          fields: [],
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          data: null as any,
        }
        nodes.push(node)
      }
    }
    updateNodes(nodes)
  }, [response.data, updateNodes])

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
