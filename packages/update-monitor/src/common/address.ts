import { utils } from 'ethers'

export function bytes32ToAddress(bytes32: string) {
  return utils.getAddress('0x' + bytes32.slice(-40))
}
