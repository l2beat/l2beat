import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUpdateContractTag, useContractTags } from '../../../hooks/useContractTags'
import { useStore } from '../panel-nodes/store/store'
import { ControlButton } from '../panel-nodes/controls/ControlButton'

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

  const selectedNodes = nodes.filter(node => selected.includes(node.id))
  const selectionExists = selected.length > 0

  // Check if any of the selected contracts are external
  const hasExternalContract = selectedNodes.some(node => {
    const normalizedAddr = node.address.replace('eth:', '').toLowerCase()
    const tag = contractTags?.tags.find(tag => tag.contractAddress.toLowerCase() === normalizedAddr)
    return tag?.isExternal ?? false
  })

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

  const handleToggleExternal = () => {
    // If not external, mark as external
    // If external, mark as internal (remove tag)
    const newExternalStatus = !hasExternalContract

    selectedNodes.forEach(node => {
      const normalizedAddr = node.address.replace('eth:', '')
      updateContractTag.mutate({
        contractAddress: normalizedAddr,
        isExternal: newExternalStatus
      })
    })

    setOpen(false)
  }

  const handleSetAttributes = async (
    centralization: 'high' | 'medium' | 'low',
    mitigations: 'complete' | 'partial' | 'none'
  ) => {
    const promises = selectedNodes.map(node => {
      const normalizedAddr = node.address.replace('eth:', '')
      const tag = contractTags?.tags.find(tag =>
        tag.contractAddress.toLowerCase() === normalizedAddr.toLowerCase()
      )
      return updateContractTag.mutateAsync({
        contractAddress: normalizedAddr,
        isExternal: tag?.isExternal ?? true,
        centralization,
        mitigations
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
    </>
  )
}

interface AttributePickerProps {
  onToggleExternal: () => void
  onSetAttributes: (
    centralization: 'high' | 'medium' | 'low',
    mitigations: 'complete' | 'partial' | 'none'
  ) => void
  hasExternalContract: boolean
  selectedNodes: Array<{ id: string; address: string }>
  contractTags: { tags: Array<{ contractAddress: string; centralization?: 'high' | 'medium' | 'low'; mitigations?: 'complete' | 'partial' | 'none' }> } | undefined
}

function AttributePicker({ onToggleExternal, onSetAttributes, hasExternalContract, selectedNodes, contractTags }: AttributePickerProps) {
  const centralizationOptions: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low']
  const mitigationsOptions: Array<'complete' | 'partial' | 'none'> = ['complete', 'partial', 'none']

  // Get current attributes from first selected node
  const getCurrentAttributes = () => {
    if (selectedNodes.length > 0 && selectedNodes[0]) {
      const normalizedAddr = selectedNodes[0].address.replace('eth:', '').toLowerCase()
      const tag = contractTags?.tags.find(tag => tag.contractAddress.toLowerCase() === normalizedAddr)
      return {
        centralization: tag?.centralization || 'high',
        mitigations: tag?.mitigations || 'none'
      }
    }
    return { centralization: 'high' as const, mitigations: 'none' as const }
  }

  const currentAttrs = getCurrentAttributes()
  const [selectedCentralization, setSelectedCentralization] = useState<'high' | 'medium' | 'low'>(currentAttrs.centralization)
  const [selectedMitigations, setSelectedMitigations] = useState<'complete' | 'partial' | 'none'>(currentAttrs.mitigations)

  return (
    <div className="flex flex-col gap-3 rounded border border-coffee-600 bg-coffee-800 p-3 shadow-xl">
      {/* Toggle External button */}
      <button
        className="w-full rounded border border-coffee-600 bg-coffee-700 px-3 py-2 text-xs hover:bg-coffee-600"
        onClick={onToggleExternal}
      >
        {hasExternalContract ? 'Mark Internal' : 'Mark External'}
      </button>

      {/* Centralization + Mitigations Columns */}
      {hasExternalContract && (
        <>
          <div className="flex gap-3">
            {/* Centralization Column */}
            <div className="flex flex-col gap-2">
              <div className="text-xs font-semibold text-coffee-300">Centralization</div>
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

            {/* Mitigations Column */}
            <div className="flex flex-col gap-2">
              <div className="text-xs font-semibold text-coffee-300">Mitigations</div>
              {mitigationsOptions.map((mit) => (
                <button
                  key={mit}
                  className={`rounded border border-coffee-600 px-3 py-2 text-xs capitalize ${
                    selectedMitigations === mit
                      ? 'bg-coffee-600'
                      : 'bg-coffee-700 hover:bg-coffee-600'
                  }`}
                  onClick={() => setSelectedMitigations(mit)}
                >
                  {mit}
                </button>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <button
            className="w-full rounded border border-coffee-600 bg-coffee-700 px-3 py-2 text-xs hover:bg-coffee-600"
            onClick={() => onSetAttributes(selectedCentralization, selectedMitigations)}
          >
            Apply
          </button>
        </>
      )}
    </div>
  )
}
