import type { ConfigReader } from '@l2beat/discovery'
import { v as z } from '@l2beat/validate'
import type { Express, Response } from 'express'
import {
  type Board,
  BoardFileError,
  type BoardStore,
  listSavedBoards,
  readSavedBoard,
  writeSavedBoard,
} from './boardStore'
import { parseBoardSpec, type ResolvedBoard, resolveBoard } from './boards'
import { projectSchema, readProjectEntries } from './entries'
import { localOnly } from './localOnly'
import type { AgentReceipt } from './router'
import type { AgentSession } from './session'

const openSavedSchema = z.object({ saved: z.string() })
const specBodySchema = z.object({ spec: z.unknown() })

export interface Boards {
  configReader: ConfigReader
  session: Pick<AgentSession<unknown, AgentReceipt>, 'notify'>
  store: BoardStore
}

export interface BoardEvent {
  type: 'board'
  project: string
  boardId: string
  // Set when the agent made the change: the tab opens the board for the
  // researcher. A change they made shows where they made it.
  reveal: boolean
}

const NO_BOARD = 'No open board with this id'

// The researcher opens, edits, saves and closes boards here; the agent does
// the same through the board tool. Both end in a board event, so every tab
// fetches the board it changed.
export function attachBoardRouter(app: Express, boards: Boards) {
  // Boards run their HTML in the researcher's tab and write into the repo.
  const guard = localOnly('Boards answer only on localhost')
  app.use('/api/boards', guard)
  app.use('/api/projects/:project/boards', guard)
  attachProjectRoutes(app, boards)
  attachOpenBoardRoutes(app, boards)
}

function attachProjectRoutes(app: Express, boards: Boards) {
  const { configReader, store } = boards
  app.get('/api/projects/:project/boards', (req, res) => {
    const project = readProject(req.params.project, configReader, res)
    if (project === undefined) return
    res.json({
      open: store.list(project).map(summarize),
      saved: listSavedBoards(configReader.getProjectPath(project)),
    })
  })

  app.post('/api/projects/:project/boards', (req, res) => {
    const project = readProject(req.params.project, configReader, res)
    if (project === undefined) return
    const saved = openSavedSchema.safeParse(req.body)
    const result = saved.success
      ? openSaved(boards, project, saved.data.saved)
      : openSpec(boards, project, req.body)
    if ('error' in result) {
      res.status(result.status).json({ error: result.error })
      return
    }
    announce(boards, result, false)
    res.json(summarize(result))
  })
}

function attachOpenBoardRoutes(app: Express, boards: Boards) {
  const { configReader, store } = boards
  app.get('/api/boards/:id', (req, res) => {
    const board = store.get(req.params.id)
    if (board === undefined) {
      res.status(404).json({ error: NO_BOARD })
      return
    }
    res.json(withResolved(configReader, board))
  })

  app.put('/api/boards/:id', (req, res) => {
    const spec = readSpec(req.body)
    if (!spec.success) {
      res.status(400).json({ error: spec.message })
      return
    }
    const board = store.replace(req.params.id, spec.data)
    if (board === undefined) {
      res.status(404).json({ error: NO_BOARD })
      return
    }
    announce(boards, board, false)
    res.json(withResolved(configReader, board))
  })

  app.post('/api/boards/:id/save', (req, res) => {
    const board = store.get(req.params.id)
    if (board === undefined) {
      res.status(404).json({ error: NO_BOARD })
      return
    }
    const name = writeSavedBoard(
      configReader.getProjectPath(board.project),
      board,
    )
    const saved = store.markSaved(board.id, name) ?? board
    announce(boards, saved, false)
    res.json(summarize(saved))
  })

  app.delete('/api/boards/:id', (req, res) => {
    const board = store.close(req.params.id)
    if (board !== undefined) {
      announce(boards, board, false)
    }
    res.json({ closed: board !== undefined })
  })
}

export function announce(
  boards: Pick<Boards, 'session'>,
  board: Board,
  reveal: boolean,
): number {
  const event: BoardEvent = {
    type: 'board',
    project: board.project,
    boardId: board.id,
    reveal,
  }
  return boards.session.notify(event)
}

export function resolveBoardOf(
  configReader: ConfigReader,
  board: Pick<Board, 'project' | 'spec'>,
): ResolvedBoard {
  const entries = readProjectEntries(configReader, board.project)
  return resolveBoard(entries, board.spec)
}

function withResolved(configReader: ConfigReader, board: Board) {
  return {
    ...summarize(board),
    spec: board.spec,
    ...resolveBoardOf(configReader, board),
  }
}

type Opened = Board | { status: number; error: string }

function openSaved(boards: Boards, project: string, name: string): Opened {
  const projectPath = boards.configReader.getProjectPath(project)
  try {
    const spec = readSavedBoard(projectPath, name)
    return boards.store.openSaved(project, name, spec)
  } catch (error) {
    if (!(error instanceof BoardFileError)) throw error
    const detail = (error.cause as { error?: string }).error
    return {
      status: error.code === 'not-found' ? 404 : 400,
      error:
        detail === undefined ? error.message : `${error.message}: ${detail}`,
    }
  }
}

function openSpec(boards: Boards, project: string, body: unknown): Opened {
  const spec = readSpec(body)
  if (!spec.success) {
    return { status: 400, error: spec.message }
  }
  return boards.store.open(project, spec.data)
}

function readSpec(body: unknown) {
  const parsed = specBodySchema.safeParse(body)
  return parseBoardSpec(parsed.success ? parsed.data.spec : undefined)
}

function summarize(board: Board) {
  return {
    id: board.id,
    title: board.spec.title,
    savedAs: board.savedAs,
    unsaved: board.unsaved,
  }
}

function readProject(
  value: unknown,
  configReader: ConfigReader,
  res: Response,
): string | undefined {
  const project = projectSchema.safeParse(value)
  if (!project.success || !configReader.hasDiscovery(project.data)) {
    res.status(404).json({ error: 'No discovered project with this name' })
    return undefined
  }
  return project.data
}
