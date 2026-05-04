import clsx from 'clsx'
import { useRef, useState } from 'react'
import { Button } from '../../../../components/Button'
import { Checkbox } from '../../../../components/Checkbox'
import { Dialog } from '../../../../components/Dialog'
import { IconDownload } from '../../../../icons/IconDownload'
import { IconFileUp } from '../../../../icons/IconFileUp'
import type { ApplyLayoutMode } from '../store/actions/applyStoredLayout'
import { useStore } from '../store/store'
import { buildStoredNodeLayout, StoredNodeLayout } from '../store/utils/storage'
import { ControlButton } from './ControlButton'

interface PendingLayout {
  filename: string
  data: StoredNodeLayout
}

interface LoadError {
  filename: string
  message: string
}

export function LayoutFileButtons() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<PendingLayout | null>(null)
  const [error, setError] = useState<LoadError | null>(null)
  const clear = () => {
    setPending(null)
    setError(null)
  }

  const onSave = () => {
    const state = useStore.getState()
    if (state.nodes.length === 0 || !state.projectId) {
      return
    }
    const layout = buildStoredNodeLayout(state)
    const blob = new Blob([JSON.stringify(layout, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${state.projectId}-layout.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const onLoadClick = () => {
    inputRef.current?.click()
  }

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const raw = JSON.parse(await file.text())
      const result = StoredNodeLayout.safeParse(raw)
      if (!result.success) {
        setError({
          filename: file.name,
          message: 'File is not a valid layout file.',
        })
        return
      }
      setPending({ filename: file.name, data: result.data })
      setError(null)
    } catch (err) {
      setError({
        filename: file.name,
        message: err instanceof Error ? err.message : 'Failed to read file.',
      })
    }
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-1">
        <ControlButton onClick={onLoadClick}>
          <IconFileUp />
        </ControlButton>
        <ControlButton onClick={onSave}>
          <IconDownload />
        </ControlButton>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={onFileChange}
        />
      </div>
      <Dialog.Root
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) clear()
        }}
      >
        {pending && <ConfirmLoadDialog pending={pending} onClose={clear} />}
      </Dialog.Root>
      <Dialog.Root
        open={error !== null}
        onOpenChange={(open) => {
          if (!open) clear()
        }}
      >
        {error && (
          <ErrorDialog filename={error.filename} message={error.message} />
        )}
      </Dialog.Root>
    </>
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
        <div>File: {pending.filename}</div>
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
            Layout may not work — node IDs likely differ.
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
          description="Overwrite matching node IDs; leave others untouched. Hidden lists are unioned."
          checked={mode === 'merge'}
          onChange={() => setMode('merge')}
        />
        <ModeOption
          label="Replace"
          description="Apply file as-is. Nodes not in file get reset color and field-visibility; hidden list comes only from the file."
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
      className={clsx(
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
  filename,
  message,
}: {
  filename: string
  message: string
}) {
  return (
    <Dialog.Body>
      <Dialog.Title>Could not load layout</Dialog.Title>
      <div className="mb-3 text-coffee-200 text-xs">File: {filename}</div>
      <div className="mb-4 text-aux-red text-sm">{message}</div>
      <div className="flex justify-end">
        <Dialog.Close asChild>
          <Button>Close</Button>
        </Dialog.Close>
      </div>
    </Dialog.Body>
  )
}
