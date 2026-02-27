import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ControlButton } from '../panel-nodes/controls/ControlButton'
import { useStore } from '../panel-nodes/store/store'
import { DependencyPropagationDialog } from './DependencyPropagationDialog'
import { EntitySelector } from './EntitySelector'
import {
  useContractTags,
  useProjectEntities,
  useUpdateContractTag,
} from './hooks/useContractTags'
import { useExternalToggle } from './hooks/useExternalToggle'

export function ExternalButton() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Missing project!')
  }

  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const selected = useStore((state) => state.selected)
  const nodes = useStore((state) => state.nodes)
  const { data: contractTags } = useContractTags(project)

  const selectedNodes = nodes.filter((node) => selected.includes(node.id))
  const selectionExists = selected.length > 0

  const targets = selectedNodes.map((n) => ({
    address: n.address,
    name: n.name,
  }))

  const { hasExternalContract, handleToggleExternal, propagationDialogProps } =
    useExternalToggle(project, targets, () => setOpen(false))

  useEffect(() => {
    if (!open) {
      return
    }
    function onClick(e: MouseEvent) {
      const box = ref.current?.getBoundingClientRect()
      if (
        !box ||
        e.clientX < box.left ||
        e.clientX > box.right ||
        e.clientY < box.top ||
        e.clientY > box.bottom
      ) {
        setOpen(false)
      }
    }

    // We use setTimeout to ignore the click on the button to open
    const timeout = setTimeout(
      () => window.addEventListener('click', onClick),
      0,
    )
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('click', onClick)
    }
  }, [ref, open, setOpen])

  return (
    <>
      <ControlButton disabled={!selectionExists} onClick={() => setOpen(true)}>
        External
      </ControlButton>
      {open && (
        <div
          ref={ref}
          className="-translate-x-1/2 absolute bottom-14 left-1/2 w-max"
        >
          <AttributePicker
            onToggleExternal={handleToggleExternal}
            hasExternalContract={hasExternalContract}
            selectedNodes={selectedNodes}
            contractTags={contractTags}
            project={project}
          />
        </div>
      )}
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

interface AttributePickerProps {
  onToggleExternal: () => void | Promise<void>
  hasExternalContract: boolean
  selectedNodes: Array<{ id: string; address: string }>
  contractTags:
    | {
        tags: Array<{
          contractAddress: string
          entity?: string
        }>
      }
    | undefined
  project: string
}

function AttributePicker({
  onToggleExternal,
  hasExternalContract,
  selectedNodes,
  contractTags,
  project,
}: AttributePickerProps) {
  const existingEntities = useProjectEntities(project)
  const updateContractTag = useUpdateContractTag(project)

  // Get current entity from first selected node's tag
  const currentEntity = useMemo(() => {
    if (selectedNodes.length > 0 && selectedNodes[0]) {
      const normalizedNodeAddress = selectedNodes[0].address
        .toLowerCase()
        .replace('eth:', '')
      const tag = contractTags?.tags.find(
        (tag) =>
          tag.contractAddress.toLowerCase().replace('eth:', '') ===
          normalizedNodeAddress,
      )
      return tag?.entity
    }
    return undefined
  }, [selectedNodes, contractTags])

  const [entity, setEntity] = useState<string | undefined>(currentEntity)

  const handleEntityChange = async (newEntity: string | undefined) => {
    setEntity(newEntity)
    await Promise.all(
      selectedNodes.map((node) =>
        updateContractTag.mutateAsync({
          contractAddress: node.address,
          entity: newEntity ?? null,
        }),
      ),
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded border border-coffee-600 bg-coffee-800 p-3 shadow-xl">
      {/* Toggle External button */}
      <button
        className="w-full rounded border border-coffee-600 bg-coffee-700 px-3 py-2 text-xs hover:bg-coffee-600"
        onClick={onToggleExternal}
      >
        {hasExternalContract ? 'Mark Internal' : 'Mark External'}
      </button>

      {/* Entity selector (only when external) */}
      {hasExternalContract && (
        <div>
          <div className="mb-2 font-semibold text-coffee-300 text-xs">
            Entity
          </div>
          <EntitySelector
            value={entity}
            onChange={handleEntityChange}
            existingEntities={existingEntities}
          />
        </div>
      )}
    </div>
  )
}
