import { assert } from '@l2beat/shared-pure'
import { utils } from 'ethers'

import { LivenessRecord } from '../../../peripherals/database/LivenessRepository'
import { LivenessFunctionCall } from '../types/LivenessConfig'
import { BigQueryFunctionCallsResult } from '../types/model'

export function transformFunctionCallsQueryResult(
  configs: LivenessFunctionCall[],
  queryResults: BigQueryFunctionCallsResult,
): LivenessRecord[] {
  const configsWithProgramHash = configs.filter((c) => c.programHash)

  const results: LivenessRecord[] = []
  queryResults.forEach((r) => {
    if (r.input.length <= 10) {
      const config = configs.find(
        (t) => r.input.startsWith(t.selector) && t.address === r.to_address,
      )

      assert(config, 'Programmer error: config should not be undefined there')

      results.push({
        timestamp: r.block_timestamp,
        blockNumber: r.block_number,
        txHash: r.transaction_hash,
        livenessConfigurationId: config.livenessConfigurationId,
      })
    } else {
      // Should be it hardcoded here?
      const fnSignature =
        'verifyProofAndRegister(uint256[] proofParams, uint256[] proof, uint256[] taskMetadata, uint256[] cairoAuxInput, uint256 cairoVerifierId)'
      const i = new utils.Interface([`function ${fnSignature}`])
      const decodedInput = i.decodeFunctionData(fnSignature, r.input)
      const hashes = (decodedInput[2] as bigint[]).map((n) => n.toString())

      configsWithProgramHash.forEach((config) => {
        if (config.programHash && hashes.includes(config.programHash)) {
          results.push({
            timestamp: r.block_timestamp,
            blockNumber: r.block_number,
            txHash: r.transaction_hash,
            livenessConfigurationId: config.livenessConfigurationId,
          })
        }
      })
    }
  })
  return results
}
