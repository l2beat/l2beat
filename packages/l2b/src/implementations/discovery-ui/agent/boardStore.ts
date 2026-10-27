import { randomUUID } from 'crypto'
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs'
import path from 'path'
import { type BoardSpec, parseBoardSpec } from './boards'

const BOARDS_DIRECTORY = 'boards'
const BOARD_FILE_EXTENSION = '.json'
const SLUG_CHARACTERS = 'abcdefghijklmnopqrstuvwxyz0123456789'
const SLUG_LENGTH_MAX = 60
const FREE_NAME_ATTEMPTS_MAX = 1000

export interface Board {
  id: string
  project: string
  spec: BoardSpec
  // The file it was saved to or opened from, without the extension.
  savedAs: string | undefined
  // Whether the spec differs from that file, or there is no file yet.
  unsaved: boolean
}

export interface SavedBoard {
  name: string
  title: string
}

export class BoardFileError extends Error {
  constructor(
    readonly code: 'not-found' | 'invalid',
    message: string,
    cause: object,
  ) {
    super(message, { cause })
  }
}

// Open boards live with the server, so a reload or a second tab shows the
// same ones. Saving writes the spec next to the project's layouts, where a
// researcher can read, edit and commit it like any other config.
export class BoardStore {
  private readonly boards = new Map<string, Board>()

  open(project: string, spec: BoardSpec): Board {
    return this.add({ project, spec, savedAs: undefined, unsaved: true })
  }

  // A saved board opens once: opening it again shows the open one, read
  // from its file again unless it has changes the file does not.
  openSaved(project: string, name: string, spec: BoardSpec): Board {
    const open = this.list(project).find((b) => b.savedAs === name)
    if (open === undefined) {
      return this.add({ project, spec, savedAs: name, unsaved: false })
    }
    if (open.unsaved) {
      return open
    }
    return this.set({ ...open, spec })
  }

  replace(id: string, spec: BoardSpec): Board | undefined {
    const board = this.boards.get(id)
    return board && this.set({ ...board, spec, unsaved: true })
  }

  markSaved(id: string, name: string): Board | undefined {
    const board = this.boards.get(id)
    return board && this.set({ ...board, savedAs: name, unsaved: false })
  }

  get(id: string): Board | undefined {
    return this.boards.get(id)
  }

  close(id: string): Board | undefined {
    const board = this.boards.get(id)
    this.boards.delete(id)
    return board
  }

  list(project: string): Board[] {
    return this.all().filter((b) => b.project === project)
  }

  all(): Board[] {
    return [...this.boards.values()]
  }

  // Ids are random, so a tab that outlives a server restart never takes a
  // new board for the one it had.
  private add(board: Omit<Board, 'id'>): Board {
    return this.set({ ...board, id: randomUUID().slice(0, 8) })
  }

  private set(board: Board): Board {
    this.boards.set(board.id, board)
    return board
  }
}

// A file that does not parse is still listed, under its name, so opening it
// says what is wrong instead of it going missing.
export function listSavedBoards(projectPath: string): SavedBoard[] {
  const directory = path.join(projectPath, BOARDS_DIRECTORY)
  if (!existsSync(directory)) {
    return []
  }
  return readdirSync(directory)
    .filter((file) => file.endsWith(BOARD_FILE_EXTENSION))
    .map((file) => file.slice(0, -BOARD_FILE_EXTENSION.length))
    .filter(isSlug)
    .map((name) => ({ name, title: readTitle(projectPath, name) ?? name }))
    .sort((a, b) => a.title.localeCompare(b.title))
}

export function readSavedBoard(projectPath: string, name: string): BoardSpec {
  const file = boardFile(projectPath, name)
  if (!existsSync(file)) {
    throw new BoardFileError('not-found', 'No saved board', { name })
  }
  let json: unknown
  try {
    json = JSON.parse(readFileSync(file, 'utf8'))
  } catch (error) {
    throw new BoardFileError('invalid', 'Board file is not JSON', {
      name,
      error: String(error),
    })
  }
  const spec = parseBoardSpec(json)
  if (!spec.success) {
    throw new BoardFileError('invalid', 'Board file is not a board', {
      name,
      error: spec.message,
    })
  }
  return spec.data
}

// A board saved before keeps its file. A new one takes a name from its
// title that no other board has, so saving never overwrites another board.
export function writeSavedBoard(
  projectPath: string,
  board: Pick<Board, 'spec' | 'savedAs'>,
): string {
  const name = board.savedAs ?? freeName(projectPath, toSlug(board.spec.title))
  mkdirSync(path.join(projectPath, BOARDS_DIRECTORY), { recursive: true })
  const json = `${JSON.stringify(board.spec, null, 2)}\n`
  writeFileSync(boardFile(projectPath, name), json)
  return name
}

function freeName(projectPath: string, slug: string): string {
  for (let attempt = 1; attempt <= FREE_NAME_ATTEMPTS_MAX; attempt++) {
    const name = attempt === 1 ? slug : `${slug}-${attempt}`
    if (!existsSync(boardFile(projectPath, name))) {
      return name
    }
  }
  throw new Error('No free board name', { cause: { slug } })
}

function readTitle(projectPath: string, name: string): string | undefined {
  try {
    return readSavedBoard(projectPath, name).title
  } catch (error) {
    if (!(error instanceof BoardFileError)) throw error
    return undefined
  }
}

// Names come from requests, and only slugs stay inside the boards directory.
function boardFile(projectPath: string, name: string): string {
  if (!isSlug(name)) {
    throw new BoardFileError('not-found', 'Invalid board name', { name })
  }
  return path.join(projectPath, BOARDS_DIRECTORY, name + BOARD_FILE_EXTENSION)
}

export function toSlug(title: string): string {
  const words: string[] = []
  let word = ''
  for (const character of title.toLowerCase()) {
    if (SLUG_CHARACTERS.includes(character)) {
      word += character
    } else if (word.length > 0) {
      words.push(word)
      word = ''
    }
  }
  if (word.length > 0) {
    words.push(word)
  }
  let slug = words.join('-').slice(0, SLUG_LENGTH_MAX)
  if (slug.endsWith('-')) {
    slug = slug.slice(0, -1)
  }
  return slug.length > 0 ? slug : 'board'
}

function isSlug(name: string): boolean {
  return (
    name.length > 0 &&
    [...name].every((c) => c === '-' || SLUG_CHARACTERS.includes(c))
  )
}
