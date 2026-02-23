import { useParams } from 'react-router-dom'
import { IS_READONLY } from '../../../config/readonly'
import { useContractTags, useUpdateContractTag } from './hooks/useContractTags'

export function GovernanceIndicator({ address }: { address: string }) {
  const { project } = useParams()
  if (!project) return null

  const { data: contractTags } = useContractTags(project)
  const updateContractTag = useUpdateContractTag(project)

  const normalizeAddress = (addr: string) =>
    addr.toLowerCase().replace('eth:', '')

  const tag = contractTags?.tags.find(
    (t) => normalizeAddress(t.contractAddress) === normalizeAddress(address),
  )
  const isGovernance = tag?.isGovernance ?? false

  const handleToggle = () => {
    updateContractTag.mutateAsync({
      contractAddress: address,
      isGovernance: !isGovernance,
    })
  }

  return (
    <>
      {isGovernance && (
        <span className="font-bold text-aux-green"> (Governance)</span>
      )}
      {!IS_READONLY && (
        <button
          onClick={handleToggle}
          title={
            isGovernance
              ? 'Unmark as governance contract'
              : 'Mark as governance contract'
          }
          className="ml-2 bg-aux-green/80 px-2 py-0.5 font-medium text-white text-xs transition-all duration-200 hover:bg-aux-green disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isGovernance ? 'Unmark Governance' : 'Mark Governance'}
        </button>
      )}
    </>
  )
}
