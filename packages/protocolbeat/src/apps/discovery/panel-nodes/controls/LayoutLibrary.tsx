import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  getProjectLayout,
  listProjectLayouts,
  saveProjectLayout,
} from '../../../../api/api'
import { Button } from '../../../../components/Button'
import { Checkbox } from '../../../../components/Checkbox'
import { Dialog } from '../../../../components/Dialog'
import { Input, InputDescription } from '../../../../components/Input'
import { TextArea } from '../../../../components/TextArea'
import { IconDownload } from '../../../../icons/IconDownload'
import { IconFileUp } from '../../../../icons/IconFileUp'
import { IconFolder } from '../../../../icons/IconFolder'
import { cn } from '../../../../utils/cn'
import type { ApplyLayoutMode } from '../store/actions/applyStoredLayout'
import { useStore } from '../store/store'
import { type LayoutMetadata, migrateLayout } from '../store/utils/layout'
import {
  buildStoredNodeLayout,
  type StoredNodeLayout,
} from '../store/utils/storage'
import { ControlButton } from './ControlButton'

interface PendingLayout {
  sourceLabel: string
  data: StoredNodeLayout
  migratedFrom: number
}

interface LoadError {
  sourceLabel: string
  message: string
}

export function LayoutLibrary(props?: { className?: string }) {
  const queryClient = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState<PendingLayout | null>(null)
  const [error, setError] = useState<LoadError | null>(null)
  const projectId = useStore((state) => state.projectId)
  const nodeCount = useStore((state) => state.nodes.length)
  const [layoutName, setLayoutName] = useState('')
  const [description, setDescription] = useState('')
  const [overwriteArmed, setOverwriteArmed] = useState(false)
  const [loadingName, setLoadingName] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    setLayoutName(projectId)
    setDescription('')
    setOverwriteArmed(false)
  }, [open, projectId])

  useEffect(() => {
    setOverwriteArmed(false)
  }, [layoutName, projectId])

  const layoutsQuery = useQuery({
    queryKey: ['project-layouts', projectId],
    queryFn: () => listProjectLayouts(projectId),
    enabled: open && projectId.length > 0,
  })

  const existingNames = useMemo(
    () => new Set((layoutsQuery.data ?? []).map((layout) => layout.name)),
    [layoutsQuery.data],
  )

  const saveMutation = useMutation({
    mutationFn: async ({
      name,
      overwrite,
    }: {
      name: string
      overwrite: boolean
    }) => {
      const state = useStore.getState()
      if (state.nodes.length === 0 || !state.projectId) {
        throw new Error('Load a project before saving a layout.')
      }

      const layout = buildStoredNodeLayout(
        state,
        buildLayoutMetadata(description),
      )
      return await saveProjectLayout(state.projectId, name, layout, overwrite)
    },
    onSuccess: async (_response, variables) => {
      await queryClient.invalidateQueries({
        queryKey: ['project-layouts', projectId],
      })
      setOverwriteArmed(false)
      setLayoutName(variables.name)
      toast.success(`Saved layout "${variables.name}"`)
    },
    onError: (error) => {
      if (error.message.includes('already exists')) {
        setOverwriteArmed(true)
      }
      toast.error('Failed to save layout', {
        description: <pre>{error.message}</pre>,
      })
    },
  })

  const loadMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await getProjectLayout(projectId, name)
      return {
        name,
        layout: response.layout,
      }
    },
    onMutate: (name) => {
      setLoadingName(name)
    },
    onSuccess: ({ name, layout }) => {
      setOpen(false)
      handleLoadedLayout(layout, `${name}.json`)
    },
    onError: (error, name) => {
      setOpen(false)
      setError({
        sourceLabel: `${name}.json`,
        message: error.message,
      })
    },
    onSettled: () => {
      setLoadingName(null)
    },
  })

  const canPersistCurrentLayout = projectId.length > 0 && nodeCount > 0

  const onUploadClick = () => {
    inputRef.current?.click()
  }

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    let raw: unknown
    try {
      raw = JSON.parse(await file.text())
    } catch (err) {
      setOpen(false)
      setError({
        sourceLabel: file.name,
        message: err instanceof Error ? err.message : 'Failed to read file.',
      })
      return
    }

    setOpen(false)
    handleLoadedLayout(raw, file.name)
  }

  const onDownloadCurrent = () => {
    const state = useStore.getState()
    if (state.nodes.length === 0 || !state.projectId) {
      return
    }

    const normalizedName = normalizeLayoutName(layoutName) || state.projectId
    setLayoutName(normalizedName)

    const layout = buildStoredNodeLayout(
      state,
      buildLayoutMetadata(description),
    )
    downloadLayoutFile(layout, normalizedName)
  }

  const onSaveCurrent = () => {
    const normalizedName = normalizeLayoutName(layoutName)
    setLayoutName(normalizedName)

    if (normalizedName.length === 0) {
      toast.error('Layout name cannot be empty.')
      return
    }

    if (existingNames.has(normalizedName) && !overwriteArmed) {
      setOverwriteArmed(true)
      return
    }

    saveMutation.mutate({
      name: normalizedName,
      overwrite: overwriteArmed,
    })
  }

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <ControlButton
            className={props?.className}
            disabled={!projectId}
            aria-label="Layout library"
            title="Layout library"
          >
            <IconFolder />
          </ControlButton>
        </Dialog.Trigger>
        <Dialog.Body className="max-w-[720px]">
          <Dialog.Title>Layout library</Dialog.Title>
          <Dialog.Description className="mb-4 text-coffee-200">
            Load a committed layout, import one from a JSON file, or save the
            current view to the repo.
          </Dialog.Description>

          <div className="flex flex-col gap-4">
            <Section title="Committed layouts">
              {projectId ? (
                <>
                  <div className="max-h-56 overflow-y-auto border border-coffee-400 bg-coffee-400/10">
                    {layoutsQuery.isPending ? (
                      <EmptyState>Loading committed layouts...</EmptyState>
                    ) : layoutsQuery.isError ? (
                      <EmptyState>Failed to load committed layouts.</EmptyState>
                    ) : (layoutsQuery.data?.length ?? 0) === 0 ? (
                      <EmptyState>
                        No committed layouts in{' '}
                        <code>{`packages/config/src/projects/${projectId}/layouts`}</code>
                        .
                      </EmptyState>
                    ) : (
                      <div className="divide-y divide-coffee-500">
                        {layoutsQuery.data?.map((layout) => (
                          <div
                            key={layout.name}
                            className="flex items-start justify-between gap-3 p-3"
                          >
                            <div className="min-w-0">
                              <div className="font-medium text-sm">
                                {layout.name}
                              </div>
                              <div className="mt-1 text-coffee-200 text-xs">
                                {layout.description ?? 'No description'}
                              </div>
                            </div>
                            <Button
                              size="small"
                              onClick={() => loadMutation.mutate(layout.name)}
                              disabled={loadingName !== null}
                            >
                              {loadingName === layout.name
                                ? 'Loading...'
                                : 'Load'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <InputDescription>
                    Files are read from{' '}
                    <code>{`packages/config/src/projects/${projectId}/layouts/*.json`}</code>
                  </InputDescription>
                </>
              ) : (
                <EmptyState>Project is not loaded yet.</EmptyState>
              )}
            </Section>

            <Section title="Import from file">
              <div className="flex items-center justify-between gap-3">
                <p className="text-coffee-200 text-sm">
                  Load a shared JSON layout from disk, then choose merge or
                  replace before applying it.
                </p>
                <Button onClick={onUploadClick}>
                  <span className="mr-2">
                    <IconFileUp />
                  </span>
                  Upload
                </Button>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={onFileChange}
              />
            </Section>

            <Section title="Current layout">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <label className="flex flex-col gap-1">
                  <span className="font-medium text-xs">Name</span>
                  <Input
                    value={layoutName}
                    onChange={(e) => setLayoutName(e.target.value)}
                    placeholder={projectId || 'layout name'}
                    disabled={!canPersistCurrentLayout}
                  />
                </label>
                <label className="flex flex-col gap-1 md:col-span-2">
                  <span className="font-medium text-xs">Description</span>
                  <TextArea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What this layout is for."
                    className="min-h-20"
                    disabled={!canPersistCurrentLayout}
                  />
                </label>
              </div>
              <InputDescription>
                Save path:{' '}
                <code>
                  {projectId
                    ? `packages/config/src/projects/${projectId}/layouts/${normalizeLayoutName(layoutName) || '<name>'}.json`
                    : 'Load a project first'}
                </code>
              </InputDescription>
              {overwriteArmed && (
                <div className="border border-aux-orange/60 bg-aux-orange/10 p-2 text-aux-orange text-xs">
                  Layout already exists. Click overwrite to replace the
                  committed file.
                </div>
              )}
              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  onClick={onDownloadCurrent}
                  disabled={!canPersistCurrentLayout}
                >
                  <span className="mr-2">
                    <IconDownload />
                  </span>
                  Download
                </Button>
                <Button
                  variant={overwriteArmed ? 'destructive' : 'solid'}
                  onClick={onSaveCurrent}
                  disabled={!canPersistCurrentLayout || saveMutation.isPending}
                >
                  {saveMutation.isPending
                    ? 'Saving...'
                    : overwriteArmed
                      ? 'Overwrite'
                      : 'Save to repo'}
                </Button>
              </div>
            </Section>
          </div>
        </Dialog.Body>
      </Dialog.Root>

      <Dialog.Root
        open={pending !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setPending(null)
          }
        }}
      >
        {pending && (
          <ConfirmLoadDialog
            pending={pending}
            onClose={() => setPending(null)}
          />
        )}
      </Dialog.Root>

      <Dialog.Root
        open={error !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setError(null)
          }
        }}
      >
        {error && (
          <ErrorDialog
            sourceLabel={error.sourceLabel}
            message={error.message}
          />
        )}
      </Dialog.Root>
    </>
  )

  function handleLoadedLayout(raw: unknown, sourceLabel: string) {
    const result = migrateLayout(raw)
    if (!result.ok) {
      setError({ sourceLabel, message: result.message })
      return
    }

    setPending({
      sourceLabel,
      data: result.layout,
      migratedFrom: result.migratedFrom,
    })
  }
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-2 border border-coffee-400 bg-coffee-700/40 p-3">
      <h3 className="font-medium text-sm">{title}</h3>
      {children}
    </section>
  )
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-3 text-center text-coffee-200 text-sm">{children}</div>
  )
}

