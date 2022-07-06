import { defineConfig } from '@dethcrypto/eth-sdk'

import { Contracts } from '../constants'

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  outputPath: __dirname + '/sdk',
  contracts: {
    mainnet: {
      upgradeGatekeeper: Contracts.upgradeGatekeeper,
      verifierProxy: Contracts.verifierProxy,
      verifierExitProxy: Contracts.verifierExitProxy,
      governanceProxy: Contracts.governanceProxy,
      pairManagerProxy: Contracts.pairManagerProxy,
      mainProxy: Contracts.mainProxy,
    },
  },
})
