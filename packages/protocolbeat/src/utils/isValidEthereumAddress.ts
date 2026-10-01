const HEX_CHARACTERS = '0123456789abcdefABCDEF'

export function isValidEthereumAddress(address: string) {
  if (address.length !== 42 || !address.startsWith('0x')) {
    return false
  }
  for (const character of address.slice(2)) {
    if (!HEX_CHARACTERS.includes(character)) {
      return false
    }
  }
  return true
}
