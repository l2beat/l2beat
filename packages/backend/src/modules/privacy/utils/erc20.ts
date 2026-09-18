import { utils } from 'ethers'

export const erc20Interface = new utils.Interface([
  'event Transfer(address indexed from, address indexed to, uint256 value)',
])

/** topic0 of the standard ERC-20 Transfer(address,address,uint256) event. */
export const ERC20_TRANSFER_TOPIC = erc20Interface.getEventTopic('Transfer')
