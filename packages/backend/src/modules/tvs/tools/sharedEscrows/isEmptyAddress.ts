export function isEmptyAddress(address: string): boolean {
  return (
    address === '0x' || address === '0x0000000000000000000000000000000000000000'
  )
}
