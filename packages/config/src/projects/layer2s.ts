import { HOMEPAGE_MILESTONES } from '../global/milestones'
import type { ScalingProject } from '../internalTypes'
import { abstract } from './layer2s/abstract'
import { aevo } from './layer2s/aevo'
import { aiechain } from './layer2s/aiechain'
import { alephzero } from './layer2s/alephzero'
import { alienx } from './layer2s/alienx'
import { align } from './layer2s/align'
import { allo } from './layer2s/allo'
import { ancient } from './layer2s/ancient'
import { apex } from './layer2s/apex'
import { arbitrum } from './layer2s/arbitrum'
import { arcology } from './layer2s/arcology'
import { arenaz } from './layer2s/arenaz'
import { arithmic } from './layer2s/arithmic'
import { astarzkevm } from './layer2s/astarzkevm'
import { automata } from './layer2s/automata'
import { axonum } from './layer2s/axonum'
import { azchain } from './layer2s/azchain'
import { aztecV1 } from './layer2s/aztecV1'
import { aztecV2 } from './layer2s/aztecV2'
import { aztecconnect } from './layer2s/aztecconnect'
import { base } from './layer2s/base'
import { blast } from './layer2s/blast'
import { bob } from './layer2s/bob'
import { bobanetwork } from './layer2s/bobanetwork'
import { camp } from './layer2s/camp'
import { canvasconnect } from './layer2s/canvasconnect'
import { capx } from './layer2s/capx'
import { celo } from './layer2s/celo'
import { corn } from './layer2s/corn'
import { coti } from './layer2s/coti'
import { creator } from './layer2s/creator'
import { creatorchain } from './layer2s/creatorchain'
import { cronoszkevm } from './layer2s/cronoszkevm'
import { cyber } from './layer2s/cyber'
import { dbk } from './layer2s/dbk'
import { dcamonster } from './layer2s/dcamonster'
import { degate } from './layer2s/degate'
import { degate2 } from './layer2s/degate2'
import { degate3 } from './layer2s/degate3'
import { degenlayer } from './layer2s/degenlayer'
import { destra } from './layer2s/destra'
import { dydx } from './layer2s/dydx'
import { ebichain } from './layer2s/ebichain'
import { eclipse } from './layer2s/eclipse'
import { edgeless } from './layer2s/edgeless'
import { ethernity } from './layer2s/ethernity'
import { everclear } from './layer2s/everclear'
import { facet } from './layer2s/facet'
import { fhenix } from './layer2s/fhenix'
import { fluence } from './layer2s/fluence'
import { fluent } from './layer2s/fluent'
import { form } from './layer2s/form'
import { frame } from './layer2s/frame'
import { fraxtal } from './layer2s/fraxtal'
import { fuel } from './layer2s/fuel'
import { fuelv1 } from './layer2s/fuelv1'
import { funki } from './layer2s/funki'
import { fuse } from './layer2s/fuse'
import { galxegravity } from './layer2s/galxegravity'
import { gameswift } from './layer2s/gameswift'
import { genlayer } from './layer2s/genlayer'
import { gluon } from './layer2s/gluon'
import { gmnetwork } from './layer2s/gmnetwork'
import { gpt } from './layer2s/gpt'
import { grvt } from './layer2s/grvt'
import { gwyneth } from './layer2s/gwyneth'
import { happychain } from './layer2s/happychain'
import { hashkey } from './layer2s/hashkey'
import { haust } from './layer2s/haust'
import { hemi } from './layer2s/hemi'
import { hermez } from './layer2s/hermez'
import { honeypot } from './layer2s/honeypot'
import { hybrid } from './layer2s/hybrid'
import { hychain } from './layer2s/hychain'
import { hypr } from './layer2s/hypr'
import { immutablex } from './layer2s/immutablex'
import { immutablezkevm } from './layer2s/immutablezkevm'
import { ink } from './layer2s/ink'
import { intmax } from './layer2s/intmax'
import { kakarotzkevm } from './layer2s/kakarotzkevm'
import { karak } from './layer2s/karak'
import { kinto } from './layer2s/kinto'
import { koi } from './layer2s/koi'
import { kontos } from './layer2s/kontos'
import { kroma } from './layer2s/kroma'
import { lachain } from './layer2s/lachain'
import { lambda } from './layer2s/lambda'
import { layer2finance } from './layer2s/layer2finance'
import { layer2financezk } from './layer2s/layer2financezk'
import { layerai } from './layer2s/layerai'
import { leaf } from './layer2s/leaf'
import { lens } from './layer2s/lens'
import { liftchain } from './layer2s/liftchain'
import { lightlink } from './layer2s/lightlink'
import { linea } from './layer2s/linea'
import { lisk } from './layer2s/lisk'
import { loopring } from './layer2s/loopring'
import { lootchain } from './layer2s/lootchain'
import { lumia } from './layer2s/lumia'
import { lyra } from './layer2s/lyra'
import { mantapacific } from './layer2s/mantapacific'
import { mantle } from './layer2s/mantle'
import { memento } from './layer2s/memento'
import { metal } from './layer2s/metal'
import { metis } from './layer2s/metis'
import { millicent } from './layer2s/millicent'
import { mint } from './layer2s/mint'
import { mode } from './layer2s/mode'
import { moonveil } from './layer2s/moonveil'
import { morph } from './layer2s/morph'
import { move } from './layer2s/move'
import { myria } from './layer2s/myria'
import { myshell } from './layer2s/myshell'
import { nal } from './layer2s/nal'
import { network3 } from './layer2s/network3'
import { neva } from './layer2s/neva'
import { nil } from './layer2s/nil'
import { nova } from './layer2s/nova'
import { oev } from './layer2s/oev'
import { ola } from './layer2s/ola'
import { omgnetwork } from './layer2s/omgnetwork'
import { openzk } from './layer2s/openzk'
import { optimism } from './layer2s/optimism'
import { optopia } from './layer2s/optopia'
import { orderly } from './layer2s/orderly'
import { ozean } from './layer2s/ozean'
import { palm } from './layer2s/palm'
import { pandasea } from './layer2s/pandasea'
import { paradex } from './layer2s/paradex'
import { parallel } from './layer2s/parallel'
import { patex } from './layer2s/patex'
import { payy } from './layer2s/payy'
import { penchain } from './layer2s/penchain'
import { pepeunchained } from './layer2s/pepeunchained'
import { phala } from './layer2s/phala'
import { plumenetwork } from './layer2s/plumenetwork'
import { polygonmiden } from './layer2s/polygonmiden'
import { polygonpos } from './layer2s/polygonpos'
import { polygonpos2 } from './layer2s/polygonpos2'
import { polygonzkevm } from './layer2s/polygonzkevm'
import { polynomial } from './layer2s/polynomial'
import { publicgoodsnetwork } from './layer2s/publicgoodsnetwork'
import { puffer } from './layer2s/puffer'
import { r0ar } from './layer2s/r0ar'
import { race } from './layer2s/race'
import { real } from './layer2s/real'
import { reddioex } from './layer2s/reddioex'
import { reddiozkvm } from './layer2s/reddiozkvm'
import { redstone } from './layer2s/redstone'
import { reya } from './layer2s/reya'
import { rhinofi } from './layer2s/rhinofi'
import { rise } from './layer2s/rise'
import { river } from './layer2s/river'
import { rss3 } from './layer2s/rss3'
import { rufus } from './layer2s/rufus'
import { scroll } from './layer2s/scroll'
import { shape } from './layer2s/shape'
import { shibarium } from './layer2s/shibarium'
import { silicon } from './layer2s/silicon'
import { singularityfinance } from './layer2s/singularityfinance'
import { snaxchain } from './layer2s/snaxchain'
import { socialnetwork } from './layer2s/socialnetwork'
import { solo } from './layer2s/solo'
import { soneium } from './layer2s/soneium'
import { soon } from './layer2s/soon'
import { sophon } from './layer2s/sophon'
import { sorare } from './layer2s/sorare'
import { specular } from './layer2s/specular'
import { starknet } from './layer2s/starknet'
import { status } from './layer2s/status'
import { stealthchain } from './layer2s/stealthchain'
import { superlumio } from './layer2s/superlumio'
import { superseed } from './layer2s/superseed'
import { swan } from './layer2s/swan'
import { swell } from './layer2s/swell'
import { sxnetwork } from './layer2s/sxnetwork'
import { sxt } from './layer2s/sxt'
import { t1 } from './layer2s/t1'
import { taiko } from './layer2s/taiko'
import { tanx } from './layer2s/tanx'
import { tea } from './layer2s/tea'
import { telos } from './layer2s/telos'
import { ten } from './layer2s/ten'
import { termstructure } from './layer2s/termstructure'
import { ternoa } from './layer2s/ternoa'
import { thanos } from './layer2s/thanos'
import { thebinaryholdings } from './layer2s/thebinaryholdings'
import { treasure } from './layer2s/treasure'
import { turboprotocol } from './layer2s/turboprotocol'
import { tusima } from './layer2s/tusima'
import { unichain } from './layer2s/unichain'
import { union } from './layer2s/union'
import { wirex } from './layer2s/wirex'
import { witness } from './layer2s/witness'
import { wonderfi } from './layer2s/wonderfi'
import { world } from './layer2s/world'
import { xchain } from './layer2s/xchain'
import { xlayer } from './layer2s/xlayer'
import { xpla } from './layer2s/xpla'
import { xsolla } from './layer2s/xsolla'
import { xterio } from './layer2s/xterio'
import { zentachain } from './layer2s/zentachain'
import { zeronetwork } from './layer2s/zeronetwork'
import { zircuit } from './layer2s/zircuit'
import { zkcandy } from './layer2s/zkcandy'
import { zkfair } from './layer2s/zkfair'
import { zklighter } from './layer2s/zklighter'
import { zkspace } from './layer2s/zkspace'
import { zkswap } from './layer2s/zkswap'
import { zkswap2 } from './layer2s/zkswap2'
import { zksyncera } from './layer2s/zksyncera'
import { zksynclite } from './layer2s/zksynclite'
import { zora } from './layer2s/zora'

