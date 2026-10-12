import { expect } from 'earl'
import { createServer, type IncomingMessage, type Server } from 'http'
import type { AddressInfo } from 'net'
import { ElasticSearchClient } from './ElasticSearchClient'

interface Reply {
  status: number
  body?: unknown
  contentType?: string
}

interface Received {
  method: string
  url: string
  authorization: string | undefined
  contentType: string | undefined
  body: string
}

describe(ElasticSearchClient.name, () => {
  let server: Server
  let replies: Reply[]
  let received: Received[]
  let client: ElasticSearchClient

  before(async () => {
    server = createServer(async (req, res) => {
      received.push({
        method: req.method ?? '',
        url: req.url ?? '',
        authorization: req.headers.authorization,
        contentType: req.headers['content-type'],
        body: await readBody(req),
      })
      const reply = replies.shift() ?? { status: 200, body: {} }
      res.writeHead(reply.status, {
        'content-type': reply.contentType ?? 'application/json',
      })
      const text =
        typeof reply.body === 'string' ? reply.body : JSON.stringify(reply.body)
      res.end(req.method === 'HEAD' || reply.body === undefined ? '' : text)
    })
    await new Promise<void>((resolve) => server.listen(0, resolve))
  })

  after(() => {
    server.close()
  })

  beforeEach(() => {
    replies = []
    received = []
    const { port } = server.address() as AddressInfo
    client = new ElasticSearchClient({
      node: `http://127.0.0.1:${port}/`,
      apiKey: 'api-key',
    })
  })

  describe(ElasticSearchClient.prototype.indexExist.name, () => {
    it('maps 200 to true and 404 to false', async () => {
      replies = [{ status: 200 }, { status: 404 }]

      expect(await client.indexExist('logs-09-10-2026')).toEqual(true)
      expect(await client.indexExist('logs-09-10-2026')).toEqual(false)
      expect(received[0]).toEqual({
        method: 'HEAD',
        url: '/logs-09-10-2026',
        authorization: 'ApiKey api-key',
        contentType: undefined,
        body: '',
      })
    })

    it('throws with an empty message on other errors', async () => {
      replies = [{ status: 403 }]

      expect(await rejectionMessage(client.indexExist('logs'))).toEqual('')
    })

    it('retries 502, 503 and 504 up to three times', async () => {
      replies = [
        { status: 502 },
        { status: 503 },
        { status: 504 },
        { status: 200 },
      ]

      expect(await client.indexExist('logs')).toEqual(true)
      expect(received.length).toEqual(4)
    })

    it('gives up after three retries', async () => {
      replies = [
        { status: 503 },
        { status: 503 },
        { status: 503 },
        { status: 503 },
      ]

      await expect(client.indexExist('logs')).toBeRejected()
      expect(received.length).toEqual(4)
    })
  })

  describe(ElasticSearchClient.prototype.indexCreate.name, () => {
    it('sends PUT with the encoded index name', async () => {
      replies = [{ status: 200, body: { acknowledged: true } }]

      await client.indexCreate('logs 09/10')

      expect(received[0]?.method).toEqual('PUT')
      expect(received[0]?.url).toEqual('/logs%2009%2F10')
    })

    it('formats Elasticsearch errors like @elastic/elasticsearch', async () => {
      replies = [
        {
          status: 400,
          body: {
            error: {
              type: 'resource_already_exists_exception',
              reason: 'exists',
              caused_by: { type: 'cause_type', reason: 'cause reason' },
              root_cause: [
                {
                  type: 'resource_already_exists_exception',
                  reason: 'index [logs/abc] already exists',
                },
              ],
            },
            status: 400,
          },
        },
      ]

      expect(await rejectionMessage(client.indexCreate('logs'))).toEqual(
        'resource_already_exists_exception\n' +
          '\tCaused by:\n\t\tcause_type: cause reason\n' +
          '\tRoot causes:\n\t\tresource_already_exists_exception: index [logs/abc] already exists',
      )
    })

    it('uses the raw body when it is not an Elasticsearch error', async () => {
      replies = [
        {
          status: 500,
          body: '<html>bad gateway</html>',
          contentType: 'text/html',
        },
      ]

      expect(await rejectionMessage(client.indexCreate('logs'))).toEqual(
        '<html>bad gateway</html>',
      )
    })

    it('does not retry 500', async () => {
      replies = [{ status: 500, body: '' }]

      await expect(client.indexCreate('logs')).toBeRejected()
      expect(received.length).toEqual(1)
    })
  })

  describe(ElasticSearchClient.prototype.bulk.name, () => {
    it('skips the request for no documents', async () => {
      expect(await client.bulk([], 'logs')).toEqual({ isSuccess: true })
      expect(received.length).toEqual(0)
    })

    it('sends NDJSON with refresh', async () => {
      replies = [{ status: 200, body: { errors: false, items: [] } }]

      const result = await client.bulk([{ a: 1 }, { b: 'ż' }], 'logs')

      expect(result).toEqual({ isSuccess: true })
      expect(received[0]).toEqual({
        method: 'POST',
        url: '/_bulk?refresh=true',
        authorization: 'ApiKey api-key',
        contentType: 'application/x-ndjson',
        body:
          '{"index":{"_index":"logs"}}\n{"a":1}\n' +
          '{"index":{"_index":"logs"}}\n{"b":"ż"}\n',
      })
    })

    it('returns the documents that failed', async () => {
      const error = { type: 'document_parsing_exception', reason: 'bad' }
      replies = [
        {
          status: 200,
          body: {
            errors: true,
            items: [
              { index: { status: 201 } },
              { index: { status: 400, error } },
              {},
            ],
          },
        },
      ]

      const result = await client.bulk([{ a: 1 }, { a: 'x' }, { a: 3 }], 'logs')

      expect(result).toEqual({
        isSuccess: false,
        failedDocuments: [
          { status: 400, error, document: { a: 'x' } },
          { status: 500, error: 'Unknown error', document: { a: 3 } },
        ],
      })
    })
  })
})

async function rejectionMessage(promise: Promise<unknown>): Promise<string> {
  try {
    await promise
  } catch (error) {
    return (error as Error).message
  }
  throw new Error('Expected the promise to reject')
}

async function readBody(req: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(chunk as Buffer)
  }
  return Buffer.concat(chunks).toString('utf8')
}
