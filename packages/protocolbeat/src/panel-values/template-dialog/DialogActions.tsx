import type { useMutation } from '@tanstack/react-query'
import { Dialog } from '../../components/Dialog'
import type { DialogStep } from './context'

interface DialogActionsProps {
  step: DialogStep
  isFormValid: boolean
  onBack: () => void
  onNext: () => void
  onCreate: () => void
  mutation: ReturnType<typeof useMutation<void, Error, void>>
}

export function DialogActions({
  step,
  isFormValid,
  onBack,
  onNext,
  onCreate,
  mutation,
}: DialogActionsProps) {
  return (
    <div className="mt-4 space-y-2">
      <div className="flex justify-end gap-2">
        {step === 'finalize-creation' && (
          <Dialog.Button onClick={onBack}>Back</Dialog.Button>
        )}
        {step === 'specify-template' && (
          <Dialog.Button disabled={!isFormValid} onClick={onNext}>
            Next
          </Dialog.Button>
        )}
        {step === 'finalize-creation' && (
          <Dialog.Button
            disabled={!isFormValid}
            onClick={onCreate}
            className="bg-coffee-400 hover:bg-coffee-400/80"
          >
            Create shape
          </Dialog.Button>
        )}
      </div>
      {step === 'finalize-creation' && (
        <div className="text-xs">
          {mutation.isPending && <div>Creating shape...</div>}
          {mutation.isError && (
            <div className="flex flex-col text-aux-red">
              <span>Error while creating shape</span>
              <span className="text-aux-red-light">
                {mutation.error.message}
              </span>
            </div>
          )}
          {mutation.isSuccess && (
            <div className="text-aux-green">Shape created successfully</div>
          )}
        </div>
      )}
    </div>
  )
}
