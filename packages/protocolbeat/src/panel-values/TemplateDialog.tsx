import * as Dialog from '@radix-ui/react-dialog'
import { useMutation, useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { type ButtonHTMLAttributes, type SVGProps, useState } from 'react'
import { createShape, listTemplates } from '../api/api'
import { IconContract } from '../icons/IconContract'
import { IconFolder } from '../icons/IconFolder'
import { IconFolderOpened } from '../icons/IconFolderOpened'

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

function TemplateDialogBody({
  address,
  project,
  chain,
}: {
  address: string
  project: string
  chain: string
}) {
  const [step, setStep] = useState<'specify-template' | 'finalize-creation'>(
    'specify-template',
  )
  const [templateId, setTemplateId] = useState<string | undefined>(undefined)
  const [templateValidationMessage, setTemplateValidationMessage] = useState<
    string | undefined
  >(undefined)
  const [fileName, setFileName] = useState<string | undefined>(undefined)
  const [fileNameValidationMessage, setFileNameValidationMessage] = useState<
    string | undefined
  >(undefined)

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
      if (!templateId || !fileName) {
        return Promise.resolve()
      }
      return createShape(project, chain, address, templateId, fileName)
    },
  })

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 data-[state=open]:bg-coffee-900/60" />
      <Dialog.Content className="-translate-x-1/2 -translate-y-1/2 overflow-x-none fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[500px] overflow-y-auto border border-coffee-400 bg-coffee-600 p-[25px] shadow-[var(--shadow-6)] focus:outline-none">
        <Dialog.Title className="mb-3 font-medium text-lg">
          Add new shape
        </Dialog.Title>

        {isLoading && <div>Loading...</div>}
        {isError && <div>Error loading templates</div>}
        {templates && step === 'specify-template' && (
          <>
            <SelectPredefinedTemplate
              templates={templates}
              templateId={templateId}
              setTemplateId={setTemplateId}
              templateValidationMessage={templateValidationMessage}
              fileName={fileName}
              setFileName={setFileName}
              fileNameValidationMessage={fileNameValidationMessage}
            />
          </>
        )}
        {step === 'finalize-creation' && templateId && fileName && (
          <FinalizeTemplate
            templateId={templateId}
            fileName={fileName}
            address={address}
            chain={chain}
          />
        )}

        <div className="mt-5 flex justify-end gap-1">
          {step === 'finalize-creation' && (
            <DialogButton onClick={() => setStep('specify-template')}>
              Back
            </DialogButton>
          )}
          {step === 'specify-template' && (
            <DialogButton
              disabled={!templateId || !fileName}
              onClick={() => setStep('finalize-creation')}
            >
              Next
            </DialogButton>
          )}
          {step === 'finalize-creation' && templateId && fileName && (
            <DialogButton
              disabled={!templateId || !fileName}
              onClick={() => mutation.mutate()}
            >
              Create shape
            </DialogButton>
          )}
        </div>
        <div className="flex text-xs">
          {mutation.isPending && <div>Creating shape...</div>}
          {mutation.isError && (
            <div>Error creating shape, {mutation.error.message}</div>
          )}
          {mutation.isSuccess && (
            <div>Shape created or updated successfully</div>
          )}
        </div>
        <Dialog.Close asChild>
          <div
            className="absolute top-2.5 right-2.5 inline-flex cursor-pointer appearance-none items-center justify-center rounded-full focus:outline-none"
            aria-label="Close"
          >
            <XIcon className="stroke-coffee-200" />
          </div>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
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

function DialogButton({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="border border-coffee-400 px-3 py-1 text-sm hover:bg-coffee-500"
    >
      {children}
    </button>
  )
}

function SelectPredefinedTemplate({
  templates,
  templateId,
  setTemplateId,
  templateValidationMessage,
  fileName,
  setFileName,
  fileNameValidationMessage,
}: {
  templates: Record<string, string[]>
  templateId: string | undefined
  setTemplateId: (templateId: string) => void
  templateValidationMessage: string | undefined
  fileName: string | undefined
  setFileName: (fileName: string) => void
  fileNameValidationMessage: string | undefined
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-0.5">
        <label className="text-xs">Template ID</label>
        <input
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
          type="text"
          className="border border-coffee-400 bg-coffee-400/20 px-2 py-1 text-sm"
        />
        {templateValidationMessage && (
          <span className="text-red-500">{templateValidationMessage}</span>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <label className="text-xs">Filename</label>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="border border-coffee-400 bg-coffee-400/20 px-2 py-1 text-sm"
        />
        {fileNameValidationMessage && (
          <span className="text-red-500">{fileNameValidationMessage}</span>
        )}
      </div>
      <h3 className="text-sm">Available templates</h3>

      <div className="flex max-h-[40vh] flex-col overflow-y-auto border border-1 p-1 text-sm leading-tight">
        {templates && Object.keys(templates).length > 0 ? (
          Object.entries(templates).map(([name, templates]) => (
            <Folder
              key={name}
              name={name}
              entries={templates}
              selected={templateId}
              setSelected={setTemplateId}
            />
          ))
        ) : (
          <div className="text-center text-coffee-400">No templates found</div>
        )}
      </div>
    </div>
  )
}

function FinalizeTemplate({
  templateId,
  fileName,
  address,
  chain,
}: {
  templateId: string
  fileName: string
  address: string
  chain: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col leading-tight">
        <span className="text-coffee-400 text-sm">Template ID</span>
        <span>{templateId}</span>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-coffee-400 text-sm">Filename</span>
        <span>{fileName}</span>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-coffee-400 text-sm">Address</span>
        <span>{address}</span>
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-coffee-400 text-sm">Chain</span>
        <span>{chain}</span>
      </div>
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
  selected: string | undefined
  setSelected: (selected: string) => void
}) {
  const [isOpen, setIsOpen] = useState(true)

  if (entries.length === 0) {
    return (
      <div
        className="flex cursor-pointer gap-1 hover:text-coffee-400 hover:underline"
        onClick={() => setSelected(name)}
      >
        <IconContract className="size-2" />
        <span>{name}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="group flex cursor-pointer items-center gap-1">
        <div onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <IconFolderOpened /> : <IconFolder />}
        </div>
        <span
          className="group-hover:text-coffee-400 group-hover:underline"
          onClick={() => setSelected(name)}
        >
          {name}
        </span>
      </div>
      {isOpen && (
        <div className="mb-2 ml-2 flex cursor-default flex-col">
          {entries.map((entry) => {
            const key = `${name}/${entry}`
            const isSelected = selected === key
            return (
              <span
                className={clsx(
                  'cursor-pointer border-1 border-coffee-200 border-l py-0.5 pl-3 text-xs hover:underline',
                  isSelected && 'text-coffee-400 ',
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
