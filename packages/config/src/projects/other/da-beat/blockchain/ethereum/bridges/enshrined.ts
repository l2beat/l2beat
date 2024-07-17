import { arbitrum } from '../../../../../layer2s/arbitrum'
import { base } from '../../../../../layer2s/base'
import { blast } from '../../../../../layer2s/blast'
import { bob } from '../../../../../layer2s/bob'
import { bobanetwork } from '../../../../../layer2s/bobanetwork'
import { degate } from '../../../../../layer2s/degate'
import { dydx } from '../../../../../layer2s/dydx'
import { frame } from '../../../../../layer2s/frame'
import { fuelv1 } from '../../../../../layer2s/fuelv1'
import { honeypot } from '../../../../../layer2s/honeypot'
import { kinto } from '../../../../../layer2s/kinto'
import { kroma } from '../../../../../layer2s/kroma'
import { lambda } from '../../../../../layer2s/lambda'
import { linea } from '../../../../../layer2s/linea'
import { loopring } from '../../../../../layer2s/loopring'
import { metal } from '../../../../../layer2s/metal'
import { mint } from '../../../../../layer2s/mint'
import { mode } from '../../../../../layer2s/mode'
import { optimism } from '../../../../../layer2s/optimism'
import { paradex } from '../../../../../layer2s/paradex'
import { parallel } from '../../../../../layer2s/parallel'
import { polygonzkevm } from '../../../../../layer2s/polygonzkevm'
import { scroll } from '../../../../../layer2s/scroll'
import { starknet } from '../../../../../layer2s/starknet'
import { taiko } from '../../../../../layer2s/taiko'
import { zkspace } from '../../../../../layer2s/zkspace'
import { zksyncera } from '../../../../../layer2s/zksyncera'
import { zksynclite } from '../../../../../layer2s/zksynclite'
import { zora } from '../../../../../layer2s/zora'
import { deri } from '../../../../../layer3s/deri'
import { DaAccessibilityRisk, DaExitWindowRisk } from '../../../types'
import { DaAttestationSecurityRisk } from '../../../types/DaAttestationSecurityRisk'
import { DaBridge, DaBridgeKind } from '../../../types/DaBridge'


export const enshrinedBridge = {
  id: 'enshrined-bridge',
  kind: DaBridgeKind.Enshrined,
  display: {
    name: 'Enshrined Bridge',
    slug: 'enshrined-bridge',
    description: 'Enshrined bridge on Ethereum',
  },
  usedIn: [
    arbitrum.id,
    base.id,
    optimism.id,
    blast.id,
    linea.id,
    zksyncera.id,
    scroll.id,
    starknet.id,
    mode.id,
    taiko.id,
    bob.id,
    kroma.id,
    zora.id,
    paradex.id,
    bobanetwork.id,
    mint.id,
    metal.id,
    parallel.id,
    lambda.id,
    frame.id,
    deri.id,
    dydx.id,
    polygonzkevm.id,
    zksynclite.id,
    loopring.id,
    degate.id,
    kinto.id,
    zkspace.id,
    honeypot.id,
    fuelv1.id,
  ],
  risks: {
    accessibility: DaAccessibilityRisk.Enshrined,
    attestations: DaAttestationSecurityRisk.Enshrined,
    exitWindow: DaExitWindowRisk.Immutable,
  },
} satisfies DaBridge
