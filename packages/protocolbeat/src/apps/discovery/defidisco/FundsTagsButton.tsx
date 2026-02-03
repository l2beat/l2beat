import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  useContractTags,
  useUpdateContractTag,
} from '../../../hooks/useContractTags'
import { ControlButton } from '../panel-nodes/controls/ControlButton'
import { useStore } from '../panel-nodes/store/store'

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

  const selectedNodes = nodes.filter((node) => selected.includes(node.id))
  const selectionExists = selected.length > 0

  // Get current funds settings for first selected node
  const getCurrentSettings = () => {
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
        fetchBalances: tag?.fetchBalances ?? false,
        fetchPositions: tag?.fetchPositions ?? false,
        isToken: tag?.isToken ?? false,
      }
    }
    return { fetchBalances: false, fetchPositions: false, isToken: false }
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
      selectedNodes.map((node) => {
        return updateContractTag.mutateAsync({
          contractAddress: node.address,
          fetchBalances: newValue,
        })
      }),
    )
  }

  const handleTogglePositions = async () => {
    const newValue = !currentSettings.fetchPositions

    await Promise.all(
      selectedNodes.map((node) => {
        return updateContractTag.mutateAsync({
          contractAddress: node.address,
          fetchPositions: newValue,
        })
      }),
    )
  }

  const handleToggleIsToken = async () => {
    const newValue = !currentSettings.isToken

    await Promise.all(
      selectedNodes.map((node) => {
        return updateContractTag.mutateAsync({
          contractAddress: node.address,
          isToken: newValue,
        })
      }),
    )
  }

  // Count selected nodes that have funds fetching enabled
  const fundsEnabledCount = selectedNodes.filter((node) => {
    const normalizedNodeAddress = node.address.toLowerCase().replace('eth:', '')
    const tag = contractTags?.tags.find(
      (tag) =>
        tag.contractAddress.toLowerCase().replace('eth:', '') ===
        normalizedNodeAddress,
    )
    return tag?.fetchBalances || tag?.fetchPositions || tag?.isToken
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
            <div className="mb-1 font-semibold text-coffee-300 text-xs">
              Funds Fetching Settings
            </div>

            <label
              className="flex cursor-pointer items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={currentSettings.fetchBalances}
                onChange={handleToggleBalances}
                className="h-4 w-4 cursor-pointer accent-blue-500"
              />
              <span className="text-coffee-200 text-xs">
                Fetch Token Balances
              </span>
            </label>

            <label
              className="flex cursor-pointer items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={currentSettings.fetchPositions}
                onChange={handleTogglePositions}
                className="h-4 w-4 cursor-pointer accent-blue-500"
              />
              <span className="text-coffee-200 text-xs">
                Fetch DeFi Positions
              </span>
            </label>

            <label
              className="flex cursor-pointer items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={currentSettings.isToken}
                onChange={handleToggleIsToken}
                className="h-4 w-4 cursor-pointer accent-yellow-500"
              />
              <span className="text-coffee-200 text-xs">Token Contract</span>
            </label>

            <div className="mt-1 text-coffee-500 text-xs">
              Selected: {selectedNodes.length} contract
              {selectedNodes.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
