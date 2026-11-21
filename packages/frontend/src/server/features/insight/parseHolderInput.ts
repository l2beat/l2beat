const HOLDER_ADDRESS = /^0x[0-9a-f]{40}$/
// Labels separated by dots, nothing that could leave the path segment.
// Whether the labels are valid ENS is for ENSIP-15 normalization to say.
const NAME_SHAPE = /^[^\s/?#.]+(\.[^\s/?#.]+)+$/
// Same bound as a DNS name.
const NAME_LENGTH_MAX = 255

export type HolderInput =
  | { kind: 'address'; address: string }
  | { kind: 'name'; name: string }

/**
 * What a visitor typed: an address, lowercased so a checksum is not verified
 * and one holder has one URL, or something shaped like an ENS name.
 */
export function parseHolderInput(input: string): HolderInput | undefined {
  const trimmed = input.trim()
  const lowercase = trimmed.toLowerCase()
  if (HOLDER_ADDRESS.test(lowercase)) {
    return { kind: 'address', address: lowercase }
  }
  if (trimmed.length > NAME_LENGTH_MAX) return undefined
  if (lowercase.startsWith('0x') && !lowercase.includes('.')) return undefined
  if (!NAME_SHAPE.test(trimmed)) return undefined
  return { kind: 'name', name: trimmed }
}
