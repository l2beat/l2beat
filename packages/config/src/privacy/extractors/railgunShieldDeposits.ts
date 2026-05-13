import { EthereumAddress } from '@l2beat/shared-pure'
import { utils } from 'ethers'
import type { PrivacyExtractor } from '../types'

const ERC20_TOKEN_TYPE = 0

const railgunInterface = new utils.Interface([
  'event Shield(uint256 treeNumber, uint256 startPosition, tuple(bytes32 npk, tuple(uint8 tokenType, address tokenAddress, uint256 tokenSubID) token, uint120 value)[] commitments, tuple(bytes32[3] encryptedBundle, bytes32 shieldKey)[] shieldCiphertext, uint256[] fees)',
])

export const railgunShieldDeposits: PrivacyExtractor<
  'railgunShieldDeposits'
> = ({ logs, params }) => {
  let deposits = 0

  for (const log of logs) {
    let parsedLog
    try {
      parsedLog = railgunInterface.parseLog(log)
    } catch (error) {
      throw new Error(
        `Failed to parse Railgun Shield log for ${log.address}: ${String(error)}`,
      )
    }

    for (const commitment of parsedLog.args.commitments) {
      const token = commitment.token
      if (Number(token.tokenType) !== ERC20_TOKEN_TYPE) {
        continue
      }

      if (EthereumAddress(token.tokenAddress) !== params.tokenAddress) {
        continue
      }

      deposits += 1
    }
  }

  return deposits
}
