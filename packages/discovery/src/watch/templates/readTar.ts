const BLOCK_SIZE = 512

export interface TarFile {
  path: string
  content: Uint8Array
}

// Reads the regular files of a ustar archive, like the ones `git archive`
// (and so codeload.github.com) produces. Rejects GNU long names and pax
// per-file headers, whose paths this reader would get wrong.
export function readTar(archive: Uint8Array): TarFile[] {
  const files: TarFile[] = []
  let offset = 0
  while (offset + BLOCK_SIZE <= archive.length) {
    const header = archive.subarray(offset, offset + BLOCK_SIZE)
    if (header.every((byte) => byte === 0)) {
      return files
    }
    verifyChecksum(header)
    const name = readString(header, 0, 100)
    const prefix = readString(header, 345, 155)
    const size = readOctal(header, 124, 12)
    const type = String.fromCharCode(header[156] ?? 0)
    const start = offset + BLOCK_SIZE
    if (start + size > archive.length) {
      break
    }
    if (type === 'L' || type === 'K' || type === 'x') {
      throw new Error('Unsupported tar entry', { cause: { type, name } })
    }
    if (type === '0' || type === '\0') {
      const path = prefix === '' ? name : `${prefix}/${name}`
      files.push({ path, content: archive.subarray(start, start + size) })
    }
    offset = start + Math.ceil(size / BLOCK_SIZE) * BLOCK_SIZE
  }
  throw new Error('Tar archive truncated', { cause: { offset } })
}

function verifyChecksum(header: Uint8Array): void {
  const expected = readOctal(header, 148, 8)
  let sum = 0
  for (let i = 0; i < BLOCK_SIZE; i++) {
    // The checksum field itself counts as spaces.
    sum += i >= 148 && i < 156 ? 0x20 : (header[i] ?? 0)
  }
  if (sum !== expected) {
    throw new Error('Tar header checksum mismatch', {
      cause: { sum, expected },
    })
  }
}

function readString(header: Uint8Array, start: number, length: number): string {
  const field = header.subarray(start, start + length)
  const end = field.indexOf(0)
  return new TextDecoder().decode(end < 0 ? field : field.subarray(0, end))
}

function readOctal(header: Uint8Array, start: number, length: number): number {
  const text = readString(header, start, length).trim()
  for (const char of text) {
    if (char < '0' || char > '7') {
      throw new Error('Tar header number not octal', { cause: { text } })
    }
  }
  return text === '' ? 0 : Number.parseInt(text, 8)
}
