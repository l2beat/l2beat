import { DaAccessibilityRisk, DaExitWindowRisk } from '../../../types'
import { DaAttestationSecurityRisk } from '../../../types/DaAttestationSecurityRisk'
import { DaBridge, EnshrinedBridge } from '../../../types/DaBridge'
import { linkByDA } from '../../../utils/link-by-da'

export const enshrinedBridge: EnshrinedBridge = {
  id: 'enshrined-bridge',
  type: 'Enshrined',
  display: {
    name: 'Enshrined Bridge',
    slug: 'enshrined-bridge',
    description: 'Enshrined bridge on Ethereum',
  },
  technology:
    'Do enim fugiat id tempor consequat pariatur eu eiusmod. Esse veniam ipsum irure sunt nulla est reprehenderit eiusmod et qui fugiat. Commodo pariatur cupidatat commodo ipsum minim tempor consequat dolor nostrud occaecat sit excepteur fugiat. Ut laboris in dolor est ut. Labore quis nulla incididunt enim aute minim in mollit.',
  usedIn: linkByDA({
    // To catch both blobs and calldata suffix
    layer: (layer) => layer?.startsWith('Ethereum'),
    bridge: (bridge) => bridge === 'Enshrined',
  }),
  risks: {
    accessibility: DaAccessibilityRisk.Enshrined,
    attestations: DaAttestationSecurityRisk.Enshrined,
    exitWindow: DaExitWindowRisk.Immutable,
    // we should add a note on the frontend that the specific rollup contracts could be upgradable and the security properties of each depend on the single rollup implementation
  },
} satisfies DaBridge
