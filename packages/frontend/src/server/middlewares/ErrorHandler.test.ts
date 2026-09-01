import type { AddressInfo } from 'node:net'
import { Logger } from '@l2beat/backend-tools'
import { expect } from 'earl'
import express from 'express'
import { clientErrorStatus, ErrorHandler } from './ErrorHandler'

const MALFORMED_SCAN_PATHS = [
  '/interop/tokens/4j9emc/ethena/susde%C0%A7%C0%A2%252527%252522%5C%27%5C%22',
  '/interop/tokens/4j9emc%C0%A7%C0%A2%252527%252522%5C%27%5C%22/ethena/susde',
  '/layer2s/projects/adi%C0%A7%C0%A2%252527%252522%5C%27%5C%22/',
  '/layer2s/projects/polygon-pos%C0%A7%C0%A2%252527%252522%5C%27%5C%22?protocols=polygon-pos',
]

describe(ErrorHandler.name, () => {
  it('responds 400 to the malformed paths seen during the scan', async () => {
    await withServer(async (baseUrl) => {
      for (const path of MALFORMED_SCAN_PATHS) {
        const response = await fetch(`${baseUrl}${path}`)
        expect(response.status).toEqual(400)
        expect(await response.text()).toInclude('Bad Request')
      }
    })
  })

  it('responds 200 to the same paths without malformed encoding', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/layer2s/projects/polygon-pos`)
      expect(response.status).toEqual(200)
    })
  })

  it('responds 500 to a genuine server failure', async () => {
    await withServer(async (baseUrl) => {
      const response = await fetch(`${baseUrl}/boom`)
      expect(response.status).toEqual(500)
      expect(await response.text()).toInclude('Internal Server Error')
    })
  })
})

describe(clientErrorStatus.name, () => {
  it('reads the status the router sets on an undecodable param', () => {
    const error = Object.assign(
      new URIError("Failed to decode param '%C0%A7'"),
      {
        status: 400,
      },
    )
    expect(clientErrorStatus(error)).toEqual(400)
  })

  it('reads statusCode when status is absent', () => {
    const error = Object.assign(new Error('too large'), { statusCode: 413 })
    expect(clientErrorStatus(error)).toEqual(413)
  })

  it('ignores a server error status', () => {
    const error = Object.assign(new Error('gateway'), { status: 502 })
    expect(clientErrorStatus(error)).toEqual(undefined)
  })

  it('ignores a status below the client error range', () => {
    const error = Object.assign(new Error('teapot-ish'), { status: 302 })
    expect(clientErrorStatus(error)).toEqual(undefined)
  })

  it('ignores a non integer status', () => {
    const error = Object.assign(new Error('weird'), { status: 400.5 })
    expect(clientErrorStatus(error)).toEqual(undefined)
  })

  it('ignores an error without a status', () => {
    expect(clientErrorStatus(new Error('database is down'))).toEqual(undefined)
  })
})

async function withServer(test: (baseUrl: string) => Promise<void>) {
  const app = express()
  app.get('/interop/tokens/:chain/:protocol/:token', (_, res) => {
    res.status(200).send('ok')
  })
  app.get('/interop/tokens/:chain/:token', (_, res) => {
    res.status(200).send('ok')
  })
  app.get('/layer2s/projects/:project', (_, res) => {
    res.status(200).send('ok')
  })
  app.get('/boom', () => {
    throw new Error('database is down')
  })
  app.use(ErrorHandler(Logger.SILENT))

  const server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  const { port } = server.address() as AddressInfo

  try {
    await test(`http://localhost:${port}`)
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
}
