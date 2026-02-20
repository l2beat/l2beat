import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ControlButton } from '../panel-nodes/controls/ControlButton'
import { useStore } from '../panel-nodes/store/store'
import { DependencyPropagationDialog } from './DependencyPropagationDialog'
import { useContractTags, useUpdateContractTag } from './hooks/useContractTags'
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
  const updateContractTag = useUpdateContractTag(project)
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

  const handleSetAttributes = async (
    centralization: 'high' | 'medium' | 'low' | 'immutable',
  ) => {
    const promises = selectedNodes.map((node) => {
      const normalizedNodeAddress = node.address
        .toLowerCase()
        .replace('eth:', '')
      const tag = contractTags?.tags.find(
        (tag) =>
          tag.contractAddress.toLowerCase().replace('eth:', '') ===
          normalizedNodeAddress,
      )
      return updateContractTag.mutateAsync({
        contractAddress: node.address, // Backend will normalize to ensure eth: prefix
        isExternal: tag?.isExternal ?? true,
        centralization,
      })
    })

    await Promise.all(promises)
    setOpen(false)
  }

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
            onSetAttributes={handleSetAttributes}
            hasExternalContract={hasExternalContract}
            selectedNodes={selectedNodes}
            contractTags={contractTags}
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
        />
      )}
    </>
  )
}

interface AttributePickerProps {
  onToggleExternal: () => void | Promise<void>
  onSetAttributes: (
    centralization: 'high' | 'medium' | 'low' | 'immutable',
  ) => Promise<void>
  hasExternalContract: boolean
  selectedNodes: Array<{ id: string; address: string }>
  contractTags:
    | {
        tags: Array<{
          contractAddress: string
          centralization?: 'high' | 'medium' | 'low' | 'immutable'
        }>
      }
    | undefined
}

function AttributePicker({
  onToggleExternal,
  onSetAttributes,
  hasExternalContract,
  selectedNodes,
  contractTags,
}: AttributePickerProps) {
  const centralizationOptions: Array<'high' | 'medium' | 'low' | 'immutable'> =
    ['high', 'medium', 'low', 'immutable']

  // Get current attributes from first selected node
  const getCurrentAttributes = () => {
    if (selectedNodes.length > 0 && selectedNodes[0]) {
      const normalizedNodeAddress = selectedNodes[0].address
        .toLowerCase()
        .replace('eth:', '')
      const tag = contractTags?.tags.find(
        (tag) =>
          tag.contractAddress.toLowerCase().replace('eth:', '') ===
          normalizedNodeAddress,
      )
      return {
        centralization: tag?.centralization || 'high',
      }
    }
    return { centralization: 'high' as const }
  }

  const currentAttrs = getCurrentAttributes()
  const [selectedCentralization, setSelectedCentralization] = useState<
    'high' | 'medium' | 'low' | 'immutable'
  >(currentAttrs.centralization)

  return (
    <div className="flex flex-col gap-3 rounded border border-coffee-600 bg-coffee-800 p-3 shadow-xl">
      {/* Toggle External button */}
      <button
        className="w-full rounded border border-coffee-600 bg-coffee-700 px-3 py-2 text-xs hover:bg-coffee-600"
        onClick={onToggleExternal}
      >
        {hasExternalContract ? 'Mark Internal' : 'Mark External'}
      </button>

      {/* Centralization Column */}
      {hasExternalContract && (
        <>
          <div className="flex gap-3">
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-coffee-300 text-xs">
                Centralization
              </div>
              {centralizationOptions.map((cent) => (
                <button
                  key={cent}
                  className={`rounded border border-coffee-600 px-3 py-2 text-xs capitalize ${
                    selectedCentralization === cent
                      ? 'bg-coffee-600'
                      : 'bg-coffee-700 hover:bg-coffee-600'
                  }`}
                  onClick={() => setSelectedCentralization(cent)}
                >
                  {cent}
                </button>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <button
            className="w-full rounded border border-coffee-600 bg-coffee-700 px-3 py-2 text-xs hover:bg-coffee-600"
            onClick={() => onSetAttributes(selectedCentralization)}
          >
            Apply
          </button>
        </>
      )}
    </div>
  )
}
