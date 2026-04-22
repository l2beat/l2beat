import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ControlButton } from '../panel-nodes/controls/ControlButton'
import { useStore } from '../panel-nodes/store/store'
import { findByAddress } from './addressUtils'
import { useContractTags, useUpdateContractTag } from './hooks/useContractTags'

const KNOWN_AGGREGATE_HANDLERS = [
  'aerodrome-cl-factory',
  'aerodrome-v2-factory',
  'frankencoin-mintinghub',
  'uniswap-v2-factory',
  'uniswap-v3-factory',
]

export function FundsTagsButton() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Missing project!')
  }

  const ref = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [labelDraft, setLabelDraft] = useState('')

  const selected = useStore((state) => state.selected)
  const nodes = useStore((state) => state.nodes)
  const updateContractTag = useUpdateContractTag(project)
  const { data: contractTags } = useContractTags(project)

  const selectedNodes = nodes.filter((node) => selected.includes(node.id))
  const selectionExists = selected.length > 0

  // Get current funds settings for first selected node
  const getCurrentSettings = () => {
    if (selectedNodes.length > 0 && selectedNodes[0]) {
      const tag = findByAddress(
        contractTags?.tags ?? [],
        (t) => t.contractAddress,
        selectedNodes[0].id,
      )
      return {
        fetchBalances: tag?.fetchBalances ?? false,
        fetchPositions: tag?.fetchPositions ?? false,
        isToken: tag?.isToken ?? false,
        fetchAggregate: tag?.fetchAggregate ?? false,
        aggregateHandler: tag?.aggregateHandler ?? KNOWN_AGGREGATE_HANDLERS[0],
        aggregateLabel: tag?.aggregateLabel ?? '',
      }
    }
    return {
      fetchBalances: false,
      fetchPositions: false,
      isToken: false,
      fetchAggregate: false,
      aggregateHandler: KNOWN_AGGREGATE_HANDLERS[0],
      aggregateLabel: '',
    }
  }

  const currentSettings = getCurrentSettings()

  // Sync label draft when settings change
  useEffect(() => {
    setLabelDraft(currentSettings.aggregateLabel)
  }, [currentSettings.aggregateLabel])

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
          contractAddress: node.id,
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
          contractAddress: node.id,
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
          contractAddress: node.id,
          isToken: newValue,
        })
      }),
    )
  }

  const handleToggleAggregate = async () => {
    const newValue = !currentSettings.fetchAggregate

    await Promise.all(
      selectedNodes.map((node) => {
        return updateContractTag.mutateAsync({
          contractAddress: node.id,
          fetchAggregate: newValue,
          aggregateHandler: newValue ? currentSettings.aggregateHandler : null,
          aggregateLabel: newValue
            ? currentSettings.aggregateLabel || null
            : null,
        })
      }),
    )
  }

  const handleHandlerChange = async (handler: string) => {
    await Promise.all(
      selectedNodes.map((node) => {
        return updateContractTag.mutateAsync({
          contractAddress: node.id,
          aggregateHandler: handler,
        })
      }),
    )
  }

  const handleLabelSave = async () => {
    const trimmed = labelDraft.trim()
    if (trimmed === currentSettings.aggregateLabel) return

    await Promise.all(
      selectedNodes.map((node) => {
        return updateContractTag.mutateAsync({
          contractAddress: node.id,
          aggregateLabel: trimmed || null,
        })
      }),
    )
  }

  // Count selected nodes that have funds fetching enabled
  const fundsEnabledCount = selectedNodes.filter((node) => {
    const tag = findByAddress(
      contractTags?.tags ?? [],
      (t) => t.contractAddress,
      node.id,
    )
    return (
      tag?.fetchBalances ||
      tag?.fetchPositions ||
      tag?.isToken ||
      tag?.fetchAggregate
    )
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

            <div className="my-1 border-coffee-600 border-t" />

            <label
              className="flex cursor-pointer items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={currentSettings.fetchAggregate}
                onChange={handleToggleAggregate}
                className="h-4 w-4 cursor-pointer accent-green-500"
              />
              <span className="text-coffee-200 text-xs">Fetch Aggregate</span>
            </label>

            {currentSettings.fetchAggregate && (
              <div className="ml-6 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-coffee-400 text-xs">Handler:</span>
                  <select
                    value={currentSettings.aggregateHandler}
                    onChange={(e) => handleHandlerChange(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border border-coffee-600 bg-coffee-900 px-2 py-0.5 text-coffee-200 text-xs"
                  >
                    {KNOWN_AGGREGATE_HANDLERS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-coffee-400 text-xs">Label:</span>
                  <input
                    type="text"
                    value={labelDraft}
                    onChange={(e) => setLabelDraft(e.target.value)}
                    onBlur={handleLabelSave}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleLabelSave()
                    }}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="e.g. Uniswap V2 Liquidity Pools"
                    className="w-52 rounded border border-coffee-600 bg-coffee-900 px-2 py-0.5 text-coffee-200 text-xs placeholder:text-coffee-600"
                  />
                </div>
              </div>
            )}

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
