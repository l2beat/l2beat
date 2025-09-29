import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { useMemo, useState } from 'react'

import { createShape, listTemplates } from '../../../../api/api'
import { Dialog } from '../../../../components/Dialog'
import { Input } from '../../../../components/Input'
import {
  DialogContext,
  type DialogStep,
  type TemplateFormData,
  useTemplateDialogContext,
} from './context'
import { DialogActions } from './DialogActions'
import { TemplateFolder } from './TemplateFolder'

interface TemplateDialogProps {
  addresses: string[]
  project: string
  chain: string
  blockNumber: number
}

export const TemplateDialog = {
  Root: TemplateDialogRoot,
  Trigger: TemplateDialogTrigger,
  Body: TemplateDialogBody,
}

function TemplateDialogRoot({
  children,
  project,
  selectedName,
}: {
  children: React.ReactNode
  project: string
  selectedName?: string
}) {
  const initialTemplateId = `${project}/${selectedName ?? '<ChangeMe>'}`
  const initialFileName = `${selectedName ?? '<ChangeMe>'}.sol`

  const [step, setStep] = useState<DialogStep>('specify-template')
  const [formData, setFormData] = useState<TemplateFormData>({
    templateId: initialTemplateId,
    fileName: initialFileName,
  })

  return (
    <DialogContext.Provider value={{ step, setStep, formData, setFormData }}>
      <Dialog.Root
        onOpenChange={(open) => {
          if (!open) {
            // Reset state when dialog is closed
            setStep('specify-template')
            setFormData({
              templateId: initialTemplateId,
              fileName: initialFileName,
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
    <Dialog.Trigger asChild disabled={disabled}>
      <div
        className={clsx(
          'group relative ml-2 cursor-pointer overflow-hidden bg-coffee-400 px-3 py-1 font-medium text-sm text-white transition-all duration-300',
          className,
        )}
      >
        <span className="pointer-events-none absolute inset-0 animate-[disco_1.5s_linear_infinite] bg-[length:400%_400%] bg-[linear-gradient(270deg,#ff0080,#ff8c00,#40e0d0,#8a2be2)] opacity-0 transition-opacity duration-200 group-hover:opacity-80" />
        <span className="relative z-10">{children}</span>
      </div>
    </Dialog.Trigger>
  )
}

function TemplateDialogBody({
  addresses,
  chain,
  blockNumber,
}: TemplateDialogProps) {
  const queryClient = useQueryClient()
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
      return createShape(chain, addresses, blockNumber, templateId, fileName)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['templates'] })
    },
  })

  const handleFormChange = (field: keyof TemplateFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleStepChange = (newStep: DialogStep) => {
    setStep(newStep)
    mutation.reset()
  }

  const nonEmpty = formData.templateId && formData.fileName
  const regexMatch = templateIdRegex.test(formData.templateId)
  const isFormValid = Boolean(nonEmpty && regexMatch)

  return (
    <Dialog.Body>
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
          addresses={addresses}
          chain={chain}
        />
      )}

      <DialogActions
        step={step}
        isFormValid={isFormValid}
        onBack={() => handleStepChange('specify-template')}
        onNext={() => handleStepChange('finalize-creation')}
        onCreate={() => mutation.mutate()}
        mutation={mutation}
      />
    </Dialog.Body>
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
  templates: string[]
  formData: TemplateFormData
  onFormChange: (field: keyof TemplateFormData, value: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTemplates = useMemo(
    () => groupByTopLevel(search(templates, searchQuery)),
    [templates, searchQuery],
  )

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <label className="font-medium text-xs">Template ID</label>
        <Input
          value={formData.templateId}
          onChange={(e) => onFormChange('templateId', e.target.value)}
          type="text"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium text-xs">Filename</label>
        <Input
          type="text"
          value={formData.fileName}
          onChange={(e) => onFormChange('fileName', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-sm">Available templates</h3>
        <Input
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
  addresses,
  chain,
}: {
  formData: TemplateFormData
  addresses: string[]
  chain: string
}) {
  const details = [
    { label: 'Template ID', value: formData.templateId },
    { label: 'Filename', value: formData.fileName },
    {
      label: 'Addresses',
      value: (
        <div className="flex flex-wrap gap-1">
          {addresses.map((address) => (
            <div key={address} className="text-sm">
              {address}
            </div>
          ))}
          {addresses.length > 1 && (
            <span className="text-coffee-400 text-xs italic">
              Source hashes will be combined together to create a single shape
              hash
            </span>
          )}
        </div>
      ),
    },
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

/**
 * Only letters, numbers, dashes, and underscores, separated by /
 * Dashes and underscores can only occur between alphanumeric characters
 * Can optionally end with /
 * No leading slash
 * No empty segments
 * No whitespace
 * No backslashes
 * No special characters except _ and - between alphanumeric characters
 */
const templateIdRegex = new RegExp(
  '^(?!\\/)(?!.*\\/\\/)(?!.*\\s)(?!.*\\\\)(?:[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*\\/)*[a-zA-Z0-9]+([-_][a-zA-Z0-9]+)*\\/?$',
)

function search(templates: string[], searchQuery: string) {
  return templates.filter((template) =>
    template.toLowerCase().includes(searchQuery.toLowerCase()),
  )
}

function groupByTopLevel(paths: string[]): Record<string, string[]> {
  const pathMap = new Map<string, string[]>()

  for (const path of paths) {
    const elements = path.split('/')
    if (elements.length === 1) {
      pathMap.set(path, [])
    } else {
      const commonPath = elements.slice(0, -1).join('/')

      const lastElement = elements[elements.length - 1]

      if (!lastElement) {
        continue
      }

      if (pathMap.has(commonPath)) {
        pathMap.get(commonPath)?.push(lastElement)
      } else {
        pathMap.set(commonPath, [lastElement])
      }
    }
  }

  return Object.fromEntries(pathMap.entries())
}
