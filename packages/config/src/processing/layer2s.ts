import { HOMEPAGE_MILESTONES } from '../global/milestones'
import type { ScalingProject } from '../internalTypes'
import { abstract } from '../projects/abstract/abstract'
import { aevo } from '../projects/aevo/aevo'
import { aiechain } from '../projects/aiechain/aiechain'
import { alephzero } from '../projects/alephzero/alephzero'
import { alienx } from '../projects/alienx/alienx'
import { align } from '../projects/align/align'
import { allo } from '../projects/allo/allo'
import { ancient } from '../projects/ancient/ancient'
import { apex } from '../projects/apex/apex'
import { arbitrum } from '../projects/arbitrum/arbitrum'
import { arcology } from '../projects/arcology/arcology'
import { arenaz } from '../projects/arenaz/arenaz'
import { arithmic } from '../projects/arithmic/arithmic'
import { astarzkevm } from '../projects/astarzkevm/astarzkevm'
import { automata } from '../projects/automata/automata'
import { axonum } from '../projects/axonum/axonum'
import { azchain } from '../projects/azchain/azchain'
import { aztecV1 } from '../projects/aztec/aztecV1'
import { aztecV2 } from '../projects/aztecV2/aztecV2'
import { aztecconnect } from '../projects/aztecconnect/aztecconnect'
import { base } from '../projects/base/base'
import { blast } from '../projects/blast/blast'
import { bob } from '../projects/bob/bob'
import { bobanetwork } from '../projects/bobanetwork/bobanetwork'
import { tanx } from '../projects/brine/tanx'
import { camp } from '../projects/camp/camp'
import { canvasconnect } from '../projects/canvasconnect/canvasconnect'
import { capx } from '../projects/capx/capx'
import { celo } from '../projects/celo/celo'
import { corn } from '../projects/corn/corn'
import { coti } from '../projects/coti/coti'
import { creator } from '../projects/creator/creator'
import { creatorchain } from '../projects/creatorchain/creatorchain'
import { cronoszkevm } from '../projects/cronoszkevm/cronoszkevm'
import { cyber } from '../projects/cyber/cyber'
import { dbk } from '../projects/dbk/dbk'
import { dcamonster } from '../projects/dcamonster/dcamonster'
import { degate } from '../projects/degate/degate'
import { degate2 } from '../projects/degate2/degate2'
import { degate3 } from '../projects/degate3/degate3'
import { degenlayer } from '../projects/degenlayer/degenlayer'
import { destra } from '../projects/destra/destra'
import { rhinofi } from '../projects/deversifi/rhinofi'
import { dydx } from '../projects/dydx/dydx'
import { ebichain } from '../projects/ebichain/ebichain'
import { eclipse } from '../projects/eclipse/eclipse'
import { edgeless } from '../projects/edgeless/edgeless'
import { ethernity } from '../projects/ethernity/ethernity'
import { everclear } from '../projects/everclear/everclear'
import { facet } from '../projects/facet/facet'
import { fhenix } from '../projects/fhenix/fhenix'
import { fluence } from '../projects/fluence/fluence'
import { fluent } from '../projects/fluent/fluent'
import { form } from '../projects/form/form'
import { frame } from '../projects/frame/frame'
import { fraxtal } from '../projects/fraxtal/fraxtal'
import { fuel } from '../projects/fuel/fuel'
import { fuelv1 } from '../projects/fuelv1/fuelv1'
import { funki } from '../projects/funki/funki'
import { fuse } from '../projects/fuse/fuse'
import { galxegravity } from '../projects/galxegravity/galxegravity'
import { gameswift } from '../projects/gameswift/gameswift'
import { genlayer } from '../projects/genlayer/genlayer'
import { gluon } from '../projects/gluon/gluon'
import { gmnetwork } from '../projects/gmnetwork/gmnetwork'
import { gpt } from '../projects/gpt/gpt'
import { grvt } from '../projects/grvt/grvt'
import { gwyneth } from '../projects/gwyneth/gwyneth'
import { happychain } from '../projects/happychain/happychain'
import { hashkey } from '../projects/hashkey/hashkey'
import { haust } from '../projects/haust/haust'
import { hemi } from '../projects/hemi/hemi'
import { hermez } from '../projects/hermez/hermez'
import { honeypot } from '../projects/honeypot/honeypot'
import { hybrid } from '../projects/hybrid/hybrid'
import { hychain } from '../projects/hychain/hychain'
import { hypr } from '../projects/hypr/hypr'
import { immutablex } from '../projects/immutablex/immutablex'
import { immutablezkevm } from '../projects/immutablezkevm/immutablezkevm'
import { ink } from '../projects/ink/ink'
import { intmax } from '../projects/intmax/intmax'
import { kakarotzkevm } from '../projects/kakarotzkevm/kakarotzkevm'
import { karak } from '../projects/karak/karak'
import { kinto } from '../projects/kinto/kinto'
import { koi } from '../projects/koi/koi'
import { kontos } from '../projects/kontos/kontos'
import { kroma } from '../projects/kroma/kroma'
import { lachain } from '../projects/lachain/lachain'
import { lambda } from '../projects/lambda/lambda'
import { layer2finance } from '../projects/layer2finance/layer2finance'
import { layer2financezk } from '../projects/layer2financezk/layer2financezk'
import { layerai } from '../projects/layerai/layerai'
import { leaf } from '../projects/leaf/leaf'
import { lens } from '../projects/lens/lens'
import { liftchain } from '../projects/liftchain/liftchain'
import { lightlink } from '../projects/lightlink/lightlink'
import { linea } from '../projects/linea/linea'
import { lisk } from '../projects/lisk/lisk'
import { loopring } from '../projects/loopring/loopring'
import { lootchain } from '../projects/lootchain/lootchain'
import { lumia } from '../projects/lumia/lumia'
import { lyra } from '../projects/lyra/lyra'
import { mantapacific } from '../projects/mantapacific/mantapacific'
import { mantle } from '../projects/mantle/mantle'
import { memento } from '../projects/memento/memento'
import { metal } from '../projects/metal/metal'
import { metis } from '../projects/metis/metis'
import { millicent } from '../projects/millicent/millicent'
import { mint } from '../projects/mint/mint'
import { mode } from '../projects/mode/mode'
import { moonveil } from '../projects/moonveil/moonveil'
import { morph } from '../projects/morph/morph'
import { move } from '../projects/move/move'
import { myria } from '../projects/myria/myria'
import { myshell } from '../projects/myshell/myshell'
import { nal } from '../projects/nal/nal'
import { network3 } from '../projects/network3/network3'
import { neva } from '../projects/neva/neva'
import { nil } from '../projects/nil/nil'
import { nova } from '../projects/nova/nova'
import { oev } from '../projects/oevnetwork/oev'
import { ola } from '../projects/ola/ola'
import { omgnetwork } from '../projects/omgnetwork/omgnetwork'
import { openzk } from '../projects/openzk/openzk'
import { optimism } from '../projects/optimism/optimism'
import { optopia } from '../projects/optopia/optopia'
import { orderly } from '../projects/orderly/orderly'
import { ozean } from '../projects/ozean/ozean'
import { palm } from '../projects/palm/palm'
import { pandasea } from '../projects/pandasea/pandasea'
import { paradex } from '../projects/paradex/paradex'
import { parallel } from '../projects/parallel/parallel'
import { patex } from '../projects/patex/patex'
import { payy } from '../projects/payy/payy'
import { penchain } from '../projects/penchain/penchain'
import { pepeunchained } from '../projects/pepeunchained/pepeunchained'
import { phala } from '../projects/phala/phala'
import { plumenetwork } from '../projects/plumenetwork/plumenetwork'
import { polygonpos } from '../projects/polygon-pos/polygonpos'
import { polygonmiden } from '../projects/polygonmiden/polygonmiden'
import { polygonpos2 } from '../projects/polygonpos2/polygonpos2'
import { polygonzkevm } from '../projects/polygonzkevm/polygonzkevm'
import { polynomial } from '../projects/polynomial/polynomial'
import { publicgoodsnetwork } from '../projects/publicgoodsnetwork/publicgoodsnetwork'
import { puffer } from '../projects/puffer/puffer'
import { quarkchain } from '../projects/quarkchain/quarkchain'
import { r0ar } from '../projects/r0ar/r0ar'
import { race } from '../projects/race/race'
import { real } from '../projects/real/real'
import { reddioex } from '../projects/reddioex/reddioex'
import { reddiozkvm } from '../projects/reddiozkvm/reddiozkvm'
import { redstone } from '../projects/redstone/redstone'
import { reya } from '../projects/reya/reya'
import { rise } from '../projects/rise/rise'
import { river } from '../projects/river/river'
import { rss3 } from '../projects/rss3/rss3'
import { rufus } from '../projects/rufus/rufus'
import { scroll } from '../projects/scroll/scroll'
import { shape } from '../projects/shape/shape'
import { shibarium } from '../projects/shibarium/shibarium'
import { silicon } from '../projects/silicon/silicon'
import { singularityfinance } from '../projects/singularityfinance/singularityfinance'
import { skatechain } from '../projects/skatechain/skatechain'
import { snaxchain } from '../projects/snaxchain/snaxchain'
import { socialnetwork } from '../projects/socialnetwork/socialnetwork'
import { solo } from '../projects/solo/solo'
import { soneium } from '../projects/soneium/soneium'
import { soon } from '../projects/soon/soon'
import { sophon } from '../projects/sophon/sophon'
import { sorare } from '../projects/sorare/sorare'
import { specular } from '../projects/specular/specular'
import { starknet } from '../projects/starknet/starknet'
import { status } from '../projects/status/status'
import { superlumio } from '../projects/superlumio/superlumio'
import { superseed } from '../projects/superseed/superseed'
import { swan } from '../projects/swan/swan'
import { swell } from '../projects/swell/swell'
import { sxnetwork } from '../projects/sxnetwork/sxnetwork'
import { sxt } from '../projects/sxt/sxt'
import { t1 } from '../projects/t1/t1'
import { taiko } from '../projects/taiko/taiko'
import { tea } from '../projects/tea/tea'
import { telos } from '../projects/telos/telos'
import { ten } from '../projects/ten/ten'
import { termstructure } from '../projects/termstructure/termstructure'
import { ternoa } from '../projects/ternoa/ternoa'
import { thanos } from '../projects/thanos/thanos'
import { thebinaryholdings } from '../projects/thebinaryholdings/thebinaryholdings'
import { treasure } from '../projects/treasure/treasure'
import { turboprotocol } from '../projects/turboprotocol/turboprotocol'
import { tusima } from '../projects/tusima/tusima'
import { unichain } from '../projects/unichain/unichain'
import { union } from '../projects/union/union'
import { wirex } from '../projects/wirex/wirex'
import { witness } from '../projects/witness/witness'
import { wonderfi } from '../projects/wonderfi/wonderfi'
import { world } from '../projects/worldchain/world'
import { xchain } from '../projects/xchain/xchain'
import { xlayer } from '../projects/xlayer/xlayer'
import { xpla } from '../projects/xpla/xpla'
import { xsolla } from '../projects/xsolla/xsolla'
import { xterio } from '../projects/xterio/xterio'
import { zentachain } from '../projects/zentachain/zentachain'
import { zeronetwork } from '../projects/zeronetwork/zeronetwork'
import { zircuit } from '../projects/zircuit/zircuit'
import { zkcandy } from '../projects/zkcandy/zkcandy'
import { zkfair } from '../projects/zkfair/zkfair'
import { zklighter } from '../projects/zklighter/zklighter'
import { zkspace } from '../projects/zkspace/zkspace'
import { zkswap } from '../projects/zkswap/zkswap'
import { zkswap2 } from '../projects/zkswap2/zkswap2'
import { zksynclite } from '../projects/zksync/zksynclite'
import { zksyncera } from '../projects/zksync2/zksyncera'
import { zora } from '../projects/zora/zora'

