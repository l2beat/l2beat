import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IS_READONLY } from '../../../config/readonly'
import { DependencyPropagationDialog } from './DependencyPropagationDialog'
import { EntitySelector } from './EntitySelector'
import { GovernanceIndicator } from './GovernanceIndicator'
import {
  useContractTags,
  useProjectEntities,
  useUpdateContractTag,
} from './hooks/useContractTags'
import { useExternalToggle } from './hooks/useExternalToggle'

export function ExternalIndicator({
  address,
  name,
}: {
  address: string
  name?: string
}) {
  const { project } = useParams()
  if (!project) return null

  const { hasExternalContract, handleToggleExternal, propagationDialogProps } =
    useExternalToggle(project, [{ address, name }])

  const { data: contractTags } = useContractTags(project)
  const updateContractTag = useUpdateContractTag(project)
  const existingEntities = useProjectEntities(project)
  const [showEntityPicker, setShowEntityPicker] = useState(false)

  const currentEntity = useMemo(() => {
    const normalizeAddress = (addr: string) =>
      addr.toLowerCase().replace('eth:', '')
    const normalized = normalizeAddress(address)
    return contractTags?.tags.find(
      (t) => normalizeAddress(t.contractAddress) === normalized,
    )?.entity
  }, [contractTags, address])

  const handleEntityChange = async (entity: string | undefined) => {
    await updateContractTag.mutateAsync({
      contractAddress: address,
      entity: entity ?? null,
    })
    setShowEntityPicker(false)
  }

  return (
    <>
      {hasExternalContract && (
        <>
          <span className="font-bold text-aux-orange"> (External)</span>
          {currentEntity && (
            <span className="ml-1 text-coffee-300 text-xs">
              [{currentEntity}]
            </span>
          )}
          {!IS_READONLY && (
            <button
              onClick={() => setShowEntityPicker(!showEntityPicker)}
              className="ml-1 text-coffee-400 text-xs hover:text-coffee-200"
              title="Set entity"
            >
              {currentEntity ? 'change' : '+ entity'}
            </button>
          )}
          {showEntityPicker && (
            <span className="ml-2 inline-flex">
              <EntitySelector
                value={currentEntity}
                onChange={handleEntityChange}
                existingEntities={existingEntities}
                compact
              />
            </span>
          )}
        </>
      )}
      {!IS_READONLY && (
        <button
          onClick={handleToggleExternal}
          title={
            hasExternalContract
              ? 'Mark as internal contract'
              : 'Mark as external dependency'
          }
          className="ml-2 bg-aux-orange/80 px-2 py-0.5 font-medium text-white text-xs transition-all duration-200 hover:bg-aux-orange disabled:cursor-not-allowed disabled:opacity-50"
        >
          {hasExternalContract ? 'Mark Internal' : 'Mark External'}
        </button>
      )}
      <GovernanceIndicator address={address} />
      {propagationDialogProps.show && (
        <DependencyPropagationDialog
          mode={propagationDialogProps.mode}
          externalContracts={propagationDialogProps.externalContracts}
          affectedFunctions={propagationDialogProps.affectedFunctions}
          onConfirm={propagationDialogProps.onConfirm}
          onCancel={propagationDialogProps.onCancel}
          onSkip={propagationDialogProps.onSkip}
          existingEntities={propagationDialogProps.existingEntities}
          initialEntity={propagationDialogProps.initialEntity}
        />
      )}
    </>
  )
}
