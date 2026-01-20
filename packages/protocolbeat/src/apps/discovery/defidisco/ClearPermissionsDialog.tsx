import { useState } from 'react'
import { createPortal } from 'react-dom'

interface ClearPermissionsDialogProps {
  contractAddress: string
  contractName: string
  functionCount: number
  onConfirm: () => Promise<void>
  onCancel: () => void
}

export function ClearPermissionsDialog({
  contractAddress,
  contractName,
  functionCount,
  onConfirm,
  onCancel,
}: ClearPermissionsDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
    } finally {
      setIsLoading(false)
    }
  }

  const dialogContent = (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center bg-black/50 p-4 pt-24">
      <div className="flex w-[500px] flex-col rounded border border-coffee-600 bg-coffee-800 shadow-xl">
        {/* Header */}
        <div className="border-coffee-600 border-b p-4">
          <h2 className="font-semibold text-lg">
            Clear Permission Scanner Results
          </h2>
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="mb-4 text-coffee-200">
            Are you sure you want to clear all permission scanner results for
            this contract?
          </p>

          <div className="rounded bg-coffee-700 p-3">
            <div className="mb-2 text-coffee-300 text-sm">Contract:</div>
            <div className="mb-1 font-medium">{contractName}</div>
            <div className="break-all font-mono text-coffee-400 text-xs">
              {contractAddress}
            </div>

            <div className="mt-3 text-coffee-300 text-sm">
              {functionCount > 0 ? (
                <>
                  This will delete{' '}
                  <span className="font-semibold text-white">
                    {functionCount}
                  </span>{' '}
                  function
                  {functionCount !== 1 ? 's' : ''} from functions.json
                </>
              ) : (
                'This contract has no functions to delete'
              )}
            </div>
          </div>

          <div className="mt-4 rounded bg-yellow-900/30 border border-yellow-600/50 p-3">
            <p className="text-yellow-200 text-sm">
              ⚠️ This action cannot be undone. You will need to re-scan
              permissions if you want to restore this data.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-coffee-600 border-t p-4">
          <div className="flex justify-end gap-2">
            <button
              className="rounded border border-coffee-600 bg-coffee-700 px-4 py-2 text-sm hover:bg-coffee-600 disabled:opacity-50"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
              onClick={handleConfirm}
              disabled={isLoading || functionCount === 0}
            >
              {isLoading ? 'Clearing...' : 'Clear Permissions'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(dialogContent, document.body)
}
