import { assert, type Bytes } from '@l2beat/shared-pure'

export function codeIsEIP7702(code: Bytes): boolean {
  const startsWithEF = code.slice(0, 1).toString() === '0xef'
  if (startsWithEF) {
    const hasEIP7702Prefix = code.slice(1, 3).toString() === '0x0100'
    assert(
      hasEIP7702Prefix,
      `Code starting with 0xEF must follow EIP-7702 format (0xEF0100...) but got ${code.slice(0, 3).toString()}...`,
    )

    const correctCodeSize = code.length === 23
    assert(
      correctCodeSize,
      `EIP-7702 code must be exactly 23 bytes long but got ${code.length} bytes`,
    )

    return true
  }

  return false
}

export function codeIsEOA(code: Bytes): boolean {
  return codeIsEIP7702(code) || code.length === 0
}
