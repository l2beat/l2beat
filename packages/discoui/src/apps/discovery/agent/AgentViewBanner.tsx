import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { IconSparkle } from '../../../icons/IconSparkle'
import { useStore as useNodeStore } from '../panel-nodes/store/store'
import { SELECTABLE_COLORS } from '../panel-nodes/view/colors/colors'
import { oklchColorToCSS } from '../panel-nodes/view/colors/oklch'
import type { ViewGroup } from './applyView'
import { fitGraphTo } from './store'
import {
  discardAgentView,
  keepAgentView,
  type PendingView,
  saveAgentView,
} from './viewStore'

// Nothing the agent does to the graph is final until the researcher keeps
// it, so the view waits here with the three ways out.
export function AgentViewBanner(props: { pending: PendingView }) {
  const { pending } = props
  const [saving, setSaving] = useState(false)
  const { visible, total } = pending.receipt

  return (
    <div className="pointer-events-auto rounded-lg border border-coffee-700 bg-coffee-900/95 text-coffee-200 shadow-[0_16px_32px_-20px_#000000ee] backdrop-blur-sm">
      <div className="flex items-center gap-2 py-2 pr-2 pl-3">
        <span className="flex shrink-0 items-center gap-1.5 rounded-sm bg-aux-purple/15 px-1.5 py-0.5 text-[#d68ae0] text-[11px]">
          <IconSparkle className="size-2.5" />
          Pending view
        </span>
        <span
          className="min-w-0 truncate font-bold text-[13px]"
          title={pending.title}
        >
          {pending.title}
        </span>
        {pending.changes > 1 && (
          <span className="shrink-0 text-[11px] text-coffee-400">
            {pending.changes} changes
          </span>
        )}
        <div className="flex-1" />
        {!saving && <Decision onSave={() => setSaving(true)} />}
      </div>
      <div className="flex flex-col gap-2 px-3 pb-3">
        {pending.note !== undefined && (
          <p className="whitespace-pre-wrap text-[13px] leading-relaxed">
            {pending.note}
          </p>
        )}
        {pending.groups.length > 0 && <Legend groups={pending.groups} />}
        <span className="text-[11px] text-coffee-400">
          {visible} of {total} contracts visible
          {total > visible ? ` · ${total - visible} hidden` : ''}
        </span>
        {saving && (
          <SaveForm
            initialName={pending.title}
            onDone={() => setSaving(false)}
          />
        )}
      </div>
    </div>
  )
}

function Decision(props: { onSave: () => void }) {
  return (
    <div className="flex shrink-0 items-center gap-1 text-xs">
      <button
        type="button"
        onClick={() => {
          discardAgentView()
          toast.info('Your graph is back as it was')
        }}
        title="Put your graph back as it was before the agent changed it"
        className="rounded-sm px-2 py-1 text-coffee-400 hover:bg-coffee-700 hover:text-coffee-200"
      >
        Discard
      </button>
      <button
        type="button"
        onClick={props.onSave}
        title="Keep them and save the graph as a layout in the project"
        className="rounded-sm border border-coffee-600 px-2 py-[3px] hover:border-coffee-400"
      >
        Save as layout…
      </button>
      <button
        type="button"
        onClick={() => {
          keepAgentView()
          toast.info('Kept the agent view', {
            description: 'Undo still reverts it',
          })
        }}
        title="Keep these changes in your graph; undo still reverts them"
        className="rounded-sm bg-[#d68ae0] px-2.5 py-1 font-bold text-black hover:brightness-110"
      >
        Keep
      </button>
    </div>
  )
}

function Legend(props: { groups: ViewGroup[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {props.groups.map((group) => (
        <button
          key={group.id}
          type="button"
          onClick={() => fitGraphTo(new Set(memberIds(group.id)))}
          title="Zoom to this group"
          className="flex items-center gap-1.5 rounded-full border border-coffee-700 py-0.5 pr-2 pl-1.5 text-xs hover:border-coffee-600 hover:bg-coffee-800"
        >
          <span
            className="size-2.5 shrink-0 rounded-full"
            style={{ background: swatch(group.color) }}
          />
          <span className="truncate">{group.name}</span>
          <span className="text-coffee-400 tabular-nums">{group.members}</span>
        </button>
      ))}
    </div>
  )
}

function SaveForm(props: { initialName: string; onDone: () => void }) {
  const [name, setName] = useState(props.initialName)
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)
  const queryClient = useQueryClient()
  const projectId = useNodeStore((state) => state.projectId)

  const save = async () => {
    setBusy(true)
    try {
      await saveAgentView(name.trim())
      await queryClient.invalidateQueries({
        queryKey: ['project-layouts', projectId],
      })
      toast.success(`Saved layout "${name.trim()}"`, {
        description: 'It is in the layout library and stays as your graph',
      })
      props.onDone()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Saving failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form
      className="flex items-center gap-1 text-xs"
      onSubmit={(event) => {
        event.preventDefault()
        void save()
      }}
    >
      <input
        autoFocus
        value={name}
        onChange={(event) => setName(event.target.value)}
        aria-label="Layout name"
        className="min-w-0 flex-1 rounded-sm border border-coffee-600 bg-coffee-800 px-2 py-1 text-coffee-200 focus:border-coffee-400 focus:outline-hidden"
      />
      <button
        type="submit"
        disabled={busy || name.trim().length === 0}
        className="rounded-sm bg-[#d68ae0] px-2.5 py-1 font-bold text-black hover:brightness-110 disabled:opacity-40"
      >
        Save
      </button>
      {/* Discarding while the save runs would save a layout it then undoes. */}
      <button
        type="button"
        onClick={props.onDone}
        disabled={busy}
        className="rounded-sm px-2 py-1 text-coffee-400 hover:bg-coffee-700 hover:text-coffee-200 disabled:opacity-40"
      >
        Cancel
      </button>
      {error !== undefined && <span className="text-aux-red">{error}</span>}
    </form>
  )
}

function memberIds(groupId: string): string[] {
  const group = useNodeStore.getState().nodes.find((n) => n.id === groupId)
  return group?.subnodes.map((node) => node.id) ?? [groupId]
}

function swatch(color: number): string {
  const entry = SELECTABLE_COLORS[color - 1]
  return entry === undefined ? 'transparent' : oklchColorToCSS(entry.color)
}
