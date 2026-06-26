export function formatAddress(address: string) {
  if (!address.startsWith('0x')) {
    return address
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}
