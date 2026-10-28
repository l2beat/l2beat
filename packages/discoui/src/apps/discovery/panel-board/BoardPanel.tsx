import { useQuery } from '@tanstack/react-query'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'sonner'
import type { EditorFile } from '../../../components/editor/store'
import { JsonEditorView } from '../../../components/editor/views/lazy'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/Popover'
import { IconBoard } from '../../../icons/IconBoard'
import { IconChevronDown } from '../../../icons/IconChevronDown'
import { IconClose } from '../../../icons/IconClose'
import { IconCode } from '../../../icons/IconCode'
import { IconPlus } from '../../../icons/IconPlus'
import { cn } from '../../../utils/cn'
import { AGENT_CONNECTED } from '../agent/AgentBridge'
import { useProjectQueryOptions } from '../hooks/projectQuery'
import { BoardBlockView } from './BoardBlocks'
import {
  activateBoard,
  type BoardList,
  BoardRequestError,
  type BoardSummary,
  closeBoard,
  confirmLeavingDraft,
  createBoard,
  getBoard,
  listBoards,
  type ResolvedBoard,
  refreshBoards,
  replaceBoard,
  saveBoard,
  useBoardUiStore,
} from './boardApi'

const NEW_BOARD_SPEC = {
  title: 'New board',
  blocks: [
    {
      type: 'text',
      text: 'Every multisig, its threshold and what it can upgrade.',
    },
    {
      type: 'table',
      title: 'Multisigs',
      rows: ['type:multisig'],
      columns: [
        { label: 'Multisig', property: 'name' },
        { label: 'Threshold', field: '$threshold' },
        { label: 'Can upgrade', selector: 'upgradeableBy:{row}' },
      ],
    },
  ],
}

// Boards are pages of tables, text and view buttons bound to the discovery.
// The AI panel writes them when asked, and a researcher can open, edit and
// save the same JSON by hand.
export function BoardPanel() {
  const { project } = useParams()
  if (project === undefined) {
    throw new Error('Cannot use component outside of project page!')
  }
  const revision = useBoardUiStore((state) => state.revision)
  const chosen = useBoardUiStore((state) => state.activeByProject[project])
  const list = useQuery({
    queryKey: ['boards', project, revision],
    queryFn: () => listBoards(project),
    // Another project's boards would act on this project's graph.
    placeholderData: (previous, previousQuery) =>
      previousQuery?.queryKey[1] === project ? previous : undefined,
  })
  // Board events sent while the stream was down are lost.
  useEffect(() => {
    window.addEventListener(AGENT_CONNECTED, refreshBoards)
    return () => window.removeEventListener(AGENT_CONNECTED, refreshBoards)
  }, [])
  const open = list.data?.open ?? []
  const active = open.find((b) => b.id === chosen) ?? open[open.length - 1]

  return (
    <div className="flex h-full flex-col bg-coffee-900 text-coffee-200">
      {active === undefined ? (
        <>
          <BoardHeader project={project} list={list.data} />
          {list.error !== null && <ErrorNote error={list.error} />}
          {list.data !== undefined && (
            <EmptyBoard project={project} list={list.data} />
          )}
        </>
      ) : (
        <ActiveBoard
          key={active.id}
          project={project}
          summary={active}
          list={list.data}
          listSettled={!list.isFetching}
        />
      )}
    </div>
  )
}

function BoardHeader(props: {
  project: string
  list: BoardList | undefined
  board?: BoardSummary
  children?: ReactNode
}) {
  return (
    <div className="flex h-9 shrink-0 items-center gap-1.5 border-coffee-700 border-b px-3 text-xs">
      <IconBoard className="size-3.5 shrink-0 text-coffee-400" />
      <BoardMenu
        project={props.project}
        list={props.list}
        board={props.board}
      />
      {props.board && <SaveState board={props.board} />}
      <div className="flex-1" />
      {props.children}
      <HeaderButton
        title="New board"
        onClick={() => {
          if (confirmLeavingDraft()) {
            void openBoard(props.project, { spec: NEW_BOARD_SPEC })
          }
        }}
      >
        <IconPlus className="size-3.5" />
      </HeaderButton>
    </div>
  )
}