export const layer2s: ScalingProject[] = [
  abstract,
  aevo,
  aiechain,
  alephzero,
  alienx,
  align,
  allo,
  ancient,
  apex,
  arbitrum,
  arcology,
  arenaz,
  arithmic,
  astarzkevm,
  automata,
  axonum,
  azchain,
  aztecconnect,
  aztecV1,
  aztecV2,
  base,
  blast,
  bob,
  bobanetwork,
  camp,
  canvasconnect,
  capx,
  celo,
  corn,
  coti,
  creator,
  creatorchain,
  cronoszkevm,
  cyber,
  dbk,
  dcamonster,
  degate,
  degate2,
  degate3,
  degenlayer,
  destra,
  dydx,
  ebichain,
  eclipse,
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
  galxegravity,
  gameswift,
  genlayer,
  gluon,
  gmnetwork,
  gpt,
  grvt,
  gwyneth,
  happychain,
  hashkey,
  haust,
  hemi,
  hermez,
  honeypot,
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
  layer2finance,
  layer2financezk,
  layerai,
  leaf,
  lens,
  liftchain,
  lightlink,
  linea,
  lisk,
  loopring,
  lootchain,
  lumia,
  lyra,
  mantapacific,
  mantle,
  memento,
  metal,
  metis,
  millicent,
  mint,
  mode,
  moonveil,
  morph,
  move,
  myria,
  myshell,
  nal,
  network3,
  neva,
  nil,
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
  polygonpos,
  polygonpos2,
  polygonzkevm,
  polynomial,
  publicgoodsnetwork,
  puffer,
  quarkchain,
  r0ar,
  race,
  real,
  reddioex,
  reddiozkvm,
  redstone,
  reya,
  rhinofi,
  rise,
  river,
  rss3,
  rufus,
  scroll,
  shape,
  shibarium,
  silicon,
  singularityfinance,
  skatechain,
  snaxchain,
  socialnetwork,
  solo,
  soneium,
  soon,
  sophon,
  sorare,
  specular,
  starknet,
  status,
  superlumio,
  superseed,
  swan,
  swell,
  sxnetwork,
  sxt,
  t1,
  taiko,
  tanx,
  tea,
  telos,
  ten,
  termstructure,
  ternoa,
  thanos,
  thebinaryholdings,
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