function ConfirmLoadDialog({
  pending,
  onClose,
}: {
  pending: PendingLayout
  onClose: () => void
}) {
  const currentProjectId = useStore((s) => s.projectId)
  const apply = useStore((s) => s.applyStoredLayout)
  const [mode, setMode] = useState<ApplyLayoutMode>('merge')
  const projectMismatch = pending.data.projectId !== currentProjectId
  const [mismatchAck, setMismatchAck] = useState(false)

  const positions = Object.keys(pending.data.locations).length
  const colors = pending.data.colors
    ? Object.values(pending.data.colors).filter(
        (c) => typeof c === 'number' && c !== 0,
      ).length
    : 0
  const hiddenFields = pending.data.hiddenFields
    ? Object.keys(pending.data.hiddenFields).length
    : 0
  const hiddenNodes = pending.data.hiddenNodes?.length ?? 0

  const canApply = !projectMismatch || mismatchAck

  const onApply = () => {
    if (!canApply) return
    apply(pending.data, mode)
    onClose()
  }

  return (
    <Dialog.Body>
      <Dialog.Title>Load layout</Dialog.Title>
      <div className="mb-3 text-coffee-200 text-xs">
        <div>Source: {pending.sourceLabel}</div>
        {pending.data.metadata?.description && (
          <div className="mt-1 whitespace-pre-wrap text-coffee-100">
            {pending.data.metadata.description}
          </div>
        )}
        <div>
          Layout version: v{pending.migratedFrom}
          {pending.migratedFrom !== pending.data.version &&
            ` (migrated to v${pending.data.version})`}
        </div>
        <div className="mt-1 grid grid-cols-2 gap-x-4">
          <span>Positions: {positions}</span>
          <span>Hidden nodes: {hiddenNodes}</span>
          <span>Colors: {colors}</span>
          <span>Hidden fields (nodes): {hiddenFields}</span>
        </div>
      </div>

      {projectMismatch && (
        <div className="mb-3 border border-aux-orange/60 bg-aux-orange/10 p-2 text-xs">
          <div className="font-medium text-aux-orange">Project mismatch</div>
          <div className="mt-1 text-coffee-100">
            File project: <code>{pending.data.projectId}</code>
          </div>
          <div className="text-coffee-100">
            Current project: <code>{currentProjectId}</code>
          </div>
          <div className="mt-1 text-coffee-200">
            Layout may not work. Node IDs likely differ.
          </div>
          <label
            className="mt-2 flex items-center gap-2 text-coffee-100"
            onClick={() => setMismatchAck(!mismatchAck)}
          >
            <Checkbox checked={mismatchAck} />
            <span>Apply anyway</span>
          </label>
        </div>
      )}

      <div className="mb-4 flex flex-col gap-2 text-sm">
        <ModeOption
          label="Merge"
          description="Overwrite matching node IDs and keep other nodes untouched. Hidden lists are unioned."
          checked={mode === 'merge'}
          onChange={() => setMode('merge')}
        />
        <ModeOption
          label="Replace"
          description="Apply file as-is. Nodes not in file get reset color and field visibility."
          checked={mode === 'replace'}
          onChange={() => setMode('replace')}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="solid" onClick={onApply} disabled={!canApply}>
          Apply
        </Button>
      </div>
    </Dialog.Body>
  )
}

