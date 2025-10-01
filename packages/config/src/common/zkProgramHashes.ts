import { assert, ProjectId } from '@l2beat/shared-pure'
import type { ProjectScalingStateValidationZkProgramHash } from '../types'

export function ZK_PROGRAM_HASHES(
  hash: ProjectScalingStateValidationZkProgramHash['hash'],
): ProjectScalingStateValidationZkProgramHash {
  const programHashData = zkProgramHashes[hash]
  assert(
    programHashData,
    `Program hash data for ${hash} not found, please configure it in zkProgramHashes.ts`,
  )

  return {
    ...programHashData,
    hash,
  }
}

const zkProgramHashes: Record<
  ProjectScalingStateValidationZkProgramHash['hash'],
  Omit<ProjectScalingStateValidationZkProgramHash, 'hash'>
> = {
  '0x003991487ea72a40a1caa7c234612c0da52fc4ccc748a07f6ebd35466654772e': {
    programUrl: 'https://github.com/l2beat/l2beat',
    description:
      'Aggregation program for OP Succinct: aggregates batch STF proofs',
    proverSystemProject: ProjectId('sp1'),
    verificationStatus: 'successful',
    verificationSteps: `
      - Check out [sp1 repo](https://github.com/succinctlabs/sp1) at commit \`76c28bf986ba102127788ce081c21fa09cf93b18\`.
      - Set an environment variable by calling \`export SP1_ALLOW_DEPRECATED_HOOKS=true\`. It is needed for the correct execution of circuit building.
      - Make sure that you have [go lang installed](https://go.dev/doc/install).
      - From \`crates/prover\` call \`make build-circuits\`. Note that the execution could take a while.
      `,
  },
}
