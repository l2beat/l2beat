import { expect } from 'earl'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import path from 'path'
import {
  BoardFileError,
  BoardStore,
  listSavedBoards,
  readSavedBoard,
  toSlug,
  writeSavedBoard,
} from './boardStore'
import type { BoardSpec } from './boards'

const MULTISIGS: BoardSpec = { title: 'Multisigs', blocks: [] }
const ESCROWS: BoardSpec = { title: 'Escrows', blocks: [] }

// Boards are written to and read from a fresh project folder, the way the
// researcher's Save and Open saved use it.
describe('saved boards', () => {
  let projectPath = ''

  beforeEach(() => {
    projectPath = mkdtempSync(path.join(tmpdir(), 'boards-'))
  })

  afterEach(() => {
    rmSync(projectPath, { recursive: true, force: true })
  })

  it('names a new board after its title, without overwriting another', () => {
    const first = writeSavedBoard(projectPath, {
      spec: MULTISIGS,
      savedAs: undefined,
    })
    const second = writeSavedBoard(projectPath, {
      spec: { ...MULTISIGS, blocks: [{ type: 'text', text: 'other' }] },
      savedAs: undefined,
    })
    expect([first, second]).toEqual(['multisigs', 'multisigs-2'])
    expect(readSavedBoard(projectPath, 'multisigs')).toEqual(MULTISIGS)
  })

  it('saves a board again into the file it came from', () => {
    writeSavedBoard(projectPath, { spec: MULTISIGS, savedAs: undefined })
    const renamed = { ...MULTISIGS, title: 'Signers' }
    const name = writeSavedBoard(projectPath, {
      spec: renamed,
      savedAs: 'multisigs',
    })
    expect(name).toEqual('multisigs')
    expect(listSavedBoards(projectPath)).toEqual([
      { name: 'multisigs', title: 'Signers' },
    ])
  })

  it('lists a file that is not a board under its name', () => {
    writeSavedBoard(projectPath, { spec: ESCROWS, savedAs: undefined })
    const directory = path.join(projectPath, 'boards')
    writeFileSync(path.join(directory, 'broken.json'), '{"title":')
    writeFileSync(path.join(directory, 'notes.txt'), 'not a board')
    expect(listSavedBoards(projectPath)).toEqual([
      { name: 'broken', title: 'broken' },
      { name: 'escrows', title: 'Escrows' },
    ])
    expect(() => readSavedBoard(projectPath, 'broken')).toThrow(
      'Board file is not JSON',
    )
  })

  it('reads only boards inside the boards folder', () => {
    mkdirSync(path.join(projectPath, 'boards'))
    writeFileSync(path.join(projectPath, 'secret.json'), '{}')
    for (const name of ['../secret', 'missing', '']) {
      expect(() => readSavedBoard(projectPath, name)).toThrow(BoardFileError)
    }
  })

  it('writes JSON a researcher can read and diff', () => {
    writeSavedBoard(projectPath, { spec: ESCROWS, savedAs: undefined })
    const file = path.join(projectPath, 'boards', 'escrows.json')
    expect(readFileSync(file, 'utf8')).toEqual(
      '{\n  "title": "Escrows",\n  "blocks": []\n}\n',
    )
  })
})

describe(BoardStore.name, () => {
  it('opens a saved board once and rereads its file unless it changed', () => {
    const store = new BoardStore()
    const opened = store.openSaved('arbitrum', 'multisigs', MULTISIGS)
    expect(opened.unsaved).toEqual(false)

    const edited = { ...MULTISIGS, title: 'Edited on disk' }
    const again = store.openSaved('arbitrum', 'multisigs', edited)
    expect(again.id).toEqual(opened.id)
    expect(again.spec).toEqual(edited)

    store.replace(opened.id, ESCROWS)
    const kept = store.openSaved('arbitrum', 'multisigs', MULTISIGS)
    expect(kept.spec).toEqual(ESCROWS)
    expect(store.list('arbitrum').length).toEqual(1)
  })

  it('tracks changes since the last save', () => {
    const store = new BoardStore()
    const board = store.open('arbitrum', MULTISIGS)
    expect(board.unsaved).toEqual(true)
    expect(store.markSaved(board.id, 'multisigs')?.unsaved).toEqual(false)
    expect(store.replace(board.id, MULTISIGS)?.unsaved).toEqual(false)
    expect(store.replace(board.id, ESCROWS)?.unsaved).toEqual(true)
    expect(store.get(board.id)?.savedAs).toEqual('multisigs')
  })

  it('keeps boards per project and forgets closed ones', () => {
    const store = new BoardStore()
    const board = store.open('arbitrum', MULTISIGS)
    store.open('scroll', ESCROWS)
    expect(store.list('arbitrum')).toEqual([board])
    expect(store.close(board.id)).toEqual(board)
    expect(store.close(board.id)).toEqual(undefined)
    expect(store.replace(board.id, ESCROWS)).toEqual(undefined)
  })
})

describe(toSlug.name, () => {
  it('keeps letters and digits, joined by dashes', () => {
    expect(toSlug('Who can upgrade: L1 & L2!')).toEqual('who-can-upgrade-l1-l2')
    expect(toSlug('../..')).toEqual('board')
    expect(toSlug(`${'a'.repeat(59)} b`)).toEqual('a'.repeat(59))
  })
})
