import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import { type SVGProps, useState } from 'react'
import { createShape, listTemplates } from '../../api/api'
import { DialogActions } from './DialogActions'
import { DialogInput } from './DialogInput'
import { TemplateFolder } from './TemplateFolder'
import {
  DialogContext,
  type DialogStep,
  type TemplateFormData,
  useTemplateDialogContext,
} from './context'

interface TemplateDialogProps {
  address: string
  project: string
  chain: string
  blockNumber: number
}

export const TemplateDialog = {
  Root: TemplateDialogRoot,
  Trigger: TemplateDialogTrigger,
  Body: TemplateDialogBody,
}

function TemplateDialogRoot({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<DialogStep>('specify-template')
  const [formData, setFormData] = useState<TemplateFormData>({
    templateId: '',
    fileName: '',
  })

  return (
    <DialogContext.Provider value={{ step, setStep, formData, setFormData }}>
      <Dialog.Root
        onOpenChange={(open) => {
          if (!open) {
            // Reset state when dialog is closed
            setStep('specify-template')
            setFormData({
              templateId: '',
              fileName: '',
            })
          }
        }}
      >
        {children}
      </Dialog.Root>
    </DialogContext.Provider>
  )
}

function TemplateDialogTrigger({
  children,
  disabled,
  className,
}: {
  children: React.ReactNode
  disabled?: boolean
  className?: string
}) {
  return (
    <Dialog.Trigger asChild disabled={disabled} className={className}>
      {children}
    </Dialog.Trigger>
  )
}

function TemplateDialogBody({
  address,
  chain,
  blockNumber,
}: TemplateDialogProps) {
  const { step, setStep, formData, setFormData } = useTemplateDialogContext()

  const {
    data: templates,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['templates'],
    queryFn: () => listTemplates(),
  })

  const mutation = useMutation({
    mutationFn: () => {
      const { templateId, fileName } = formData
      if (!templateId || !fileName) {
        return Promise.resolve()
      }
      return createShape(chain, address, blockNumber, templateId, fileName)
    },
  })

  const handleFormChange = (field: keyof TemplateFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStepChange = (newStep: DialogStep) => {
    setStep(newStep)
    mutation.reset()
  }

  const isFormValid = Boolean(formData.templateId && formData.fileName)

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-20 data-[state=open]:bg-coffee-900/60" />
      <Dialog.Content className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 z-[25] max-h-[85vh] w-[90vw] max-w-[500px] overflow-y-auto border border-coffee-400 bg-coffee-600 p-6 shadow-[var(--shadow-6)] focus:outline-none">
        <Dialog.Title className="mb-1 font-medium text-lg">
          Add new shape
        </Dialog.Title>

        {isLoading && <LoadingState />}
        {isError && <ErrorState />}

        {templates && step === 'specify-template' && (
          <SpecifyTemplate
            templates={templates}
            formData={formData}
            onFormChange={handleFormChange}
          />
        )}

        {step === 'finalize-creation' && (
          <TemplateSummary
            formData={formData}
            address={address}
            chain={chain}
          />
        )}

        <DialogActions
          step={step}
          isFormValid={Boolean(isFormValid)}
          onBack={() => handleStepChange('specify-template')}
          onNext={() => handleStepChange('finalize-creation')}
          onCreate={() => mutation.mutate()}
          mutation={mutation}
        />

        <Dialog.Close asChild>
          <button
            className="absolute top-2.5 right-2.5 inline-flex cursor-pointer appearance-none items-center justify-center rounded-full focus:outline-none"
            aria-label="Close"
          >
            <XIcon className="stroke-coffee-200" />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

function LoadingState() {
  return <div className="text-center text-coffee-200">Loading templates...</div>
}

function ErrorState() {
  return (
    <div className="text-center text-red-400">
      Error while loading templates
    </div>
  )
}

function SpecifyTemplate({
  templates,
  formData,
  onFormChange,
}: {
  templates: Record<string, string[]>
  formData: TemplateFormData
  onFormChange: (field: keyof TemplateFormData, value: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTemplates = Object.entries(templates).reduce<
    Record<string, string[]>
  >((acc, [name, entries]) => {
    const searchLower = searchQuery.toLowerCase()
    const nameMatches = name.toLowerCase().includes(searchLower)
    const filteredEntries = entries.filter((entry) =>
      entry.toLowerCase().includes(searchLower),
    )

    if (nameMatches || filteredEntries.length > 0) {
      acc[name] = filteredEntries.length > 0 ? filteredEntries : entries
    }
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <label className="font-medium text-xs">Template ID</label>
        <DialogInput
          value={formData.templateId}
          onChange={(e) => onFormChange('templateId', e.target.value)}
          type="text"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium text-xs">Filename</label>
        <DialogInput
          type="text"
          value={formData.fileName}
          onChange={(e) => onFormChange('fileName', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-sm">Available templates</h3>
        <DialogInput
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="max-h-[40vh] overflow-y-auto border border-coffee-400 bg-coffee-400/10 p-1">
          {Object.keys(filteredTemplates).length > 0 ? (
            Object.entries(filteredTemplates).map(([name, templates]) => (
              <TemplateFolder
                key={name}
                name={name}
                entries={templates}
                selected={formData.templateId}
                setSelected={(id) => onFormChange('templateId', id)}
              />
            ))
          ) : (
            <div className="text-center text-coffee-400">
              {searchQuery
                ? 'No matching templates found'
                : 'No templates found'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TemplateSummary({
  formData,
  address,
  chain,
}: {
  formData: TemplateFormData
  address: string
  chain: string
}) {
  const details = [
    { label: 'Template ID', value: formData.templateId },
    { label: 'Filename', value: formData.fileName },
    { label: 'Address', value: address },
    { label: 'Chain', value: chain },
  ]

  return (
    <div className="space-y-2 border border-coffee-400 bg-coffee-400/10 p-4">
      {details.map(({ label, value }) => (
        <div key={label} className="flex flex-col">
          <span className="font-medium text-coffee-400 text-xs">{label}</span>
          <span className="text-sm">{value}</span>
        </div>
      ))}
    </div>
  )
}

function XIcon(props?: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
      <path
        d="M18 6L6 18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 6L18 18"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
