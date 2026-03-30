import { expect, type MockObject, mockFn, mockObject } from 'earl'
import { describe } from 'mocha'
import type { ElasticSearchClient } from './ElasticSearchClient'
import {
  ElasticSearchTransport,
  type ElasticSearchTransportOptions,
  formatDate,
  type UuidProvider,
} from './ElasticSearchTransport'

const flushInterval = 10
const id = 'some-id'
const indexPrefix = 'logs'
const indexName = createIndexName()
const log = {
  '@timestamp': '2024-04-24T21:02:30.916Z',
  log: {
    level: 'INFO',
  },
  message: 'Update started',
}

describe(ElasticSearchTransport.name, () => {
  it("creates index if doesn't exist", async () => {
    const clientMock = createClientMock(false)
    const transportMock = createTransportMock(clientMock)

    transportMock.push(JSON.stringify(log))

    // wait for log flus
    await delay(flushInterval + 10)

    expect(clientMock.indexExist).toHaveBeenOnlyCalledWith(indexName)
    expect(clientMock.indexCreate).toHaveBeenOnlyCalledWith(indexName)
  })

  it('does nothing if buffer is empty', async () => {
    const clientMock = createClientMock(false)

    // wait for log flush
    await delay(flushInterval + 10)

    expect(clientMock.bulk).not.toHaveBeenCalled()
  })

  it('pushes logs to ES if there is something in the buffer', async () => {
    const clientMock = createClientMock(false)
    const transportMock = createTransportMock(clientMock)

    transportMock.push(JSON.stringify(log))

    // wait for log flush
    await delay(flushInterval + 10)

    expect(clientMock.bulk).toHaveBeenOnlyCalledWith(
      [{ id, ...log }],
      indexName,
    )
  })

  it('merges flushFailureContext into the diagnostic log when bulk fails', async () => {
    const clientMock = createFailThenSucceedClientMock()

    const transport = createTransportMock(clientMock, {
      flushFailureContext: (batch) => ({
        correlationSample: batch.length,
      }),
    })

    transport.push(JSON.stringify(log))
    transport.push(JSON.stringify(log))

    await transport.flush()

    expect(clientMock.bulk).toHaveBeenCalledTimes(2)
    const diagnosticDoc = clientMock.bulk.calls[1]!.args[0][0] as {
      parameters?: { correlationSample?: number; batchLogCount?: number }
    }
    expect(diagnosticDoc.parameters?.correlationSample).toEqual(2)
    expect(diagnosticDoc.parameters?.batchLogCount).toEqual(2)
  })

  it('still sends diagnostic log when flushFailureContext throws', async () => {
    const clientMock = createFailThenSucceedClientMock()

    const transport = createTransportMock(clientMock, {
      flushFailureContext: () => {
        throw new Error('callback bug')
      },
    })

    transport.push(JSON.stringify(log))

    await transport.flush()

    expect(clientMock.bulk).toHaveBeenCalledTimes(2)
    const diagnosticDoc = clientMock.bulk.calls[1]!.args[0][0] as {
      parameters?: { batchLogCount?: number }
    }
    expect(diagnosticDoc.parameters?.batchLogCount).toEqual(1)
  })
})

function createFailThenSucceedClientMock() {
  let bulkCalls = 0
  return mockObject<ElasticSearchClient>({
    indexExist: mockFn(async (_: string): Promise<boolean> => false),
    indexCreate: mockFn(async (_: string): Promise<void> => {}),
    bulk: mockFn(async () => {
      bulkCalls++
      if (bulkCalls === 1) {
        return { isSuccess: false as const, errors: [] }
      }
      return { isSuccess: true as const }
    }),
  })
}

function createClientMock(indexExist = true) {
  return mockObject<ElasticSearchClient>({
    indexExist: mockFn(async (_: string): Promise<boolean> => indexExist),
    indexCreate: mockFn(async (_: string): Promise<void> => {}),
    bulk: mockFn().resolvesTo({
      isSuccess: true,
    }),
  })
}

function createTransportMock(
  clientMock: MockObject<ElasticSearchClient>,
  extraOptions: Partial<ElasticSearchTransportOptions> = {},
) {
  const uuidProviderMock: UuidProvider = () => id

  const options: ElasticSearchTransportOptions = {
    node: 'node',
    apiKey: 'apiKey',
    indexPrefix,
    flushInterval,
    ...extraOptions,
  }

  return new ElasticSearchTransport(options, clientMock, uuidProviderMock)
}

function createIndexName() {
  return `${indexPrefix}-${formatDate(new Date())}`
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
