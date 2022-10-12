import { constants,utils } from 'ethers'

export function bytes32ToAddress(bytes32: string) {
  return bytes32 === '0x' ?
    constants.AddressZero :
    utils.getAddress('0x' + bytes32.slice(-40))
}
