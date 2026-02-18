import { useParams } from 'react-router-dom'
import { IS_READONLY } from '../../../config/readonly'
import { DependencyPropagationDialog } from './DependencyPropagationDialog'
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

  return (
    <>
      {hasExternalContract && (
        <span className="font-bold text-aux-orange"> (External)</span>
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
      {propagationDialogProps.show && (
        <DependencyPropagationDialog
          mode={propagationDialogProps.mode}
          externalContracts={propagationDialogProps.externalContracts}
          affectedFunctions={propagationDialogProps.affectedFunctions}
          onConfirm={propagationDialogProps.onConfirm}
          onCancel={propagationDialogProps.onCancel}
          onSkip={propagationDialogProps.onSkip}
        />
      )}
    </>
  )
}
