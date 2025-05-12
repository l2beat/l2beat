import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import {
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type SVGProps,
  useState,
} from 'react'
import { createShape, listTemplates } from '../api/api'
import { IconContract } from '../icons/IconContract'
import { IconFolder } from '../icons/IconFolder'
import { IconFolderOpened } from '../icons/IconFolderOpened'

type DialogStep = 'specify-template' | 'finalize-creation'

interface TemplateDialogProps {
  address: string
  project: string
  chain: string
}

interface TemplateFormData {
  templateId: string
  fileName: string
}

export const TemplateDialog = {
  Root: TemplateDialogRoot,
  Trigger: TemplateDialogTrigger,
  Body: TemplateDialogBody,
}

function TemplateDialogRoot({ children }: { children: React.ReactNode }) {
  return <Dialog.Root>{children}</Dialog.Root>
}

function TemplateDialogTrigger({
  disabled,
  children,
  className,
}: {
  disabled: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <Dialog.Trigger asChild disabled={disabled} className={className}>
      {children}
    </Dialog.Trigger>
  )
}

function TemplateDialogBody({ address, project, chain }: TemplateDialogProps) {
  const [step, setStep] = useState<DialogStep>('specify-template')
  const [formData, setFormData] = useState<TemplateFormData>({
    templateId: '',
    fileName: '',
  })

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
      return createShape(project, chain, address, templateId, fileName)
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
      <Dialog.Overlay className="fixed inset-0 data-[state=open]:bg-coffee-900/60" />
      <Dialog.Content className="-translate-x-1/2 -translate-y-1/2 fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[500px] overflow-y-auto border border-coffee-400 bg-coffee-600 p-6 shadow-[var(--shadow-6)] focus:outline-none">
        <Dialog.Title className="mb-1 font-medium text-lg">
          Add new shape
        </Dialog.Title>

        {isLoading && <LoadingState />}
        {isError && <ErrorState />}

        {templates && step === 'specify-template' && (
          <SelectPredefinedTemplate
            templates={templates}
            formData={formData}
            onFormChange={handleFormChange}
          />
        )}

        {step === 'finalize-creation' && (
          <FinalizeTemplate
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
  return <div className="text-center text-red-400">Error loading templates</div>
}

interface DialogActionsProps {
  step: DialogStep
  isFormValid: boolean
  onBack: () => void
  onNext: () => void
  onCreate: () => void
  mutation: ReturnType<typeof useMutation<void, Error, void>>
}

function DialogActions({
  step,
  isFormValid,
  onBack,
  onNext,
  onCreate,
  mutation,
}: DialogActionsProps) {
  return (
    <div className="mt-6 space-y-2">
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
          <DialogButton disabled={!isFormValid} onClick={onCreate}>
            Create shape
          </DialogButton>
        )}
      </div>
      {step === 'finalize-creation' && (
        <div className="text-xs">
          {mutation.isPending && <div>Creating shape...</div>}
          {mutation.isError && (
            <div className="flex flex-col text-aux-red">
              <span>Error creating shape:</span>
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

function SelectPredefinedTemplate({
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
        <IsolatedInput
          value={formData.templateId}
          onChange={(e) => onFormChange('templateId', e.target.value)}
          type="text"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium text-xs">Filename</label>
        <IsolatedInput
          type="text"
          value={formData.fileName}
          onChange={(e) => onFormChange('fileName', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="font-medium text-sm">Available templates</h3>
        <IsolatedInput
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="max-h-[40vh] overflow-y-auto border border-coffee-400 bg-coffee-400/10 p-1">
          {Object.keys(filteredTemplates).length > 0 ? (
            Object.entries(filteredTemplates).map(([name, templates]) => (
              <Folder
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

function FinalizeTemplate({
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

function Folder({
  name,
  entries,
  selected,
  setSelected,
}: {
  name: string
  entries: string[]
  selected: string
  setSelected: (selected: string) => void
}) {
  const [isOpen, setIsOpen] = useState(true)

  if (entries.length === 0) {
    return (
      <div
        className="mb-2 flex cursor-pointer items-center gap-2 hover:bg-coffee-400/20"
        onClick={() => setSelected(name)}
      >
        <IconContract />
        <span
          className={clsx('text-sm', selected === name && 'text-coffee-300')}
        >
          {name}
        </span>
      </div>
    )
  }

  return (
    <div className="mb-2 flex flex-col">
      <div
        className="group flex cursor-pointer items-center gap-2 hover:bg-coffee-400/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <IconFolderOpened /> : <IconFolder />}
        <span
          className={clsx(
            'text-sm group-hover:text-coffee-300',
            selected === name && 'text-coffee-300',
          )}
          onClick={() => setSelected(name)}
        >
          {name}
        </span>
      </div>
      {isOpen && (
        <div className="ml-2 flex flex-col border-l">
          {entries.map((entry) => {
            const key = `${name}/${entry}`
            return (
              <span
                key={key}
                className={clsx(
                  'cursor-pointer pl-5 text-xs hover:bg-coffee-400/20 hover:text-coffee-300',
                  selected === key && 'text-coffee-300',
                )}
                onClick={() => setSelected(key)}
              >
                {entry}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

function DialogButton({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="border border-coffee-400 px-4 py-2 font-medium text-sm transition-colors hover:bg-coffee-500 disabled:opacity-50 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  )
}

function IsolatedInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      onKeyUp={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      className={clsx(
        'border border-coffee-400 bg-coffee-400/20 px-2 py-1 text-sm placeholder:text-coffee-200/40 focus:border-coffee-300 focus:outline-none',
      )}
      {...props}
    />
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
