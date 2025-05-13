import type { useMutation } from '@tanstack/react-query'
import { DialogButton } from './DialogButton'
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
          <DialogButton onClick={onBack}>Back</DialogButton>
        )}
        {step === 'specify-template' && (
          <DialogButton disabled={!isFormValid} onClick={onNext}>
            Next
          </DialogButton>
        )}
        {step === 'finalize-creation' && (
          <DialogButton
            disabled={!isFormValid}
            onClick={onCreate}
            className="bg-coffee-400"
          >
            Create shape
          </DialogButton>
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
