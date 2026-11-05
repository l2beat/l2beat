import { Markdown } from '../../../components/Markdown'
import { IconClose } from '../../../icons/IconClose'
import { useAgentStore, useIsNoteShown } from './store'

// The agent's note for the step on screen, over the graph of its project.
export function AgentNote(props: { project: string }) {
  const isShown = useIsNoteShown(props.project)
  const show = useAgentStore((state) => state.show)
  const index = useAgentStore((state) => state.index)
  const step = show?.steps[index]
  if (!isShown || show === undefined || step === undefined) {
    return null
  }
  const { goTo, clear } = useAgentStore.getState()
  const stepCount = show.steps.length
  return (
    <div className="absolute top-2 right-2 z-30 flex w-96 max-w-[calc(100%-1rem)] flex-col gap-2 rounded-lg border border-coffee-700 bg-coffee-900/95 p-3 text-coffee-200 shadow-lg">
      <Markdown allowHtml={false} className="text-[13px] leading-relaxed">
        {step.note}
      </Markdown>
      <div className="flex items-center gap-1 text-xs">
        <span className="text-coffee-400 tabular-nums">
          Step {index + 1} of {stepCount}
        </span>
        <div className="flex-1" />
        <NoteButton
          title="Previous step (←)"
          disabled={index === 0}
          onClick={() => goTo(index - 1)}
        >
          Prev
        </NoteButton>
        <NoteButton
          title="Next step (→)"
          disabled={index === stepCount - 1}
          onClick={() => goTo(index + 1)}
        >
          Next
        </NoteButton>
        <NoteButton title="Close (Esc)" onClick={clear}>
          <IconClose className="size-3" />
        </NoteButton>
      </div>
    </div>
  )
}

function NoteButton(props: {
  title: string
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={props.title}
      disabled={props.disabled}
      onClick={props.onClick}
      className="flex h-6 min-w-6 items-center justify-center rounded-sm px-1.5 hover:bg-coffee-700 disabled:opacity-30"
    >
      {props.children}
    </button>
  )
}