function SaveState(props: { board: BoardSummary }) {
  const { savedAs, unsaved } = props.board
  const file = savedAs === undefined ? undefined : `boards/${savedAs}.json`
  if (!unsaved) {
    return (
      <span className="min-w-0 truncate text-coffee-400" title={file}>
        {file}
      </span>
    )
  }
  return (
    <span
      className="flex shrink-0 items-center gap-1.5 text-coffee-400"
      title={file === undefined ? undefined : `${file}, changed since saved`}
    >
      <span className="size-1.5 rounded-full bg-aux-orange" />
      {file === undefined ? 'Not saved' : 'Changed'}
    </span>
  )
}

function HeaderButton(props: {
  title: string
  onClick: () => void
  active?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      title={props.title}
      aria-pressed={props.active}
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-sm hover:bg-coffee-700 hover:text-coffee-200',
        props.active ? 'bg-coffee-700 text-coffee-200' : 'text-coffee-400',
      )}
    >
      {props.children}
    </button>
  )
}

// Every board open for the project, and the saved ones to open, in one
// place, the way the AI panel picks a model.
function BoardMenu(props: {
  project: string
  list: BoardList | undefined
  board: BoardSummary | undefined
}) {
  const [open, setOpen] = useState(false)
  const boards = props.list?.open ?? []
  const openFiles = new Set(boards.map((b) => b.savedAs))
  const saved = (props.list?.saved ?? []).filter((s) => !openFiles.has(s.name))
  const pick = (action: () => unknown) => {
    setOpen(false)
    if (confirmLeavingDraft()) {
      void action()
    }
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        title="Switch, close or reopen boards"
        className="flex min-w-0 shrink items-center gap-1 self-center rounded-sm px-1 py-0.5 font-bold hover:bg-coffee-700 focus:ring-0"
      >
        <span className="truncate">{props.board?.title ?? 'Boards'}</span>
        <IconChevronDown className="size-3 shrink-0 text-coffee-400" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex max-h-[70vh] w-72 flex-col gap-3 overflow-y-auto rounded-md border-coffee-600 p-2 text-xs"
      >
        <MenuSection title="Open">
          {boards.length === 0 && (
            <p className="px-1.5 py-1 text-coffee-400">No board open</p>
          )}
          {boards.map((board) => (
            <OpenBoardItem
              key={board.id}
              board={board}
              active={board.id === props.board?.id}
              onPick={() => pick(() => activateBoard(props.project, board.id))}
            />
          ))}
        </MenuSection>
        {saved.length > 0 && (
          <MenuSection title="Saved in the project">
            {saved.map((s) => (
              <button
                key={s.name}
                type="button"
                title={`boards/${s.name}.json`}
                onClick={() =>
                  pick(() => openBoard(props.project, { saved: s.name }))
                }
                className="flex w-full items-center gap-2 rounded-sm px-1.5 py-1 text-left hover:bg-coffee-700"
              >
                <span className="w-3 shrink-0" />
                <span className="truncate text-coffee-200">{s.title}</span>
              </button>
            ))}
          </MenuSection>
        )}
      </PopoverContent>
    </Popover>
  )
}

function MenuSection(props: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1 px-1.5 font-bold text-[10px] text-coffee-400 uppercase tracking-wider">
        {props.title}
      </div>
      {props.children}
    </div>
  )
}

function OpenBoardItem(props: {
  board: BoardSummary
  active: boolean
  onPick: () => void
}) {
  const { board } = props
  return (
    <div
      className={cn(
        'flex items-center rounded-sm hover:bg-coffee-700',
        props.active && 'bg-coffee-800',
      )}
    >
      <button
        type="button"
        onClick={props.onPick}
        className="flex min-w-0 flex-1 items-center gap-2 px-1.5 py-1 text-left"
      >
        <span className="w-3 shrink-0 text-[#d68ae0]">
          {props.active ? '✓' : ''}
        </span>
        <span className="truncate text-coffee-200">{board.title}</span>
        {board.unsaved && (
          <span
            title="Not saved"
            className="size-1.5 shrink-0 rounded-full bg-aux-orange"
          />
        )}
      </button>
      <button
        type="button"
        onClick={() => void close(board)}
        title="Close the board; a saved one stays in the project"
        className="mr-0.5 flex size-5 shrink-0 items-center justify-center rounded-sm text-coffee-600 hover:bg-coffee-600 hover:text-coffee-200"
      >
        <IconClose className="size-3" />
      </button>
    </div>
  )
}

