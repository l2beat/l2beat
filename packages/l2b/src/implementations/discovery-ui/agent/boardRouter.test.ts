import type { ConfigReader } from '@l2beat/discovery'
import { expect } from 'earl'
import express from 'express'
import { existsSync, mkdtempSync, rmSync } from 'fs'
import http from 'http'
import type { AddressInfo } from 'net'
import { tmpdir } from 'os'
import path from 'path'
import { attachBoardRouter, type BoardEvent } from './boardRouter'
import { BoardStore } from './boardStore'

const BRIDGE = 'eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a'
const TABLE = {
  title: 'Bridges',
  blocks: [{ type: 'table', rows: ['Bridge'] }],
}

// The routes the board panel calls, over real HTTP against a project of one
// contract kept in a fresh folder.
describe(attachBoardRouter.name, () => {
  let base = ''
  let projectPath = ''
  let events: BoardEvent[] = []
  let close = () => {}

  before(async () => {
    projectPath = mkdtempSync(path.join(tmpdir(), 'board-router-'))
    const configReader = {
      hasDiscovery: (project: string) => project === 'arbitrum',
      getProjectPath: () => projectPath,
      readDiscoveryWithReferences: () => [
        { entries: [{ type: 'Contract', address: BRIDGE, name: 'Bridge' }] },
      ],
    } as unknown as ConfigReader
    const app = express()
    app.use(express.json())
    attachBoardRouter(app, {
      configReader,
      store: new BoardStore(),
      session: {
        notifyBoard: (event) => {
          events.push(event as BoardEvent)
          return 1
        },
      },
    })
    const server = app.listen(0, '127.0.0.1')
    await new Promise((resolve) => server.once('listening', resolve))
    base = `http://localhost:${(server.address() as AddressInfo).port}`
    close = () => server.close()
  })

  beforeEach(() => {
    events = []
  })

  after(() => {
    close()
    rmSync(projectPath, { recursive: true, force: true })
  })

  async function call(method: string, route: string, body?: object) {
    const response = await fetch(base + route, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    return { status: response.status, body: (await response.json()) as any }
  }

  it('opens, resolves, saves, reopens and closes a board', async () => {
    const opened = await call('POST', '/api/projects/arbitrum/boards', {
      spec: TABLE,
    })
    const id = opened.body.id as string
    expect(opened.body.unsaved).toEqual(true)

    const board = await call('GET', `/api/boards/${id}`)
    expect(board.body.blocks[0].rows[0].address).toEqual(BRIDGE)
    expect(board.body.spec).toEqual(TABLE)

    const saved = await call('POST', `/api/boards/${id}/save`)
    expect(saved.body).toEqual({
      id,
      title: 'Bridges',
      savedAs: 'bridges',
      unsaved: false,
    })
    expect(existsSync(path.join(projectPath, 'boards/bridges.json'))).toEqual(
      true,
    )

    const reopened = await call('POST', '/api/projects/arbitrum/boards', {
      saved: 'bridges',
    })
    expect(reopened.body.id).toEqual(id)

    expect((await call('DELETE', `/api/boards/${id}`)).body).toEqual({
      closed: true,
    })
    expect((await call('GET', `/api/boards/${id}`)).status).toEqual(404)
    expect(events.map((e) => e.reveal)).toEqual([false, false, false, false])
  })

  it('rejects a spec it cannot draw and keeps the board as it was', async () => {
    const { body } = await call('POST', '/api/projects/arbitrum/boards', {
      spec: TABLE,
    })
    const edit = await call('PUT', `/api/boards/${body.id}`, {
      spec: { title: 'Bridges', blocks: [{ type: 'chart' }] },
    })
    expect(edit.status).toEqual(400)
    const board = await call('GET', `/api/boards/${body.id}`)
    expect(board.body.spec).toEqual(TABLE)
  })

  it('says what is wrong with a saved board it cannot open', async () => {
    const missing = await call('POST', '/api/projects/arbitrum/boards', {
      saved: 'nope',
    })
    expect(missing.status).toEqual(404)
    const outside = await call('POST', '/api/projects/arbitrum/boards', {
      saved: '../config',
    })
    expect(outside.status).toEqual(404)
    const project = await call('GET', '/api/projects/nope/boards')
    expect(project.status).toEqual(404)
  })

  // fetch drops a Host header, and a page that rebinds its domain to this
  // machine sends its own.
  it('answers only on localhost', async () => {
    const status = await new Promise<number | undefined>((resolve) => {
      const request = http.request(`${base}/api/projects/arbitrum/boards`, {
        headers: { Host: 'attacker.example' },
      })
      request.on('response', (response) => {
        response.resume()
        resolve(response.statusCode)
      })
      request.end()
    })
    expect(status).toEqual(403)
  })
})
