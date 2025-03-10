import { HOMEPAGE_MILESTONES } from '../global/milestones'
import type { ScalingProject } from '../internalTypes'
import { abstract } from '../projects/layer2s/abstract'
import { aevo } from '../projects/layer2s/aevo'
import { aiechain } from '../projects/layer2s/aiechain'
import { alephzero } from '../projects/layer2s/alephzero'
import { alienx } from '../projects/layer2s/alienx'
import { align } from '../projects/layer2s/align'
import { allo } from '../projects/layer2s/allo'
import { ancient } from '../projects/layer2s/ancient'
import { apex } from '../projects/layer2s/apex'
import { arbitrum } from '../projects/layer2s/arbitrum'
import { arcology } from '../projects/layer2s/arcology'
import { arenaz } from '../projects/layer2s/arenaz'
import { arithmic } from '../projects/layer2s/arithmic'
import { astarzkevm } from '../projects/layer2s/astarzkevm'
import { automata } from '../projects/layer2s/automata'
import { axonum } from '../projects/layer2s/axonum'
import { azchain } from '../projects/layer2s/azchain'
import { aztecV1 } from '../projects/layer2s/aztecV1'
import { aztecV2 } from '../projects/layer2s/aztecV2'
import { aztecconnect } from '../projects/layer2s/aztecconnect'
import { base } from '../projects/layer2s/base'
import { blast } from '../projects/layer2s/blast'
import { bob } from '../projects/layer2s/bob'
import { bobanetwork } from '../projects/layer2s/bobanetwork'
import { camp } from '../projects/layer2s/camp'
import { canvasconnect } from '../projects/layer2s/canvasconnect'
import { capx } from '../projects/layer2s/capx'
import { celo } from '../projects/layer2s/celo'
import { corn } from '../projects/layer2s/corn'
import { coti } from '../projects/layer2s/coti'
import { creator } from '../projects/layer2s/creator'
import { creatorchain } from '../projects/layer2s/creatorchain'
import { cronoszkevm } from '../projects/layer2s/cronoszkevm'
import { cyber } from '../projects/layer2s/cyber'
import { dbk } from '../projects/layer2s/dbk'
import { dcamonster } from '../projects/layer2s/dcamonster'
import { degate } from '../projects/layer2s/degate'
import { degate2 } from '../projects/layer2s/degate2'
import { degate3 } from '../projects/layer2s/degate3'
import { degenlayer } from '../projects/layer2s/degenlayer'
import { destra } from '../projects/layer2s/destra'
import { dydx } from '../projects/layer2s/dydx'
import { ebichain } from '../projects/layer2s/ebichain'
import { eclipse } from '../projects/layer2s/eclipse'
import { edgeless } from '../projects/layer2s/edgeless'
import { ethernity } from '../projects/layer2s/ethernity'
import { everclear } from '../projects/layer2s/everclear'
import { facet } from '../projects/layer2s/facet'
import { fhenix } from '../projects/layer2s/fhenix'
import { fluence } from '../projects/layer2s/fluence'
import { fluent } from '../projects/layer2s/fluent'
import { form } from '../projects/layer2s/form'
import { frame } from '../projects/layer2s/frame'
import { fraxtal } from '../projects/layer2s/fraxtal'
import { fuel } from '../projects/layer2s/fuel'
import { fuelv1 } from '../projects/layer2s/fuelv1'
import { funki } from '../projects/layer2s/funki'
import { fuse } from '../projects/layer2s/fuse'
import { galxegravity } from '../projects/layer2s/galxegravity'
import { gameswift } from '../projects/layer2s/gameswift'
import { genlayer } from '../projects/layer2s/genlayer'
import { gluon } from '../projects/layer2s/gluon'
import { gmnetwork } from '../projects/layer2s/gmnetwork'
import { gpt } from '../projects/layer2s/gpt'
import { grvt } from '../projects/layer2s/grvt'
import { gwyneth } from '../projects/layer2s/gwyneth'
import { happychain } from '../projects/layer2s/happychain'
import { hashkey } from '../projects/layer2s/hashkey'
import { haust } from '../projects/layer2s/haust'
import { hemi } from '../projects/layer2s/hemi'
import { hermez } from '../projects/layer2s/hermez'
import { honeypot } from '../projects/layer2s/honeypot'
import { hybrid } from '../projects/layer2s/hybrid'
import { hychain } from '../projects/layer2s/hychain'
import { hypr } from '../projects/layer2s/hypr'
import { immutablex } from '../projects/layer2s/immutablex'
import { immutablezkevm } from '../projects/layer2s/immutablezkevm'
import { ink } from '../projects/layer2s/ink'
import { intmax } from '../projects/layer2s/intmax'
import { kakarotzkevm } from '../projects/layer2s/kakarotzkevm'
import { karak } from '../projects/layer2s/karak'
import { kinto } from '../projects/layer2s/kinto'
import { koi } from '../projects/layer2s/koi'
import { kontos } from '../projects/layer2s/kontos'
import { kroma } from '../projects/layer2s/kroma'
import { lachain } from '../projects/layer2s/lachain'
import { lambda } from '../projects/layer2s/lambda'
import { layer2finance } from '../projects/layer2s/layer2finance'
import { layer2financezk } from '../projects/layer2s/layer2financezk'
import { layerai } from '../projects/layer2s/layerai'
import { leaf } from '../projects/layer2s/leaf'
import { lens } from '../projects/layer2s/lens'
import { liftchain } from '../projects/layer2s/liftchain'
import { lightlink } from '../projects/layer2s/lightlink'
import { linea } from '../projects/layer2s/linea'
import { lisk } from '../projects/layer2s/lisk'
import { loopring } from '../projects/layer2s/loopring'
import { lootchain } from '../projects/layer2s/lootchain'
import { lumia } from '../projects/layer2s/lumia'
import { lyra } from '../projects/layer2s/lyra'
import { mantapacific } from '../projects/layer2s/mantapacific'
import { mantle } from '../projects/layer2s/mantle'
import { memento } from '../projects/layer2s/memento'
import { metal } from '../projects/layer2s/metal'
import { metis } from '../projects/layer2s/metis'
import { millicent } from '../projects/layer2s/millicent'
import { mint } from '../projects/layer2s/mint'
import { mode } from '../projects/layer2s/mode'
import { moonveil } from '../projects/layer2s/moonveil'
import { morph } from '../projects/layer2s/morph'
import { move } from '../projects/layer2s/move'
import { myria } from '../projects/layer2s/myria'
import { myshell } from '../projects/layer2s/myshell'
import { nal } from '../projects/layer2s/nal'
import { network3 } from '../projects/layer2s/network3'
import { neva } from '../projects/layer2s/neva'
import { nil } from '../projects/layer2s/nil'
import { nova } from '../projects/layer2s/nova'
import { oev } from '../projects/layer2s/oev'
import { ola } from '../projects/layer2s/ola'
import { omgnetwork } from '../projects/layer2s/omgnetwork'
import { openzk } from '../projects/layer2s/openzk'
import { optimism } from '../projects/layer2s/optimism'
import { optopia } from '../projects/layer2s/optopia'
import { orderly } from '../projects/layer2s/orderly'
import { ozean } from '../projects/layer2s/ozean'
import { palm } from '../projects/layer2s/palm'
import { pandasea } from '../projects/layer2s/pandasea'
import { paradex } from '../projects/layer2s/paradex'
import { parallel } from '../projects/layer2s/parallel'
import { patex } from '../projects/layer2s/patex'
import { payy } from '../projects/layer2s/payy'
import { penchain } from '../projects/layer2s/penchain'
import { pepeunchained } from '../projects/layer2s/pepeunchained'
import { phala } from '../projects/layer2s/phala'
import { plumenetwork } from '../projects/layer2s/plumenetwork'
import { polygonmiden } from '../projects/layer2s/polygonmiden'
import { polygonpos } from '../projects/layer2s/polygonpos'
import { polygonpos2 } from '../projects/layer2s/polygonpos2'
import { polygonzkevm } from '../projects/layer2s/polygonzkevm'
import { polynomial } from '../projects/layer2s/polynomial'
import { publicgoodsnetwork } from '../projects/layer2s/publicgoodsnetwork'
import { puffer } from '../projects/layer2s/puffer'
import { r0ar } from '../projects/layer2s/r0ar'
import { race } from '../projects/layer2s/race'
import { real } from '../projects/layer2s/real'
import { reddioex } from '../projects/layer2s/reddioex'
import { reddiozkvm } from '../projects/layer2s/reddiozkvm'
import { redstone } from '../projects/layer2s/redstone'
import { reya } from '../projects/layer2s/reya'
import { rhinofi } from '../projects/layer2s/rhinofi'
import { rise } from '../projects/layer2s/rise'
import { river } from '../projects/layer2s/river'
import { rss3 } from '../projects/layer2s/rss3'
import { rufus } from '../projects/layer2s/rufus'
import { scroll } from '../projects/layer2s/scroll'
import { shape } from '../projects/layer2s/shape'
import { shibarium } from '../projects/layer2s/shibarium'
import { silicon } from '../projects/layer2s/silicon'
import { singularityfinance } from '../projects/layer2s/singularityfinance'
import { snaxchain } from '../projects/layer2s/snaxchain'
import { socialnetwork } from '../projects/layer2s/socialnetwork'
import { solo } from '../projects/layer2s/solo'
import { soneium } from '../projects/layer2s/soneium'
import { soon } from '../projects/layer2s/soon'
import { sophon } from '../projects/layer2s/sophon'
import { sorare } from '../projects/layer2s/sorare'
import { specular } from '../projects/layer2s/specular'
import { starknet } from '../projects/layer2s/starknet'
import { status } from '../projects/layer2s/status'
import { stealthchain } from '../projects/layer2s/stealthchain'
import { superlumio } from '../projects/layer2s/superlumio'
import { superseed } from '../projects/layer2s/superseed'
import { swan } from '../projects/layer2s/swan'
import { swell } from '../projects/layer2s/swell'
import { sxnetwork } from '../projects/layer2s/sxnetwork'
import { sxt } from '../projects/layer2s/sxt'
import { t1 } from '../projects/layer2s/t1'
import { taiko } from '../projects/layer2s/taiko'
import { tanx } from '../projects/layer2s/tanx'
import { tea } from '../projects/layer2s/tea'
import { telos } from '../projects/layer2s/telos'
import { ten } from '../projects/layer2s/ten'
import { termstructure } from '../projects/layer2s/termstructure'
import { ternoa } from '../projects/layer2s/ternoa'
import { thanos } from '../projects/layer2s/thanos'
import { thebinaryholdings } from '../projects/layer2s/thebinaryholdings'
import { treasure } from '../projects/layer2s/treasure'
import { turboprotocol } from '../projects/layer2s/turboprotocol'
import { tusima } from '../projects/layer2s/tusima'
import { unichain } from '../projects/layer2s/unichain'
import { union } from '../projects/layer2s/union'
import { wirex } from '../projects/layer2s/wirex'
import { witness } from '../projects/layer2s/witness'
import { wonderfi } from '../projects/layer2s/wonderfi'
import { world } from '../projects/layer2s/world'
import { xchain } from '../projects/layer2s/xchain'
import { xlayer } from '../projects/layer2s/xlayer'
import { xpla } from '../projects/layer2s/xpla'
import { xsolla } from '../projects/layer2s/xsolla'
import { xterio } from '../projects/layer2s/xterio'
import { zentachain } from '../projects/layer2s/zentachain'
import { zeronetwork } from '../projects/layer2s/zeronetwork'
import { zircuit } from '../projects/layer2s/zircuit'
import { zkcandy } from '../projects/layer2s/zkcandy'
import { zkfair } from '../projects/layer2s/zkfair'
import { zklighter } from '../projects/layer2s/zklighter'
import { zkspace } from '../projects/layer2s/zkspace'
import { zkswap } from '../projects/layer2s/zkswap'
import { zkswap2 } from '../projects/layer2s/zkswap2'
import { zksyncera } from '../projects/layer2s/zksyncera'
import { zksynclite } from '../projects/layer2s/zksynclite'
import { zora } from '../projects/layer2s/zora'

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