async function openBoard(
  project: string,
  body: { spec: unknown } | { saved: string },
) {
  try {
    await createBoard(project, body)
  } catch (error) {
    toast.error('Could not open the board', { description: describe(error) })
  }
}

function EmptyBoard(props: { project: string; list: BoardList }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-5 py-6">
      <div className="mb-4 flex size-10 items-center justify-center rounded-lg border border-coffee-700 bg-coffee-800">
        <IconBoard className="size-5 text-coffee-400" />
      </div>
      <h2 className="font-bold text-base text-coffee-200">
        No board open for {props.project}
      </h2>
      <p className="mt-1 text-[13px] text-coffee-400 leading-relaxed">
        Ask the AI panel for a table or a list, like "every multisig with its
        threshold and what it can upgrade", or start one by hand.
      </p>
      <div className="mt-5 flex flex-col gap-1.5">
        {props.list.saved.map((saved) => (
          <SuggestionButton
            key={saved.name}
            onClick={() => void openBoard(props.project, { saved: saved.name })}
          >
            {saved.title}
          </SuggestionButton>
        ))}
        <SuggestionButton
          onClick={() =>
            void openBoard(props.project, { spec: NEW_BOARD_SPEC })
          }
        >
          New board
        </SuggestionButton>
      </div>
    </div>
  )
}

function SuggestionButton(props: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className="group flex items-center justify-between gap-2 rounded-md border border-coffee-700 px-3 py-2 text-left text-[13px] text-coffee-200 transition-colors hover:border-coffee-600 hover:bg-coffee-800"
    >
      <span className="truncate">{props.children}</span>
      <span className="text-coffee-600 transition-colors group-hover:text-[#d68ae0]">
        →
      </span>
    </button>
  )
}

// The list settles first, so a board closed elsewhere leaves the panel
// instead of being asked for once more.
function ActiveBoard(props: {
  project: string
  summary: BoardSummary
  list: BoardList | undefined
  listSettled: boolean
}) {
  const revision = useBoardUiStore((state) => state.revision)
  // A discovery run reloads the project, and the board binds to it again.
  const discoveredAt = useQuery(
    useProjectQueryOptions(props.project),
  ).dataUpdatedAt
  const [editing, setEditing] = useState(false)
  const board = useQuery({
    queryKey: ['board', props.summary.id, revision, discoveredAt],
    queryFn: () => getBoard(props.summary.id),
    enabled: props.listSettled,
    placeholderData: (previous) => previous,
    retry: false,
  })
  const header = (
    <BoardHeader
      project={props.project}
      list={props.list}
      board={board.data ?? props.summary}
    >
      {board.data?.unsaved && !editing && (
        <button
          type="button"
          onClick={() => void save(props.summary.id)}
          title="Write the board to the project's boards folder"
          className="shrink-0 rounded-sm bg-coffee-700 px-2 py-0.5 text-coffee-200 hover:bg-coffee-600"
        >
          Save
        </button>
      )}
      <HeaderButton
        title={editing ? 'Back to the board' : 'Edit the board as JSON'}
        active={editing}
        onClick={() => {
          if (!editing || confirmLeavingDraft()) setEditing(!editing)
        }}
      >
        <IconCode className="size-3.5" />
      </HeaderButton>
    </BoardHeader>
  )
  if (board.data === undefined) {
    return (
      <>
        {header}
        {board.error === null ? (
          <p className="px-4 py-3 text-coffee-400 text-xs">Loading…</p>
        ) : (
          <ErrorNote error={board.error} />
        )}
      </>
    )
  }
  return (
    <>
      {header}
      {editing ? (
        <SpecEditor board={board.data} onDone={() => setEditing(false)} />
      ) : (
        <BoardBody project={props.project} board={board.data} />
      )}
    </>
  )
}

