import { expect, type MockObject, mockFn, mockObject } from 'earl'
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
})

function createClientMock(indexExist = true) {
  return mockObject<ElasticSearchClient>({
    indexExist: mockFn(async (_: string): Promise<boolean> => indexExist),
    indexCreate: mockFn(async (_: string): Promise<void> => {}),
    bulk: mockFn().resolvesTo({
      isSuccess: true,
    }),
  })
}

function createTransportMock(clientMock: MockObject<ElasticSearchClient>) {
  const uuidProviderMock: UuidProvider = () => id

  const options: ElasticSearchTransportOptions = {
    node: 'node',
    apiKey: 'apiKey',
    indexPrefix,
    flushInterval,
  }

  return new ElasticSearchTransport(options, clientMock, uuidProviderMock)
}

function createIndexName() {
  return `${indexPrefix}-${formatDate(new Date())}`
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
