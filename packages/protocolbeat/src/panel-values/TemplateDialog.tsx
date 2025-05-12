import * as Dialog from '@radix-ui/react-dialog'
import { useQuery } from '@tanstack/react-query'
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
  const [selected, setSelected] = useState<string | undefined>(undefined)
  const [selectionMode, setSelectionMode] = useState<'existing' | 'new'>(
    'existing',
  )
  const {
    data: templates,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['templates'],
    queryFn: () => listTemplates(),
  })

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 data-[state=open]:bg-coffee-900/60" />
      <Dialog.Content className="-translate-x-1/2 -translate-y-1/2 overflow-x-none fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[500px] overflow-y-auto border border-coffee-400 bg-coffee-600 p-[25px] shadow-[var(--shadow-6)] focus:outline-none">
        <Dialog.Title className="mb-3 font-medium text-lg">
          Available templates
        </Dialog.Title>

        {isLoading && <div>Loading...</div>}
        {isError && <div>Error loading templates</div>}
        {selected && (
          <div>
            <span>{selected}</span>
          </div>
        )}
        {templates && step === 'specify-template' && (
          <>
            <div className="mb-4 flex flex-col">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="templateMode"
                  checked={selectionMode === 'existing'}
                  onChange={() => setSelectionMode('existing')}
                  className="accent-coffee-300"
                />
                <span>Use existing template</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="templateMode"
                  checked={selectionMode === 'new'}
                  onChange={() => setSelectionMode('new')}
                  className="accent-coffee-300"
                />
                <span>Create new template</span>
              </label>
            </div>

            {selectionMode === 'existing' && (
              <SelectPredefinedTemplate
                templates={templates}
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {selectionMode === 'new' && (
              <div>
                <span>New template</span>
              </div>
            )}
          </>
        )}
        {step === 'finalize-creation' && (
          <div className="flex flex-col gap-2">
            <span>Finalize creation</span>
            <div className="flex flex-col gap-2">
              <span>Address</span>
              <span>{address}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span>Project</span>
              <span>{project}</span>
            </div>
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <DialogButton
            disabled={!selected}
            onClick={() => setStep('finalize-creation')}
          >
            Next
          </DialogButton>
          {selected && (
            <DialogButton
              disabled={!selected}
              onClick={() => createShape(project, chain, address, selected)}
            >
              Finalize
            </DialogButton>
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
  selected,
  setSelected,
}: {
  templates: Record<string, string[]>
  selected: string | undefined
  setSelected: (selected: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-sm">Select existing template</h3>
      <div className="flex max-h-[40vh] flex-col overflow-y-auto border border-1 p-1 text-sm leading-tight">
        {Object.entries(templates).map(([name, templates]) => (
          <Folder
            key={name}
            name={name}
            entries={templates}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
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
  const [isOpen, setIsOpen] = useState(false)

  if (entries.length === 0) {
    return (
      <div className="flex cursor-default gap-1">
        <IconContract className="size-2" />
        <span>{name}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div
        className="group flex cursor-pointer items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <IconFolderOpened /> : <IconFolder />}
        <span className="group-hover:text-coffee-400 group-hover:underline">
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
