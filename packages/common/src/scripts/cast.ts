import { utils } from 'ethers'

export function toAddress(uint256: string) {
  return utils.getAddress('0x' + uint256.slice(26))
}

export function toBoolean(value: string) {
  return !/^0x0+$/.test(value)
}
