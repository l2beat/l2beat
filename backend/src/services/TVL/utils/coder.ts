import { utils } from 'ethers'

export const coder = new utils.Interface([
  'function balanceOf(address account) view returns (uint256)',
  'function getEthBalance(address account) view returns (uint256)',
  'function slot0() view returns (uint160 sqrtPriceX96, int24, uint16, uint16, uint16, uint8, bool)',
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32)',
])
