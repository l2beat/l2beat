import { expect } from 'earl'
import { encodeMessage, MessageReader } from './framing'

describe(MessageReader.name, () => {
  it('reassembles frames split at any byte, counting bytes not characters', () => {
    const first = encodeMessage({ id: 1, text: 'zażółć' })
    const second = encodeMessage({ id: 2 })
    const bytes = Buffer.from(first + second)
    const reader = new MessageReader()

    const bodies = [...bytes].flatMap((byte) =>
      reader.push(Buffer.from([byte])),
    )

    expect(bodies.map((body) => JSON.parse(body))).toEqual([
      { id: 1, text: 'zażółć' },
      { id: 2 },
    ])
  })

  it('reads several frames delivered in one chunk', () => {
    const reader = new MessageReader()
    const chunk = Buffer.from(
      encodeMessage({ id: 1 }) + encodeMessage({ id: 2 }),
    )

    expect(reader.push(chunk)).toEqual(['{"id":1}', '{"id":2}'])
  })
})
