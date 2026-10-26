import { createContext, useContext } from 'react'

export type DialogStep = 'specify-template' | 'finalize-creation'

export interface TemplateFormData {
  templateId: string
  fileName: string
}

export interface DialogContextType {
  step: DialogStep
  setStep: (step: DialogStep) => void
  formData: TemplateFormData
  setFormData: React.Dispatch<React.SetStateAction<TemplateFormData>>
}

export const DialogContext = createContext<DialogContextType | null>(null)

export function useTemplateDialogContext() {
  const context = useContext(DialogContext)
  if (!context)
    throw new Error('TemplateDialogBody must be used within TemplateDialogRoot')
  return context
}
