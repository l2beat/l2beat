import { useParams } from 'react-router-dom'
import { useUpdateContractTag, useContractTags } from '../../../hooks/useContractTags'
import { useStore } from '../panel-nodes/store/store'
import { ControlButton } from '../panel-nodes/controls/ControlButton'

export function ExternalButton() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Missing project!')
  }

  const selected = useStore((state) => state.selected)
  const nodes = useStore((state) => state.nodes)
  const updateContractTag = useUpdateContractTag(project)
  const { data: contractTags } = useContractTags(project)

  const selectedNodes = nodes.filter(node => selected.includes(node.id))
  const selectionExists = selected.length > 0

  // Check if any of the selected contracts are external
  const hasExternalContract = selectedNodes.some(node => {
    const tag = contractTags?.tags.find(tag => tag.contractAddress === node.address)
    return tag?.isExternal ?? false
  })

  const handleToggleExternal = () => {
    // Toggle external status for all selected contracts
    const newExternalStatus = !hasExternalContract

    selectedNodes.forEach(node => {
      updateContractTag.mutate({
        contractAddress: node.address,
        isExternal: newExternalStatus
      })
    })
  }

  return (
    <ControlButton
      disabled={!selectionExists}
      onClick={handleToggleExternal}
    >
      {hasExternalContract ? 'Mark Internal' : 'Mark External'}
    </ControlButton>
  )
}