function ModeOption({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label
      className={cn(
        'flex cursor-pointer gap-2 border p-2',
        checked ? 'border-coffee-200 bg-coffee-700' : 'border-coffee-500',
      )}
    >
      <input
        type="radio"
        className="mt-1"
        checked={checked}
        onChange={onChange}
      />
      <div className="flex flex-col">
        <span className="font-medium text-sm">{label}</span>
        <span className="text-coffee-200 text-xs">{description}</span>
      </div>
    </label>
  )
}

function ErrorDialog({
  sourceLabel,
  message,
}: {
  sourceLabel: string
  message: string
}) {
  return (
    <Dialog.Body>
      <Dialog.Title>Could not load layout</Dialog.Title>
      <div className="mb-3 text-coffee-200 text-xs">Source: {sourceLabel}</div>
      <div className="mb-4 text-aux-red text-sm">{message}</div>
      <div className="flex justify-end">
        <Dialog.Close asChild>
          <Button>Close</Button>
        </Dialog.Close>
      </div>
    </Dialog.Body>
  )
}

function buildLayoutMetadata(description: string): LayoutMetadata | undefined {
  const trimmedDescription = description.trim()
  if (trimmedDescription === '') {
    return undefined
  }
  return { description: trimmedDescription }
}

function normalizeLayoutName(value: string): string {
  return value.trim().replace(/\.json$/i, '')
}

function downloadLayoutFile(layout: StoredNodeLayout, name: string) {
  const blob = new Blob([JSON.stringify(layout, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${name}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
