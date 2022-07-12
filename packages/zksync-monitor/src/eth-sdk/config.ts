import { defineConfig } from '@dethcrypto/eth-sdk'

import { Contracts } from '../constants'

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  outputPath: __dirname + '/sdk',
  contracts: {
    mainnet: {
      upgradeGatekeeper: Contracts.upgradeGatekeeper,
      upgradeMaster: Contracts.upgradeMaster,
      verifierProxy: Contracts.verifierProxy,
      mainProxy: Contracts.mainProxy,
      governanceProxy: Contracts.governanceProxy,
      tokenGovernance: Contracts.tokenGovernance,
    },
  },
})
