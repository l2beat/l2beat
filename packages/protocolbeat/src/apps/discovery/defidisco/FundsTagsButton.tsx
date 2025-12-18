import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useUpdateContractTag, useContractTags } from '../../../hooks/useContractTags'
import { useStore } from '../panel-nodes/store/store'
import { ControlButton } from '../panel-nodes/controls/ControlButton'

export function FundsTagsButton() {
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

  // Get current funds settings for first selected node
  const getCurrentSettings = () => {
    if (selectedNodes.length > 0 && selectedNodes[0]) {
      const normalizedNodeAddress = selectedNodes[0].address.toLowerCase().replace('eth:', '')
      const tag = contractTags?.tags.find(tag =>
        tag.contractAddress.toLowerCase().replace('eth:', '') === normalizedNodeAddress
      )
      return {
        fetchBalances: tag?.fetchBalances ?? false,
        fetchPositions: tag?.fetchPositions ?? false,
      }
    }
    return { fetchBalances: false, fetchPositions: false }
  }

  const currentSettings = getCurrentSettings()

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

    const timeout = setTimeout(
      () => window.addEventListener('click', onClick),
      0,
    )
    return () => {
      clearTimeout(timeout)
      window.removeEventListener('click', onClick)
    }
  }, [ref, open, setOpen])

  const handleToggleBalances = async () => {
    const newValue = !currentSettings.fetchBalances

    await Promise.all(
      selectedNodes.map(node => {
        return updateContractTag.mutateAsync({
          contractAddress: node.address,
          fetchBalances: newValue,
        })
      })
    )
  }

  const handleTogglePositions = async () => {
    const newValue = !currentSettings.fetchPositions

    await Promise.all(
      selectedNodes.map(node => {
        return updateContractTag.mutateAsync({
          contractAddress: node.address,
          fetchPositions: newValue,
        })
      })
    )
  }

  // Count selected nodes that have funds fetching enabled
  const fundsEnabledCount = selectedNodes.filter(node => {
    const normalizedNodeAddress = node.address.toLowerCase().replace('eth:', '')
    const tag = contractTags?.tags.find(tag =>
      tag.contractAddress.toLowerCase().replace('eth:', '') === normalizedNodeAddress
    )
    return tag?.fetchBalances || tag?.fetchPositions
  }).length

  return (
    <>
      <ControlButton disabled={!selectionExists} onClick={() => setOpen(true)}>
        Funds {fundsEnabledCount > 0 ? `(${fundsEnabledCount})` : ''}
      </ControlButton>
      {open && (
        <div
          ref={ref}
          className="-translate-x-1/2 absolute bottom-14 left-1/2 w-max"
        >
          <div className="flex flex-col gap-2 rounded border border-coffee-600 bg-coffee-800 p-3 shadow-xl">
            <div className="text-xs font-semibold text-coffee-300 mb-1">
              Funds Fetching Settings
            </div>

            <label
              className="flex items-center gap-2 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={currentSettings.fetchBalances}
                onChange={handleToggleBalances}
                className="w-4 h-4 accent-blue-500 cursor-pointer"
              />
              <span className="text-xs text-coffee-200">Fetch Token Balances</span>
            </label>

            <label
              className="flex items-center gap-2 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={currentSettings.fetchPositions}
                onChange={handleTogglePositions}
                className="w-4 h-4 accent-blue-500 cursor-pointer"
              />
              <span className="text-xs text-coffee-200">Fetch DeFi Positions</span>
            </label>

            <div className="text-xs text-coffee-500 mt-1">
              Selected: {selectedNodes.length} contract{selectedNodes.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
