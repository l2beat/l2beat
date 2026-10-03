import { expect } from 'earl'
import { splitLines } from './fetchFlatSources'

describe(splitLines.name, () => {
  it('joins lines split across chunks', async () => {
    const result = await collect(['{"a":', '1}\n{"b"', ':2}\n', '{"c":3}\n'])

    expect(result).toEqual(['{"a":1}', '{"b":2}', '{"c":3}'])
  })

  it('decodes a multibyte character split across chunks', async () => {
    const bytes = Buffer.from('{"a":"zażółć"}\n')
    const splitAt = bytes.indexOf(Buffer.from('ż')) + 1

    const result = await collect([
      bytes.subarray(0, splitAt),
      bytes.subarray(splitAt),
    ])

    expect(result).toEqual(['{"a":"zażółć"}'])
  })

  it('does not split on unicode line separators', async () => {
    const line = JSON.stringify({ a: 'x y z\rw' })

    const result = await collect([`${line}\n`])

    expect(result).toEqual([line])
  })

  it('splits many lines in one chunk', async () => {
    const result = await collect(['1\n2\n3\n'])

    expect(result).toEqual(['1', '2', '3'])
  })

  it('throws when the stream ends mid line', async () => {
    await expect(collect(['{"a":1}\n{"b"'])).toBeRejectedWith(
      'Flat sources response ends mid line',
    )
  })
})

async function collect(chunks: (string | Buffer)[]): Promise<string[]> {
  async function* source() {
    for (const chunk of chunks) {
      yield Buffer.from(chunk)
    }
  }
  const result: string[] = []
  for await (const line of splitLines(source())) {
    result.push(line)
  }
  return result
}