export const layer2s: ScalingProject[] = [
  abstract,
  aevo,
  aiechain,
  alephzero,
  allo,
  automata,
  ancient,
  apex,
  arbitrum,
  arcology,
  arenaz,
  arithmic,
  astarzkevm,
  alienx,
  align,
  axonum,
  azchain,
  aztecV1,
  aztecconnect,
  aztecV2,
  base,
  blast,
  bob,
  bobanetwork,
  camp,
  capx,
  celo,
  cyber,
  canvasconnect,
  coti,
  corn,
  creator,
  creatorchain,
  cronoszkevm,
  dbk,
  honeypot,
  dcamonster,
  degate,
  degate2,
  degate3,
  degenlayer,
  destra,
  dydx,
  edgeless,
  ethernity,
  everclear,
  facet,
  fhenix,
  fluence,
  fluent,
  form,
  frame,
  fraxtal,
  fuel,
  fuelv1,
  funki,
  fuse,
  genlayer,
  gluon,
  gmnetwork,
  gpt,
  galxegravity,
  gameswift,
  grvt,
  gwyneth,
  hemi,
  happychain,
  haust,
  hashkey,
  hermez,
  hybrid,
  hychain,
  hypr,
  immutablex,
  immutablezkevm,
  ink,
  intmax,
  kakarotzkevm,
  karak,
  kinto,
  koi,
  kontos,
  kroma,
  lachain,
  lambda,
  layerai,
  leaf,
  layer2finance,
  layer2financezk,
  lens,
  liftchain,
  lightlink,
  linea,
  lisk,
  loopring,
  lootchain,
  lumia,
  lyra,
  race,
  ebichain,
  eclipse,
  mantapacific,
  mantle,
  memento,
  metal,
  metis,
  mint,
  millicent,
  mode,
  moonveil,
  morph,
  move,
  myria,
  myshell,
  nal,
  nil,
  network3,
  neva,
  nova,
  oev,
  ola,
  omgnetwork,
  openzk,
  optimism,
  optopia,
  orderly,
  ozean,
  palm,
  pandasea,
  paradex,
  parallel,
  patex,
  payy,
  penchain,
  pepeunchained,
  phala,
  plumenetwork,
  polygonmiden,
  polygonzkevm,
  polygonpos,
  polygonpos2,
  polynomial,
  publicgoodsnetwork,
  puffer,
  reddioex,
  reddiozkvm,
  redstone,
  real,
  reya,
  rhinofi,
  rise,
  river,
  r0ar,
  rss3,
  rufus,
  scroll,
  silicon,
  singularityfinance,
  snaxchain,
  sophon,
  soneium,
  socialnetwork,
  solo,
  soon,
  sorare,
  specular,
  starknet,
  status,
  stealthchain,
  shape,
  shibarium,
  superlumio,
  superseed,
  swan,
  swell,
  sxt,
  t1,
  sxnetwork,
  taiko,
  tanx,
  tea,
  telos,
  ten,
  termstructure,
  ternoa,
  thebinaryholdings,
  thanos,
  treasure,
  turboprotocol,
  tusima,
  unichain,
  union,
  wirex,
  witness,
  wonderfi,
  world,
  xchain,
  xlayer,
  xpla,
  xsolla,
  xterio,
  zentachain,
  zeronetwork,
  zircuit,
  zkcandy,
  zkfair,
  zklighter,
  zkspace,
  zkswap,
  zkswap2,
  zksyncera,
  zksynclite,
  zora,
]

export const milestonesLayer2s = HOMEPAGE_MILESTONES
