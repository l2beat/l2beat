import { useParams } from 'react-router-dom'
import { ControlButton } from '../panel-nodes/controls/ControlButton'
import { useStore } from '../panel-nodes/store/store'
import { useContractTags, useUpdateContractTag } from './hooks/useContractTags'

export function GovernanceButton() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Missing project!')
  }

  const selected = useStore((state) => state.selected)
  const nodes = useStore((state) => state.nodes)
  const updateContractTag = useUpdateContractTag(project)
  const { data: contractTags } = useContractTags(project)

  const selectedNodes = nodes.filter((node) => selected.includes(node.id))
  const selectionExists = selected.length > 0

  const hasGovernanceContract = selectedNodes.some((node) => {
    const normalizedNodeAddress = node.address.toLowerCase().replace('eth:', '')
    return contractTags?.tags.some(
      (tag) =>
        tag.contractAddress.toLowerCase().replace('eth:', '') ===
          normalizedNodeAddress && tag.isGovernance,
    )
  })

  const handleToggle = async () => {
    const newValue = !hasGovernanceContract
    const promises = selectedNodes.map((node) =>
      updateContractTag.mutateAsync({
        contractAddress: node.address,
        isGovernance: newValue,
      }),
    )
    await Promise.all(promises)
  }

  return (
    <ControlButton disabled={!selectionExists} onClick={handleToggle}>
      Governance
    </ControlButton>
  )
}
