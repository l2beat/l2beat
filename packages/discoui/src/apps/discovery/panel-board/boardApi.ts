import { create } from 'zustand'
import type { AgentViewSpec } from '../agent/applyView'

export type CellPart = { text: string } | { address: string; name: string }

export interface BoardRow {
  address?: string
  cells: CellPart[][]
}

export type TableBlock = {
  type: 'table'
  title?: string
  columns: string[]
  // Columns of related contracts, which "Show in graph" draws with the rows.
  graphColumns: number[]
  rows: BoardRow[]
}

export type BoardBlock =
  | { type: 'text'; text: string }
  | TableBlock
  | { type: 'view'; label: string; view: AgentViewSpec }
  | { type: 'html'; html: string; heightPx?: number }
  | { type: 'problem'; text: string }

export interface BoardSummary {
  id: string
  title: string
  savedAs?: string
  unsaved: boolean
}

export interface BoardList {
  open: BoardSummary[]
  saved: { name: string; title: string }[]
}

export interface ResolvedBoard extends BoardSummary {
  spec: unknown
  blocks: BoardBlock[]
  problems: string[]
}

export interface BoardEvent {
  type: 'board'
  id: string
  project: string
  boardId: string
  // The agent made the change, so the tab opens the board to show it.
  reveal: boolean
}

interface BoardUiState {
  // Every board event bumps it, so the panel refetches what changed.
  revision: number
  activeByProject: Record<string, string>
}

export const useBoardUiStore = create<BoardUiState>(() => ({
  revision: 0,
  activeByProject: {},
}))

export function receiveBoardEvent(event: BoardEvent) {
  useBoardUiStore.setState((state) => ({
    revision: state.revision + 1,
    activeByProject: event.reveal
      ? { ...state.activeByProject, [event.project]: event.boardId }
      : state.activeByProject,
  }))
}

export function activateBoard(project: string, boardId: string) {
  useBoardUiStore.setState((state) => ({
    activeByProject: { ...state.activeByProject, [project]: boardId },
  }))
}

// A change made in this tab shows at once; other tabs hear of it through
// the board event, or refresh once their event stream reconnects.
export function refreshBoards() {
  useBoardUiStore.setState((state) => ({ revision: state.revision + 1 }))
}

export async function listBoards(project: string): Promise<BoardList> {
  return await request(`/api/projects/${project}/boards`)
}

export async function getBoard(id: string): Promise<ResolvedBoard> {
  return await request(`/api/boards/${id}`)
}

export async function createBoard(
  project: string,
  body: { spec: unknown } | { saved: string },
): Promise<BoardSummary> {
  const board = await request<BoardSummary>(
    `/api/projects/${project}/boards`,
    jsonRequest('POST', body),
  )
  activateBoard(project, board.id)
  refreshBoards()
  return board
}

export async function replaceBoard(id: string, spec: unknown) {
  const board = await request<ResolvedBoard>(
    `/api/boards/${id}`,
    jsonRequest('PUT', { spec }),
  )
  refreshBoards()
  return board
}

export async function saveBoard(id: string): Promise<BoardSummary> {
  const board = await request<BoardSummary>(
    `/api/boards/${id}/save`,
    jsonRequest('POST', {}),
  )
  refreshBoards()
  return board
}

export async function closeBoard(id: string) {
  await request(`/api/boards/${id}`, { method: 'DELETE' })
  refreshBoards()
}

export class BoardRequestError extends Error {
  constructor(
    message: string,
    readonly status: number | undefined,
  ) {
    super(message)
  }
}

function jsonRequest(method: string, body: unknown): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, init)
  } catch {
    throw new BoardRequestError(
      'DiscoUI is not running: start it again with l2b ui',
      undefined,
    )
  }
  const body = (await response.json().catch(() => ({}))) as { error?: string }
  if (!response.ok) {
    throw new BoardRequestError(
      body.error ?? 'Board request failed',
      response.status,
    )
  }
  return body as T
}
