import { useRef, useState } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../components/Popover'
import { IconPlus } from '../../../../icons/IconPlus'
import {
  COMMAND_IDS,
  COMMAND_SECTIONS,
  COMMANDS,
  type CommandId,
} from '../../keybindings/commands'
import { useKeybindingsStore } from '../../keybindings/store'

// Picks the command, then the row it adds records its shortcut.
export function AddKeybindingPopover(props: { onAdded: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const addKeybinding = useKeybindingsStore((s) => s.addKeybinding)
  const pickedRef = useRef(false)

  function add(command: CommandId) {
    pickedRef.current = true
    const id = addKeybinding(command)
    setOpen(false)
    setQuery('')
    props.onAdded(id)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 self-auto rounded-sm border border-coffee-600 px-2.5 text-coffee-100 text-sm hover:bg-coffee-700 focus:ring-1">
        <IconPlus className="size-3.5" />
        <span className="max-sm:hidden">Add keybinding</span>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[min(320px,90vw)] p-2"
        // After a pick the new row's recorder takes focus, and returning it to
        // this trigger would cancel the recording. Otherwise focus returns.
        onCloseAutoFocus={(event) => {
          if (pickedRef.current) {
            event.preventDefault()
            pickedRef.current = false
          }
        }}
      >
        <input
          autoFocus
          value={query}
          placeholder="Search commands"
          aria-label="Search commands"
          className="mb-2 h-7 w-full rounded-sm border border-coffee-600 bg-coffee-800 px-2 text-coffee-100 text-xs placeholder:text-coffee-400 focus:border-autumn-300 focus:outline-hidden"
          onChange={(event) => setQuery(event.target.value)}
        />
        <CommandList query={query} onPick={add} />
      </PopoverContent>
    </Popover>
  )
}

function CommandList(props: {
  query: string
  onPick: (command: CommandId) => void
}) {
  const needle = props.query.trim().toLowerCase()
  const matching = COMMAND_IDS.filter((id) =>
    COMMANDS[id].title.toLowerCase().includes(needle),
  )
  if (matching.length === 0) {
    return <p className="px-1 py-1 text-coffee-400 text-xs">No commands</p>
  }

  return (
    <div className="max-h-64 overflow-y-auto">
      {COMMAND_SECTIONS.map((section) => {
        const inSection = matching
          .filter((id) => COMMANDS[id].section === section)
          .sort((a, b) => COMMANDS[a].title.localeCompare(COMMANDS[b].title))
        if (inSection.length === 0) {
          return null
        }
        return (
          <div key={section} className="mb-1">
            <div className="px-1 py-1 text-coffee-400 text-xs">{section}</div>
            {inSection.map((id) => (
              <button
                key={id}
                type="button"
                className="flex w-full cursor-pointer items-center rounded-xs px-1 py-1 text-left text-coffee-200 text-xs hover:bg-coffee-700 focus:bg-coffee-700 focus:outline-hidden"
                onClick={() => props.onPick(id)}
              >
                {COMMANDS[id].title}
              </button>
            ))}
          </div>
        )
      })}
    </div>
  )
}