function BoardBody(props: { project: string; board: ResolvedBoard }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-4 pt-4 pb-8">
      {props.board.blocks.map((block, index) => (
        <BoardBlockView key={index} project={props.project} block={block} />
      ))}
      <Problems problems={props.board.problems} />
    </div>
  )
}

function Problems(props: { problems: string[] }) {
  if (props.problems.length === 0) return null
  return (
    <div className="rounded-md border border-aux-orange/40 bg-aux-orange/5 px-3 py-2 text-xs">
      <div className="mb-1 font-bold text-[10px] text-aux-orange uppercase tracking-wider">
        Did not bind
      </div>
      {props.problems.map((problem) => (
        <p key={problem} className="text-coffee-200">
          {problem}
        </p>
      ))}
    </div>
  )
}

async function save(id: string) {
  try {
    const { savedAs } = await saveBoard(id)
    toast.success(`Saved to boards/${savedAs}.json`)
  } catch (error) {
    toast.error('Could not save the board', { description: describe(error) })
  }
}

async function close(board: BoardSummary) {
  if (!confirmLeavingDraft(board.id)) {
    return
  }
  if (
    board.unsaved &&
    !window.confirm(`Close "${board.title}"? Its changes are not saved.`)
  ) {
    return
  }
  try {
    await closeBoard(board.id)
  } catch (error) {
    toast.error('Could not close the board', { description: describe(error) })
  }
}

// Edits go through the server like the agent's, so a spec it cannot read
// is refused with the reason and the board stays as it was.
function SpecEditor(props: { board: ResolvedBoard; onDone: () => void }) {
  const { board } = props
  const files = useMemo<EditorFile[]>(
    () => [
      {
        id: `board-${board.id}`,
        name: 'board.json',
        content: `${JSON.stringify(board.spec, null, 2)}\n`,
        readOnly: false,
        language: 'json',
      },
    ],
    // The editor keeps what the researcher typed while the board refetches.
    [board.id],
  )
  const original = files[0]?.content ?? ''
  const [text, setText] = useState(original)
  const [error, setError] = useState<string>()
  useEffect(() => () => useBoardUiStore.setState({ draftOf: undefined }), [])

  const edit = (content: string) => {
    setText(content)
    setError(undefined)
    useBoardUiStore.setState({
      draftOf: content === original ? undefined : board.id,
    })
  }

  const apply = async (content: string) => {
    setError(undefined)
    try {
      await replaceBoard(board.id, JSON.parse(content))
      props.onDone()
    } catch (e) {
      setError(describe(e))
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1">
        <JsonEditorView
          editorId={`board-editor-${board.id}`}
          files={files}
          disableTabs
          callbacks={{
            onChange: edit,
            onSave: (content) => {
              void apply(content)
              return true
            },
          }}
        />
      </div>
      <div className="flex shrink-0 items-start gap-2 border-coffee-700 border-t px-3 py-2 text-xs">
        <p className="min-w-0 flex-1 whitespace-pre-wrap break-words text-aux-red">
          {error}
        </p>
        <button
          type="button"
          onClick={props.onDone}
          className="shrink-0 rounded-sm px-2 py-0.5 text-coffee-400 hover:text-coffee-200"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => void apply(text)}
          title="Apply the JSON to the board (⌘S)"
          className="shrink-0 rounded-sm bg-coffee-200 px-2 py-0.5 font-bold text-black hover:brightness-110"
        >
          Apply
        </button>
      </div>
    </div>
  )
}

function ErrorNote(props: { error: Error }) {
  const closed =
    props.error instanceof BoardRequestError && props.error.status === 404
  return (
    <p className="px-4 py-3 text-aux-red text-xs">
      {closed ? 'This board was closed.' : describe(props.error)}
    </p>
  )
}

function describe(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
