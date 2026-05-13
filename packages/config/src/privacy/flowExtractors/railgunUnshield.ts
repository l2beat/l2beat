import { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { PrivacyFlowExtractor } from '../types'

const ERC20_TOKEN_TYPE = 0

const railgunInterface = new utils.Interface([
  'event Unshield(address to, tuple(uint8 tokenType, address tokenAddress, uint256 tokenSubID) token, uint256 amount, uint256 fee)',
])

export const railgunUnshield: PrivacyFlowExtractor<'railgunUnshield'> = ({
  log,
  params,
}) => {
  let parsedLog
  try {
    parsedLog = railgunInterface.parseLog(log)
  } catch (error) {
    throw new Error(
      `Failed to parse Railgun Unshield log for ${log.address}: ${String(error)}`,
    )
  }

  const token = parsedLog.args.token
  if (Number(token.tokenType) !== ERC20_TOKEN_TYPE) {
    return { count: 0, amount: 0n }
  }

  if (EthereumAddress(token.tokenAddress) !== params.tokenAddress) {
    return { count: 0, amount: 0n }
  }

  return {
    count: 1,
    amount: BigInt(parsedLog.args.amount.toString()),
  }
}
