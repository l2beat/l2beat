import { arbitrum } from '../../../../layer2s/arbitrum'
import { base } from '../../../../layer2s/base'
import { blast } from '../../../../layer2s/blast'
import { bob } from '../../../../layer2s/bob'
import { bobanetwork } from '../../../../layer2s/bobanetwork'
import { degate } from '../../../../layer2s/degate'
import { dydx } from '../../../../layer2s/dydx'
import { frame } from '../../../../layer2s/frame'
import { fuelv1 } from '../../../../layer2s/fuelv1'
import { honeypot } from '../../../../layer2s/honeypot'
import { kinto } from '../../../../layer2s/kinto'
import { kroma } from '../../../../layer2s/kroma'
import { lambda } from '../../../../layer2s/lambda'
import { linea } from '../../../../layer2s/linea'
import { loopring } from '../../../../layer2s/loopring'
import { metal } from '../../../../layer2s/metal'
import { mint } from '../../../../layer2s/mint'
import { mode } from '../../../../layer2s/mode'
import { optimism } from '../../../../layer2s/optimism'
import { paradex } from '../../../../layer2s/paradex'
import { parallel } from '../../../../layer2s/parallel'
import { polygonzkevm } from '../../../../layer2s/polygonzkevm'
import { scroll } from '../../../../layer2s/scroll'
import { starknet } from '../../../../layer2s/starknet'
import { taiko } from '../../../../layer2s/taiko'
import { zkspace } from '../../../../layer2s/zkspace'
import { zksyncera } from '../../../../layer2s/zksyncera'
import { zksynclite } from '../../../../layer2s/zksynclite'
import { zora } from '../../../../layer2s/zora'
import { deri } from '../../../../layer3s/deri'
import { DaEconomicSecurityRisk } from '../../types/DaEconomicSecurityRisk'
import { DaFraudDetectionRisk } from '../../types/DaFraudDetectionRisk'
import { DaLayer, DaLayerKind } from '../../types/DaLayer'
import { enshrinedBridge } from './bridges/enshrinedBridge'

export const ethereum: DaLayer = {
  id: 'ethereum',
  kind: DaLayerKind.PublicBlockchain,
  display: {
    name: 'Ethereum',
    slug: 'ethereum',
    description:
      'Ethereum is a Proof of Stake (PoS) network that enables the creation and execution of smart contracts and decentralized applications (dApps) using its native cryptocurrency, Ether (ETH).',
  },
  bridges: [enshrinedBridge],
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
  consensusAlgorithm: {
    name: 'Gasper',
    description: `Ethereum's consensus protocol combines two separate consensus protocols, LMD GHOST and Casper FFG.
    LMD GHOST is a fork choice rule that essentially provides liveness to the chain. On the other hand, Casper FFG provides finality to the chain, protecting it from deep reversions.
    LMD GHOST provides the core of the chain fork choice rule, by selecting the Greedy Heaviest-Observed Sub-Tree (GHOST) and considering only the validators
    most recent vote (Latest Message Driven, LMD). Casper FFG is a finality gadget, it modifies the fork choice by making some of the chain branches inaccessible.
    Together they are known as "Gasper".`,
    blockTime: 12, // seconds per slot
    consensusFinality: 768, // seconds, two epochs of 32 slots each
    unbondingPeriod: 777600, // current value from validatorqueue.com. Technically it is the sum of 1) Exit Queue (variable) 2) fixed waiting time (27.3 hours), 3) Validator Sweep (variable).
  },
  dataAvailabilitySampling: {
    supportsDAS: false,
  },
  risks: {
    economicSecurity: DaEconomicSecurityRisk.OnChainQuantifiable,
    fraudDetection: DaFraudDetectionRisk.NoFraudDetection,
  },
  economicSecurity: {
    type: 'Ethereum',
  },
}
