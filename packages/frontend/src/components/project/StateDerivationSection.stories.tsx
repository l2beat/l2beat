import React from 'react'

import { StateDerivationSection } from './StateDerivationSection'

export default {
  title: 'Components/Project/StateDerivation',
}

export function StateDerivation() {
  return (
    <div className="p-4 leading-normal">
      <StateDerivationSection
        title="State Derivation"
        id="state-derivation"
        nodeSoftware="The open-source node software can be found here."
        compressionScheme="Arbitrum One uses Brotli, a well-known general purpose compression method."
        genesisState="The genesis file can be found here."
        dataFormat="The batch consists of a header along with a compressed blob which is the compression of concatenated RLP encoded transactions using the standard RLP encoding."
      />
    </div>
  )
}
