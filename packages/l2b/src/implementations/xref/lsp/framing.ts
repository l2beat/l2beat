import { assert } from '@l2beat/shared-pure'

const HEADER_END = '\r\n\r\n'

// LSP frames JSON bodies with a Content-Length header counted in bytes, and
// stdin delivers them in arbitrary chunks, so bodies are cut at byte offsets.
export class MessageReader {
  private buffer = Buffer.alloc(0)

  push(chunk: Buffer): string[] {
    this.buffer = Buffer.concat([this.buffer, chunk])
    const bodies: string[] = []
    while (true) {
      const headerEnd = this.buffer.indexOf(HEADER_END)
      if (headerEnd === -1) {
        return bodies
      }
      const length = contentLength(
        this.buffer.subarray(0, headerEnd).toString('ascii'),
      )
      const bodyStart = headerEnd + HEADER_END.length
      if (this.buffer.length < bodyStart + length) {
        return bodies
      }
      bodies.push(
        this.buffer.subarray(bodyStart, bodyStart + length).toString('utf8'),
      )
      this.buffer = this.buffer.subarray(bodyStart + length)
    }
  }
}

export function encodeMessage(message: unknown): string {
  const body = JSON.stringify(message)
  return `Content-Length: ${Buffer.byteLength(body)}${HEADER_END}${body}`
}

function contentLength(headers: string): number {
  for (const line of headers.split('\r\n')) {
    const separator = line.indexOf(':')
    const name = line.slice(0, separator).trim().toLowerCase()
    if (name === 'content-length') {
      const length = Number(line.slice(separator + 1).trim())
      assert(Number.isInteger(length) && length >= 0, 'Bad Content-Length')
      return length
    }
  }
  assert(false, 'Missing Content-Length')
}
