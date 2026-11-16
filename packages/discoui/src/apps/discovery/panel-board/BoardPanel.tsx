import { useIsFetching } from '@tanstack/react-query'
import { useMatch, useNavigate } from 'react-router'
import type {
  ApiAgentBoard,
  ApiBoardBlock,
  ApiBoardCell,
} from '../../../api/types'
import { Button } from '../../../components/Button'
import { Markdown } from '../../../components/Markdown'
import { useProjectQueryOptions } from '../hooks/projectQuery'
import { usePanelStore } from '../store/panel-store'
import { useBoardStore } from './boardStore'

// What the agent put on its board: text and tables of the project, read
// only. Each new board replaces this one.
export function BoardPanel() {
  const board = useBoardStore((state) => state.board)
  if (board === undefined) {
    return (
      <p className="px-3 py-2 text-coffee-400 text-xs">
        No board yet. Ask the agent for a list or a comparison, like every
        contract and who can upgrade it.
      </p>
    )
  }
  return <Board board={board} />
}

function Board(props: { board: ApiAgentBoard }) {
  const { board } = props
  const project = useMatch('/ui/p/:project')?.params.project
  const navigate = useNavigate()
  // A new board may name contracts discovered since the project loaded, and
  // selecting one before the refetch lands would fall back to the first.
  const isRefreshing =
    useIsFetching({
      queryKey: useProjectQueryOptions(board.project).queryKey,
    }) > 0
  // Addresses select contracts of the graph on screen, so they link only
  // in the board's own project.
  const isOwnProject = board.project === project
  return (
    <div className="flex h-full flex-col gap-3 overflow-y-auto px-3 py-2 text-coffee-200 text-xs">
      <h2 className="font-semibold text-coffee-100 text-sm">{board.title}</h2>
      {!isOwnProject && (
        <p className="flex items-center gap-2 text-coffee-400">
          This board is about {board.project}.
          <Button
            size="small"
            onClick={() =>
              void navigate(`/ui/p/${encodeURIComponent(board.project)}`)
            }
          >
            Open {board.project}
          </Button>
        </p>
      )}
      {board.blocks.map((block, index) => (
        // A board never changes, only gets replaced, so a position names
        // one block.
        <Block
          key={index}
          block={block}
          isLinked={isOwnProject && !isRefreshing}
        />
      ))}
    </div>
  )
}

function Block(props: { block: ApiBoardBlock; isLinked: boolean }) {
  const { block } = props
  if (block.type === 'text') {
    return (
      <Markdown allowHtml={false} className="text-[13px] leading-relaxed">
        {block.text}
      </Markdown>
    )
  }
  return (
    <section className="flex flex-col gap-1">
      {block.title && (
        <h3 className="font-medium text-coffee-100">{block.title}</h3>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {block.columns.map((column, index) => (
                <th
                  key={index}
                  className="border-coffee-600 border-b px-2 py-1 text-left font-medium text-coffee-300"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-coffee-700 border-b">
                {row.map((cell, index) => (
                  <td
                    key={index}
                    className="whitespace-pre-wrap break-words px-2 py-1 align-top"
                  >
                    <Cell cell={cell} isLinked={props.isLinked} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Cell(props: { cell: ApiBoardCell; isLinked: boolean }) {
  const { cell } = props
  if (cell.type === 'text') {
    return cell.text
  }
  const label = cell.name ?? cell.address
  if (!props.isLinked) {
    return <span title={cell.address}>{label}</span>
  }
  return (
    <button
      type="button"
      title={cell.address}
      className="text-left text-autumn-300 hover:underline"
      onClick={() => usePanelStore.getState().select([cell.address])}
    >
      {label}
    </button>
  )
}
