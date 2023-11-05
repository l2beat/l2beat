import { aevo } from './aevo'
import { apex } from './apex'
import { arbitrum } from './arbitrum'
import { astarzkevm } from './astarzkevm'
import { aztec } from './aztec'
import { aztecconnect } from './aztecconnect'
import { base } from './base'
import { bobanetwork } from './bobanetwork'
import { brine } from './brine'
import { canto } from './canto'
import { canvasconnect } from './canvasconnect'
import { capx } from './capx'
import { HOMEPAGE_MILESTONES } from './common'
import { degate } from './degate'
import { degate2 } from './degate2'
import { dydx } from './dydx'
import { fuelv1 } from './fuelv1'
import { gluon } from './gluon'
import { hermez } from './hermez'
import { honeypot } from './honeypot'
import { immutablex } from './immutablex'
import { immutablezkevm } from './immutablezkevm'
import { kinto } from './kinto'
import { kroma } from './kroma'
import { layer2finance } from './layer2finance'
import { layer2financezk } from './layer2financezk'
import { linea } from './linea'
import { loopring } from './loopring'
import { lyrafinance } from './lyrafinance'
import { mantapacific } from './mantapacific'
import { mantle } from './mantle'
import { metis } from './metis'
import { mode } from './mode'
import { morphism } from './morphism'
import { myria } from './myria'
import { natanetwork } from './natanetwork'
import { nova } from './nova'
import { obscuro } from './obscuro'
import { omgnetwork } from './omgnetwork'
import { optimism } from './optimism'
import { palm } from './palm'
import { paradex } from './paradex'
import { polygonmiden } from './polygonmiden'
import { polygonpos2 } from './polygonpos2'
import { polygonzkevm } from './polygonzkevm'
import { publicgoodsnetwork } from './publicgoodsnetwork'
import { rhinofi } from './rhinofi'
import { scroll } from './scroll'
import { sorare } from './sorare'
import { starknet } from './starknet'
import { stealthchain } from './stealthchain'
import { taiko } from './taiko'
import { Layer2 } from './types'
import { xchain } from './xchain'
import { zkspace } from './zkspace'
import { zkswap } from './zkswap'
import { zkswap2 } from './zkswap2'
import { zksyncera } from './zksyncera'
import { zksynclite } from './zksynclite'
import { zora } from './zora'
export * from './common'
export * from './types'

export const layer2s: Layer2[] = [
  aevo,
  apex,
  arbitrum,
  astarzkevm,
  aztec,
  aztecconnect,
  base,
  bobanetwork,
  brine,
  canto,
  capx,
  canvasconnect,
  honeypot,
  degate,
  degate2,
  dydx,
  fuelv1,
  gluon,
  hermez,
  immutablex,
  immutablezkevm,
  kinto,
  kroma,
  layer2finance,
  layer2financezk,
  linea,
  loopring,
  lyrafinance,
  mantapacific,
  mantle,
  metis,
  mode,
  morphism,
  myria,
  natanetwork,
  nova,
  obscuro,
  omgnetwork,
  optimism,
  palm,
  paradex,
  polygonmiden,
  polygonzkevm,
  polygonpos2,
  publicgoodsnetwork,
  rhinofi,
  scroll,
  sorare,
  starknet,
  stealthchain,
  taiko,
  xchain,
  zkspace,
  zkswap,
  zkswap2,
  zksyncera,
  zksynclite,
  zora,
]

export const milestonesLayer2s = HOMEPAGE_MILESTONES
